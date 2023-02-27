import dayjs, { Dayjs } from "dayjs";
import * as tpprequests from "./requests"

export interface TTPAppointmentSlot {
	readonly start: Dayjs,
	readonly end: Dayjs,
	activeSpots: number,
	totalSpots: number,
}

class TPPAppointmentSlotImpl implements TTPAppointmentSlot {
	public readonly start: Dayjs;
	public readonly end: Dayjs;

	constructor(start: string, end: string) {
		this.start = dayjs(start);
		this.end = dayjs(end);
	}

	public activeSpots: number = 0;
	public totalSpots: number = 0;
}

export interface TTPAppointmentDay {
	readonly date: Dayjs,
	readonly activeSlots: Map<string, TTPAppointmentSlot>,

	readonly activeSlotCount: number;

	getSlotsOptions(apptRequired: number): TTPAppointmentSlot[][];
}

class TTPAppointmentDayImpl implements TTPAppointmentDay {
	public readonly date: Dayjs;
	public readonly activeSlots = new Map<string, TTPAppointmentSlot>();

	constructor(date: Dayjs) {
		this.date = date;
	}

	public get activeSlotCount() {
		let runningSlots: number = 0;
		for (const slot of this.activeSlots.values()) {
			runningSlots = runningSlots + slot.activeSpots;
		}
		return runningSlots;
	}

	public getSlotsOptions(apptRequired: number): TTPAppointmentSlot[][] {
		const results = new Array<TTPAppointmentSlot[]>();
		const activeSlots = Array.from(this.activeSlots.values());
		for (let start = 0; start < activeSlots.length; start++) {
			const candidate = new Array<TTPAppointmentSlot>();
			let runningApptCount = 0;
			for (let end = start; end < activeSlots.length; end++) {
				candidate.push(activeSlots[end]);
				runningApptCount = runningApptCount + activeSlots[end].activeSpots;
				if (runningApptCount >= apptRequired) {
					break;
				}
			}

			if (runningApptCount >= apptRequired) {
				results.push(candidate);
			}
		}

		return results;
	}
}

const dumpAppointmentDays = (appointmentDays: Map<string, TTPAppointmentDay>) => {
	for (const appointmentDay of appointmentDays.values()) {
		dumpAppointmentDay(appointmentDay);
	}
}

export const dumpAppointmentDay = (appointmentDay: TTPAppointmentDay) => {
	console.log(`Appointment Date: ${appointmentDay.date.format('YYYY-MM-DD')}`);
	for (const appointmentSlot of appointmentDay.activeSlots.values()) {
		console.log(`  Slot: ${JSON.stringify({start: appointmentSlot.start.format('HH:mm'), active: appointmentSlot.activeSpots, total: appointmentSlot.totalSpots})}`);
	}
}

export const findSoonestAppointments = async (locationId: string, beforeDate?: Dayjs): Promise<Map<string, TTPAppointmentDay>> => {
	const response = await tpprequests.fetchSlotsByLocationId(locationId);
	// console.log(JSON.stringify(response, null, 2));

	// Find the days
	const appointmentDays = new Map<string, TTPAppointmentDay>();
	response.forEach(slot => {
		const dateString = dayjs(slot.startTimestamp).format("YYYY-MM-DD");
		const date = dayjs(dateString);

		// Ignore any that's later than beforeDate
		if (!beforeDate || date.isBefore(beforeDate)) {
			if (!appointmentDays.has(dateString)) {
				// console.log(`TimeSlot: ${slot.startTimestamp} maps to date: ${dateString}`);
				appointmentDays.set(dateString, new TTPAppointmentDayImpl(date));
			}
	
			const appointmentDay = appointmentDays.get(dateString);
			if (appointmentDay) {
				// console.log(`Adding timeslot: ${slot.startTimestamp} to ${dateString}`);
				appointmentDay.activeSlots.set(slot.startTimestamp, new TPPAppointmentSlotImpl(slot.startTimestamp, slot.endTimestamp))
			}
		}
	});

	// Find the active spots for each slot
	for (const appointmentDay of appointmentDays.values()) {
		// console.log(`Fetching slots for ${appointmentDay.date}`);
		const slotDetails = await tpprequests.fetchSlotsByDay(locationId, appointmentDay.date);
		slotDetails.forEach(slotDetails => {
			if (slotDetails.active > 0) {
				const slot = appointmentDay.activeSlots.get(slotDetails.timestamp);
				if (slot) {
					slot.activeSpots = slotDetails.active;
					slot.totalSpots = slotDetails.total;
				}
			}
		});
	}

	// dumpAppointmentDays(appointmentDays);
	return appointmentDays;
}
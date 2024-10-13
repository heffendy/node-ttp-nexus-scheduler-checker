import dayjs, { type Dayjs } from 'dayjs'
import { type BookingCandidate, type ITTPAppointmentDay, TTPAppointmentSlot } from './interface'
import * as tpprequests from './requests'

export class TTPAppointmentDay implements ITTPAppointmentDay {
  public readonly date: Dayjs
  public readonly activeSlots: Set<TTPAppointmentSlot>
  public readonly activeApptCount: number

  constructor (date: Dayjs, activeSlots: Set<TTPAppointmentSlot>) {
    this.date = date
    this.activeSlots = activeSlots

    let runningApptCount = 0
    for (const slot of this.activeSlots.values()) {
      runningApptCount = runningApptCount + slot.availableSpots
    }
    this.activeApptCount = runningApptCount
  }

  public getBookingCandidates (apptRequired: number): BookingCandidate[] {
    const results = new Array<BookingCandidate>()
    const activeSlots = [...this.activeSlots.values()]
    for (let start = 0; start < activeSlots.length; start++) {
      const candidate = new Array<TTPAppointmentSlot>()
      let runningApptCount = 0
      for (let end = start; end < activeSlots.length; end++) {
        candidate.push(activeSlots[end])
        runningApptCount = runningApptCount + activeSlots[end].availableSpots
        if (runningApptCount >= apptRequired) {
          break
        }
      }

      if (runningApptCount >= apptRequired) {
        results.push(candidate)
      }
    }

    return results
  }
}

/**
 * Finds the soonest appointments available
 * @param locationId - The location Id to query appointment for
 * @param beforeDate - An optional date to find appointments earlier by
 */
export const findSoonestAppointments = async (locationId: string, beforeDate?: Dayjs): Promise<Set<TTPAppointmentDay>> => {
  // Internal data structure
  class TTPAppointmentDayIntermediate {
    public readonly date: Dayjs
    public readonly activeSlotsMap = new Map<string, TTPAppointmentSlot>()

    constructor (date: Dayjs) {
      this.date = date
    }
  }

  const response = await tpprequests.fetchSlotsByLocationId(locationId)
  // console.log(JSON.stringify(response, null, 2));

  // Determine the days from the slots returned
  const apptDayIntsMap = new Map<string, TTPAppointmentDayIntermediate>()
  for (const slot of response) {
    const dateString = dayjs(slot.startTimestamp).format('YYYY-MM-DD')
    const date = dayjs(dateString)

    // Ignore any that's later than beforeDate
    if ((beforeDate === undefined) || !beforeDate.isValid() || date.isBefore(beforeDate)) {
      if (!apptDayIntsMap.has(dateString)) {
        // console.log(`TimeSlot: ${slot.startTimestamp} maps to date: ${dateString}`);
        apptDayIntsMap.set(dateString, new TTPAppointmentDayIntermediate(date))
      }

      const apptDayInt = apptDayIntsMap.get(dateString)
      if (apptDayInt !== undefined) {
        // console.log(`Adding timeslot: ${slot.startTimestamp} to ${dateString}`);
        apptDayInt.activeSlotsMap.set(slot.startTimestamp, new TTPAppointmentSlot(slot.startTimestamp, slot.endTimestamp))
      }
    }
  }

  // Populate the available spots for each slot
  const apptDays = new Set<TTPAppointmentDay>()
  for (const apptDayInt of apptDayIntsMap.values()) {
    // console.log(`Fetching slots for ${appointmentDay.date}`);
    const slotDetails = await tpprequests.fetchSlotsByDay(locationId, apptDayInt.date)
    for (const slotDetail of slotDetails) {
      if (slotDetail.active > 0) {
        const slot = apptDayInt.activeSlotsMap.get(slotDetail.timestamp)
        if (slot !== undefined) {
          slot.availableSpots = slotDetail.active
          slot.totalSpots = slotDetail.total
        }
      }
    }

    apptDays.add(new TTPAppointmentDay(apptDayInt.date, new Set(apptDayInt.activeSlotsMap.values())))
  }

  // dumpAppointmentDays(apptDays);
  return apptDays
}

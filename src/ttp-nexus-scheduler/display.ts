import { BookingCandidate } from "./interface";

export const printBookingCandidates = (candidates: BookingCandidate[]) => {
	for (let i = 0; i < candidates.length; i++) {
		printBookingCandiate(candidates[i]);
	}
}

export const printBookingCandiate = (candidate: BookingCandidate) => {
	for (let i = 0; i < candidate.length; i++) {
		const slot = candidate[i];
		console.log(`  Slot [${i+1}/${candidate.length}] - Date/Time: ${slot.start.format("YYYY/MM/DD - hh:mm A")} (${slot.availableSpots} appt(s))`);
	}
	console.log(`\r\n`);
}
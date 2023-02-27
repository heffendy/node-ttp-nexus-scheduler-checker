import { type BookingCandidate } from './interface'

export const printBookingCandidates = (candidates: BookingCandidate[]): void => {
  for (const candidate of candidates) {
    printBookingCandiate(candidate)
  }
}

export const printBookingCandiate = (candidate: BookingCandidate): void => {
  for (let index = 0; index < candidate.length; index++) {
    const slot = candidate[index]
    console.log(`  Slot [${index + 1}/${candidate.length}] - Date/Time: ${slot.start.format('YYYY/MM/DD - hh:mm A')} (${slot.availableSpots} appt(s))`)
  }
  console.log('\r\n')
}

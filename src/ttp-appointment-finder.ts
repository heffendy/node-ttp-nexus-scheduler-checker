import dayjs from 'dayjs'
import { printBookingCandidates } from './ttp-nexus-scheduler/display'
import { findSoonestAppointments } from './ttp-nexus-scheduler/model'
import { soundAlert } from './utilities/alert'
import { delaySeconds } from './utilities/delay'

const iteration = async (
  locationId: string,
  earlierByDate: string,
  datesToExclude: string[],
  apptRequired: number): Promise<boolean> => {
  // Step 1: Query for the available slots sorted by soonest
  const appointmentDays = await findSoonestAppointments(locationId, dayjs(earlierByDate))

  // Step 2: Find the days with booking candidates
  for (const appointmentDay of appointmentDays.values()) {
    if (
      appointmentDay.activeApptCount >= apptRequired &&
      !datesToExclude.includes(appointmentDay.date.format('YYYY-MM-DD'))
    ) {
      const bookingCandidates = appointmentDay.getBookingCandidates(apptRequired)
      printBookingCandidates(bookingCandidates)
      return true
    }
  }

  return false
}

const delayBetweenIteration = 900 // 15 mins
export const pollForAppointmentSlots = async (
  locationId: string,
  earlierByDate: string,
  datesToExclude: string[],
  apptRequired: number): Promise<void> => {
  let found = false
  while (!found) {
    found = await iteration(locationId, earlierByDate, datesToExclude, apptRequired)

    if (!found) {
      console.log(`No appointment matching criteria found; retrying in ${delayBetweenIteration} seconds`)
      await delaySeconds(delayBetweenIteration)
    }
  }

  while (true) {
    soundAlert()
    await delaySeconds(1)
  }
}

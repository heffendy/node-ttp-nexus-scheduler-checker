import dayjs from "dayjs";
import { dumpAppointmentDay, findSoonestAppointments } from "./ttp-nexus-scheduler/model";
import { delay } from "./utilities/delay";

const iteration = async (locationId: string, earlierByDate: string, apptRequired: number, timeWindowInHours: number): Promise<boolean> => {
  // Step 1: Query for the available slots sorted by soonest
  const appointmentDays = await findSoonestAppointments(locationId, dayjs(earlierByDate));

  // Step 2: Find the days with required slots
  for (const appointmentDay of appointmentDays.values()) {
    if (appointmentDay.activeSlotCount >= apptRequired) {
      console.log(`Found Appointment Day with matching slots:`);
      const slotCandidates = appointmentDay.getSlotsOptions(apptRequired);
      console.log(JSON.stringify(slotCandidates, null, 2));
      return true;
    }
  }

  return false;
}

const delayBetweenIteration = 5;

export const pollForAppointmentSlots = async (locationId: string, earlierByDate: string, apptRequired: number, timeWindowInHours: number) => {
  let found = false;
  while (!found) {
    found = await iteration(locationId, earlierByDate, apptRequired, timeWindowInHours);

    if (!found) {
      console.log(`No appointment found; retrying in ${delayBetweenIteration} seconds`);
      await delay(delayBetweenIteration);
    }
  }
}
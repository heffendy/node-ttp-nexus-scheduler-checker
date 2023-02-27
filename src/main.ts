import { pollForAppointmentSlots } from './ttp-appointment-finder'
import * as params from "./.params.json";

// https://stackoverflow.com/questions/46515764/how-can-i-use-async-await-at-the-top-level/56590390#56590390
(async () => {
	console.log(`Executing with the following parameters:\r\n${JSON.stringify(params, null, 2)}`);
	await pollForAppointmentSlots(params.locationId, params.earlierByDate, params.numberOfAppts);
  })();
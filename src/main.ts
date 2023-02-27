import { pollForAppointmentSlots } from './ttp-appointment-finder'
import * as parameters from './.params.json';

// https://stackoverflow.com/questions/46515764/how-can-i-use-async-await-at-the-top-level/56590390#56590390
// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
(async () => {
  console.log(`Executing with the following parameters:\r\n${JSON.stringify(parameters, undefined, 2)}`)
  await pollForAppointmentSlots(
    parameters.locationId,
    parameters.earlierByDate,
    parameters.datesToExclude,
    parameters.numberOfAppts)
})()

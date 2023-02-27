import { Dayjs } from "dayjs";
import { request } from "../utilities/request";

interface TTPSchedulerSoonestSlot {
	locationId: number,
	startTimestamp: string,
	endTimestamp: string,
	active: boolean,
	duration: number
  }
  
  export const fetchSlotsByLocationId = async (locationId: string) => {
	const query = `https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&locationId=${locationId}&minimum=1&limit=200`
	const response = await request<TTPSchedulerSoonestSlot[]>(query, {
	  method: "GET"
	  });
  
	return response;
  }
  
  interface TTPSchedulerSlotDetails {
	active: number,
	total: number,
	timestamp: string
  }

  export const fetchSlotsByDay = async (locationId: string, date: Dayjs) => {
	const schedulerDateTimeFormat = "YYYY-MM-DDTHH:mm";
	const startTimestamp = date.hour(8).format(schedulerDateTimeFormat);
	const endTimestamp = date.hour(18).format(schedulerDateTimeFormat);
	const query = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;
	const response = await request<TTPSchedulerSlotDetails[]>(query, {
		method: "GET"
	});

	return response;
  }
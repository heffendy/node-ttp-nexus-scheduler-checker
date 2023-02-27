import { type Dayjs } from 'dayjs'
import { request } from '../utilities/request'

interface TTPSchedulerSoonestSlot {
  locationId: number
  startTimestamp: string
  endTimestamp: string
  active: boolean
  duration: number
}

export const fetchSlotsByLocationId = async (locationId: string): Promise<TTPSchedulerSoonestSlot[]> => {
  const query = `https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&locationId=${locationId}&minimum=1&limit=200`
  return await request<TTPSchedulerSoonestSlot[]>(query, {
    method: 'GET'
  })
}

interface TTPSchedulerSlotDetail {
  active: number
  total: number
  timestamp: string
}

export const fetchSlotsByDay = async (locationId: string, date: Dayjs): Promise<TTPSchedulerSlotDetail[]> => {
  const schedulerDateTimeFormat = 'YYYY-MM-DDTHH:mm'
  const startTimestamp = date.hour(8).format(schedulerDateTimeFormat)
  const endTimestamp = date.hour(18).format(schedulerDateTimeFormat)
  const query = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
  return await request<TTPSchedulerSlotDetail[]>(query, {
    method: 'GET'
  })
}

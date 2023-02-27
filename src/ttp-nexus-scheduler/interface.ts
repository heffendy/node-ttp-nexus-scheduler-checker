import dayjs, { type Dayjs } from 'dayjs'

export class TTPAppointmentSlot {
  public readonly start: Dayjs
  public readonly end: Dayjs

  constructor (start: string, end: string) {
    this.start = dayjs(start)
    this.end = dayjs(end)
  }

  public availableSpots: number = 0
  public totalSpots: number = 0
}

export type BookingCandidate = TTPAppointmentSlot[]

export interface ITTPAppointmentDay {
  readonly date: Dayjs
  readonly activeSlots: Set<TTPAppointmentSlot>
  readonly activeApptCount: number

  getBookingCandidates: (apptRequired: number) => BookingCandidate[]
}

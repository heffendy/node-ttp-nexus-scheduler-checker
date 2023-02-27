import { type ITTPAppointmentDay } from './interface'

export const dumpAppointmentDays = (appointmentDays: Set<ITTPAppointmentDay>): void => {
  for (const appointmentDay of appointmentDays.values()) {
    dumpAppointmentDay(appointmentDay)
  }
}

export const dumpAppointmentDay = (appointmentDay: ITTPAppointmentDay): void => {
  console.log(`Appointment Date: ${appointmentDay.date.format('YYYY-MM-DD')}`)
  for (const appointmentSlot of appointmentDay.activeSlots.values()) {
    console.log(`  Slot: ${JSON.stringify({ start: appointmentSlot.start.format('HH:mm'), active: appointmentSlot.availableSpots, total: appointmentSlot.totalSpots })}`)
  }
}

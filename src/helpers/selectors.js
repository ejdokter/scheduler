export function getAppointmentsForDay(state, day) {

  if (state.days.length < 1) return []
  
  for (const i of state.days) {
    // console.log(i.name)
    let appointments = []
    if (i.name === day) {
      for (const x of i.appointments) {
        // console.log(i.appointments)
        appointments.push(state.appointments[x])
      }
      // console.log(appointments)
      return appointments
    }
  }
  return []
}
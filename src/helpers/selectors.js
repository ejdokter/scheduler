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

export function getInterview(state, interview) {
  if (!interview) return null;

  const result = {}

  result.student = interview.student
  result.interviewer = state.interviewers[interview.interviewer]
  
  return result
}

export function getInterviewersForDay(state, day) {
  if (state.days.length < 1) return []

  for (const i of state.days) {
    // console.log(i.name)
    let interviewers = []
    if (i.name === day) {
      for (const x of i.interviewers) {
        // console.log(i.appointments)
        interviewers.push(state.interviewers[x])
      }
      console.log(interviewers)
      return interviewers
    }
  }
  return []
}
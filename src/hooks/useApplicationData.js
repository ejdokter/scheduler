import { useState, useEffect } from "react";
import axios from "axios"
import { getSpotsForDay } from "helpers/selectors";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day})
  // const setDays = days => setState(prev => ({ ...prev, days}))

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

  function updateSpots(state, appointments, id) {

    const dayObj = state.days.find(day => day.name === state.day);
    const spots = getSpotsForDay(dayObj, appointments)

    const day = {...dayObj, spots}

    return state.days.map(d => d.name === state.day ? day : d)
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    console.log(appointment)

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const days = updateSpots(state, appointments, id)

    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview:interview})
    .then(() => {
      setState({ ...state, appointments, days})
    })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    console.log(appointment)

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const days = updateSpots(state, appointments, id)

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => {
      setState({ ...state, appointments, days})
    })
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
import React, { useState, useEffect } from "react";
import axios from "axios"

import "components/Application.scss";
import DayList from "components/DayList.js"
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";



export default function Application(props) {

  // const [day, setDay] = useState([])
  // const [days, setDays] = useState([])

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day})
  // const setDays = days => setState(prev => ({ ...prev, days}))

  useEffect(() => {
    // axios.get('http://localhost:8001/api/days')
    // .then(response => {
    //   console.log(response)
    //   // setDays(response.data)
    // })
    // .catch(err => console.log(err))
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      // console.log(all[0])
      // console.log(all[1])
      console.log(all[2])
    })
  }, [])

  function bookInterview(id, interview) {
    console.log(id, interview)
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
    console.log(appointment)

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    setState({
      ...state,
      appointments
    })
  }


  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)
  // console.log(interviewers)
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview)
    return (
      <Appointment
      key={appointment.id} {...appointment}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      />
    )
  })
  

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" bookInterview={bookInterview} />
      </section>
    </main>
  );
}

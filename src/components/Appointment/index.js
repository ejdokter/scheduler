import React, { Fragment } from 'react'
import "components/Appointment/styles.scss"

import Header from "./Header.js"
import Show from "./Show.js"
import Empty from "./Empty.js"
import useVisualMode from 'hooks/useVisualMode.js'
import Form from './Form.js'
import Status from './Status.js'
import Confirm from './Confirm.js'
import axios from 'axios'


export default function Appointment(props) {
  // console.log(props)

  const EMPTY = "EMPTY"
  const SHOW = "SHOW"
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  function save(name, interviewer) {
    console.log("name", name, "interviewer", interviewer)
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING)

    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW)
    })
  }

  function deleteAppointment() {
    if (mode === CONFIRM) {
      transition(DELETING)
      props.cancelInterview(props.id).then(() => {
        transition(EMPTY)
      })
    } else {
      transition(CONFIRM)
    }
  }

  function editAppointment() {
    console.log(props.interview.student, props.interview.interviewer)
    transition(EDIT)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteAppointment}
          onEdit={editAppointment}
        />
      )}
      {mode === CREATE && (
        <Form 
          name={props.name}
          value={props.value}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}

        />
      )}
      {mode === SAVING && (
        <Status message="Saving"/>
      )}
      {mode === DELETING && (
        <Status message="Deleting"/>
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you wish to delete?"
          onCancel={back}
          onConfirm={deleteAppointment}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}          
        />
      )}
    </article>
    
  )
}
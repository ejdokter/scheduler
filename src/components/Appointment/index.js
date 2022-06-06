import React, { Fragment } from 'react'
import "components/Appointment/styles.scss"

import Header from "./Header.js"
import Show from "./Show.js"
import Empty from "./Empty.js"
import useVisualMode from 'hooks/useVisualMode.js'
import Form from './Form.js'
import Status from './Status.js'
import Confirm from './Confirm.js'
import Error from './Error.js'
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
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE"

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
    .catch(() => { transition(ERROR_SAVE, true) })
  }

  function deleteAppointment() {
    if (mode === CONFIRM) {
      transition(DELETING, true)
      props.cancelInterview(props.id)
      .then(() => {transition(EMPTY)})
      .catch(() => {transition(ERROR_DELETE, true)})
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
      {mode === ERROR_SAVE && (
        <Error 
          message="Could not create appointment"
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error 
          message="Could not delete appointment"
          onClose={back}
        />
      )}
    </article>
    
  )
}
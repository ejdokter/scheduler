import React, { Fragment } from 'react'
import "components/Appointment/styles.scss"

import Header from "./Header.js"
import Show from "./Show.js"
import Empty from "./Empty.js"
import useVisualMode from 'hooks/useVisualMode.js'
import Form from './Form.js'


export default function Appointment(props) {
  const EMPTY = "EMPTY"
  const SHOW = "SHOW"
  const CREATE = "CREATE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form 
          name={props.name}
          value={props.value}
          interviewers={props.interviewers}
          onCancel={back}

        />

      )}
    </article>
    
  )
}
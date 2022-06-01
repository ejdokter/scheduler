import React, { useState } from "react"


import Button from "../Button.js"
import InterviewerList from "components/InterviewerList"

export default function Form(props) {

  const [student, setStudent] = useState(props.student || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)

  function reset() {
    setStudent("")
    setInterviewer(null)
  }

  function cancel() {
    reset()
    props.onCancel()
  }

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={(e) => setStudent(e.target.value)}
            value={student}
          />
        </form>
        <InterviewerList 
          interviewers={props.interviewers}
          interviewer={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={() => cancel()} danger>Cancel</Button>
          <Button onClick={props.onSave} confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}
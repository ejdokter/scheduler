import React from "react";
import classNames from "classnames";

import "components/InterviewerList.scss"
import InterviewerListItem from "./InterviewerListItem.js";

export default function InterviewerList(props) {
// console.log("props", props)
  const interviewersList = props.interviewers.map((interviewer) => {
    console.log("interviewer:", interviewer)
    return (
      <InterviewerListItem
        key = {interviewer.id}
        name = {interviewer.name}
        avatar = {interviewer.avatar}
        selected = {interviewer.id === props.value}
        setInterviewer = {() => props.onChange(interviewer.id)}
      />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  )
}
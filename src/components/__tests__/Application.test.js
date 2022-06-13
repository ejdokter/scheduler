import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  fireEvent,
  prettyDOM,
  getAllByAltText,
  getAllByTestId,
  getByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  waitForElementToBeRemoved,
  getByDisplayValue,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    // click delete button
    fireEvent.click(getByAltText(appointment, "Delete"));
    // transition to confirm delete
    expect(
      getByText(appointment, "Are you sure you wish to delete?")
    ).toBeInTheDocument();
    // click confirm
    fireEvent.click(getByText(appointment, "Confirm"));
    // transition to deleting
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // delete
    await waitForElementToBeRemoved(() => queryByText(appointment, "Deleting"));
    expect(queryByText(appointment, "Archie Cohen")).not.toBeInTheDocument();
    // reduce spots remaining by 1
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
    // console.log(prettyDOM(appointments));
    // debug();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // render the application
    const { container, debug } = render(<Application />);

    // wait for element to be loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // click the edit button on the appointment
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // change the name
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Lydia Miller-Jones" },
    });
    // save the edit
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // confirm the change
    await waitForElementToBeRemoved(() => queryByText(appointment, "Saving"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // confirm spots remaining stayed the same
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    // console.log(prettyDOM(appointment));
    // debug();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // render the page
    const { container, debug } = render(<Application />);

    // wait for request to load
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // add new interview
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // click save
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => expect(getByText(appointment, "Saving")));

    // show error
    expect(getByText(appointment, "Error")).toBeInTheDocument();
    // console.log(prettyDOM(appointment));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    // click delete button
    fireEvent.click(getByAltText(appointment, "Delete"));

    // transition to confirm delete
    expect(
      getByText(appointment, "Are you sure you wish to delete?")
    ).toBeInTheDocument();

    // click confirm
    fireEvent.click(getByText(appointment, "Confirm"));

    // transition to deleting
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => expect(getByText(appointment, "Deleting")));

    // show error
    expect(getByText(appointment, "Error")).toBeInTheDocument();
    // console.log(prettyDOM(appointment));
  });
});

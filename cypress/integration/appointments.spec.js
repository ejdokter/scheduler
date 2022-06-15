describe("Appointments", () => {
  beforeEach(() => {
    // Reset test db
    cy.request("GET", "http://localhost:8001/api/debug/reset");

    // Vist page
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    // Click add button on second appointment
    cy.get("[alt=Add]").first().click();

    // Enters student name
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    // Choose an interviewer
    cy.get("[alt='Sylvia Palmer']").click();

    // Clicks save
    cy.contains("Save").click();

    // See booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // Click edit button
    cy.get("[alt=Edit]").first().invoke("show").click();

    // Change student name
    cy.get("[data-testid=student-name-input]").clear().type("Eric Dokter");

    // Change interviewer
    cy.get("[alt='Tori Malcolm']").click();

    // Click Save
    cy.contains("Save").click();

    // See edited appointment
    cy.contains(".appointment__card--show", "Eric Dokter");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    // Click delete button
    cy.get("[alt=Delete]").first().click({ force: true });

    // Click confirm button
    cy.contains("Confirm").click();

    // Confirm appointment is deleted
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});

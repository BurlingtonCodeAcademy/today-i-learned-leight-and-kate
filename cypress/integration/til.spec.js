describe("React Client", () => {
  it("Visits the page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Today I Learned");
  });
  it("Creates an entry", () => {
    cy.get("#title").type("Testing");
    cy.get("#author").type("Cypress");
    cy.get("#body").type("Testing with Cypress is fun.");
    cy.get("input[type='submit']").click();

    cy.wait(250);

    cy.get(".Entry-title").contains("Testing");
    cy.get(".Entry-author").contains("Cypress");
    cy.get(".Entry-body").contains("Testing with Cypress is fun.");

    cy.get(".status").contains("Entry successfully posted!");
  });
  it("Clears the form after creation", () => {
    cy.get("#title").should("be.empty");
    cy.get("#author").should("be.empty");
    cy.get("#body").should("be.empty");
  });

  it("Prevents empty title updates", () => {
    cy.get("#edit").click();
    cy.get("#title").clear();
    cy.get("input[type='submit']").click();
    cy.get(".status").contains("Entry must have a title");
  });
  it("Cancel returns entry to original state", () => {
    cy.get("#cancel").click();
    cy.get(".Entry-title").contains("Testing");
  });
  it("Edits the entry", () => {
    cy.get("#edit").click();
    cy.get("#title").clear();
    cy.get("#title").type("Edit");
    cy.get("input[type='submit']").click();

    cy.wait(250);

    cy.get(".Entry-title").contains("Edit");
  });

  it("Deletes the entry", () => {
    cy.get("#delete").click();

    cy.get(".Entry-title").should("not.contain", "Testing");
    cy.get(".Entry-author").should("not.contain", "Cypress");
    cy.get(".Entry-body").should("not.contain", "Testing with Cypress is fun.");
  });
});

import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/Login";
import UserContext from "../../src/pages/UserContext";

describe("Test User Login", () => {
  let setUserStub;
  let setIsOnlineStub;

  beforeEach(() => {
    setUserStub = cy.stub();
    setIsOnlineStub = cy.stub();

    const userContextValue = {
      setUser: setUserStub,
      setIsOnline: setIsOnlineStub,
    };

    cy.mount(
      <MemoryRouter>
        <UserContext.Provider value={userContextValue}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it("Should display the login form", () => {
    cy.get('[data-cy="form"]').should("exist");
  });

  it("Should show validation errors when the form is submitted with empty fields", () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="email-error"]').should("exist");
    cy.get('[data-cy="password-error"]').should("exist");
  });

  it("Should allow a user to type into the input fields", () => {
    cy.get('[data-cy="email-input"]')
      .type("isaac@email.com")
      .should("have.value", "isaac@email.com");
    cy.get('[data-cy="password-input"]')
      .type("Isaac123")
      .should("have.value", "Isaac123");
  });

  /*it("Should handle successful form submission", () => {
    cy.intercept("POST", "login", {
      statusCode: 200,
      body: { success: true, token: "fakeToken", user: { name: "Isaac" } },
    }).as("login");

    cy.get('[data-cy="email-input"]').type("isaac@email.com");
    cy.get('[data-cy="password-input"]').type("Isaac123");
    cy.get('[data-cy="submit-button"]').click();

    cy.wait("@login").its("response.statusCode").should("eq", 200);
    cy.get("@login").its("response.body").should("have.property", "success", true);
  });

  it("Should handle server validation errors", () => {
    cy.intercept("POST", "login", {
      statusCode: 400,
      body: { message: "User not found" },
    }).as("login");

    cy.get('[data-cy="email-input"]').type("john.doe@example.com");
    cy.get('[data-cy="password-input"]').type("password123");
    cy.get('[data-cy="submit-button"]').click();

    cy.wait("@login").its("response.statusCode").should("eq", 400);
    cy.get('[data-cy="server-error-0"]').should("contain.text", "You currently do not have an account");
  });*/
});

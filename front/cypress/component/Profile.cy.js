import React from "react";
import { MemoryRouter } from "react-router-dom";
import AddProfile from "../../src/components/addProfile";
import UserContext from "../../src/pages/UserContext";
import 'cypress-file-upload';

describe("Test User Profile", () => {
  let setUserStub;
  let setIsOnlineStub;

  beforeEach(() => {
    setUserStub = cy.stub();
    setIsOnlineStub = cy.stub();

    const userContextValue = {
      user: {
        name: "TestUser",
        email: "testuser@example.com"
      },
      setUser: setUserStub,
      setIsOnline: setIsOnlineStub,
    };

    cy.mount(
      <MemoryRouter>
        <UserContext.Provider value={userContextValue}>
          <AddProfile />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it("should display the profile page correctly", () => {
    cy.get('[data-cy="profile-page"]').should("exist");
  });

  it("should allow input of user details", () => {
    cy.get("input[name='firstname']").type("John").should("have.value", "John");
    cy.get("input[name='lastname']").type("Doe").should("have.value", "Doe");
    cy.get("input[name='gender'][value='male']").check().should("be.checked");
    cy.get("select[name='ethnicity']").select("Kikuyu").should("have.value", "Kikuyu");
    cy.get("textarea[name='bio']").type("This is a test bio.").should("have.value", "This is a test bio.");
  });

  it("should handle image upload", () => {
    cy.fixture("profile.jpg").as("profileImage");
    
    cy.get("input[type='file']").then(($input) => {
      cy.get('@profileImage').then((fileContent) => {
        const file = new File([fileContent], "profile.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        $input[0].files = dataTransfer.files;
        cy.wrap($input).trigger("change", { force: true });
      });
    });

    cy.get('img.profile-img').should('have.attr', 'src').and('include', 'data:image/jpeg');
  });

  it("should submit the form successfully", () => {
    cy.intercept("POST", "**/create-profile", {
      statusCode: 200,
      body: { success: true },
    }).as("createProfile");    

    cy.get("input[name='firstname']").type("John");
    cy.get("input[name='lastname']").type("Doe");
    cy.get("input[name='gender'][value='male']").check();
    cy.get("select[name='ethnicity']").select("Kikuyu");
    cy.get("textarea[name='bio']").type("This is a test bio.");
    cy.get("button.edit-profile-link").click();

    cy.wait("@createProfile").its("response.statusCode").should("eq", 200);
    cy.get("@createProfile").should((xhr) => {
      expect(xhr.request.body).to.have.property("firstname", "John");
      expect(xhr.request.body).to.have.property("lastname", "Doe");
    });
  });

  it("should handle form submission error", () => {
    cy.intercept("POST", "**/create-profile", {
      statusCode: 500,
      body: { message: "Error while saving!" },
    }).as("createProfileError");

    cy.get("input[name='firstname']").type("John");
    cy.get("input[name='lastname']").type("Doe");
    cy.get("input[name='gender'][value='male']").check();
    cy.get("select[name='ethnicity']").select("Kikuyu");
    cy.get("textarea[name='bio']").type("This is a test bio.");
    cy.get("button.edit-profile-link").click();

    cy.wait("@createProfileError").its("response.statusCode").should("eq", 500);
    //cy.get(".Toastify__toast--error", { timeout: 10000 }).should("contain", "Error while saving!");
  });
});

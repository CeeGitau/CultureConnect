import React from "react";
import { MemoryRouter } from "react-router-dom";
import AddConversation from "../../src/components/addConversation";
import UserContext from "../../src/pages/UserContext";

describe("Test 'Add Conversation' Component", () => {
  let setUserStub;
  let setIsOnlineStub;

  const mockUser = { name: "Test User" };
  const testText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  beforeEach(() => {
    setUserStub = cy.stub();
    setIsOnlineStub = cy.stub();

    const userContextValue = {
      user: mockUser,
      setUser: setUserStub,
      setIsOnline: setIsOnlineStub,
    };

    cy.mount(
      <MemoryRouter>
        <UserContext.Provider value={userContextValue}>
          <AddConversation />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it("Should display the 'Add Conversation' form", () => {
    cy.get('[data-cy="form"]').should("exist");
  });

  it("Should handle conversation submission successfully", () => {
    cy.intercept("POST", "addConversation", {
      statusCode: 200,
      body: { success: true, token: "fakeToken", user: { name: `${mockUser}` } },
    }).as("addConversation");

    cy.get('[data-cy="category"]').select("Food & Cuisine");
    cy.get('[data-cy="category"]').should("have.value", "Food & Cuisine");
    cy.get('[data-cy="title"]').type("Test Title");
    cy.get('[data-cy="thoughts"]').type(`${testText}`);
    cy.get('[data-cy="submit-button"]').click();

    cy.wait("@addConversation").its("response.statusCode").should("eq", 200);
    cy.get("@addConversation")
      .its("response.body")
      .should("have.property", "success", true);
  });

  it("Should handle file uploads", () => {
    cy.fixture("test-image.jfif").as("imageFile");
    cy.fixture("test-audio.mp3").as("audioFile");

    // Upload image file
    cy.get('[id="imageUpload"]').selectFile("@imageFile");

    // Verify file has been attached (assuming there's a UI indication)
    cy.get('[id="imageUpload"]')
      .should("have.prop", "files")
      .then((files) => {
        expect(files).to.have.length(1);
        expect(files[0].name).to.equal("test-image.jfif");
      });

    // Upload audio file
    cy.get('[id="audioUpload"]').selectFile("@audioFile");

    // Verify file has been attached (assuming there's a UI indication)
    cy.get('[id="audioUpload"]')
      .should("have.prop", "files")
      .then((files) => {
        expect(files).to.have.length(1);
        expect(files[0].name).to.equal("test-audio.mp3");
      });

    // Check if the form contains the upload labels
    cy.get('[data-cy="form"]').should("contain.text", "Upload Image:");
    cy.get('[data-cy="form"]').should("contain.text", "Upload Audio:");
  });

  it("Should display the author's name", () => {
    cy.get('[data-cy="form"]').should(
      "contain.text",
      `Author: ${mockUser.name}`
    );
  });
});

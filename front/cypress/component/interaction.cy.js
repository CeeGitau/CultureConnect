import React from "react";
import { MemoryRouter } from "react-router-dom";
import Comments from "../../src/components/comments";
import UserContext from "../../src/pages/UserContext";

describe("Test 'Comments' Component", () => {
  let setUserStub;
  let setIsOnlineStub;

  const mockUser = { name: "Test User" };
  const mockConversationId = "12345";
  const mockComments = [
    {
      _id: "comment1",
      content: "This is a test comment",
      author: mockUser.name,
      createdAt: new Date().toISOString(),
    },
  ];

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
          <Comments
            conversationId={mockConversationId}
            onCommentsCountUpdate={cy.stub()}
          />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it("Should display the 'comments' form", () => {
    cy.get('[data-cy="comment-container"]').should("exist");
  });

  it("Should handle comment posting successfully", () => {
    cy.intercept("POST", "**/comments", {
      statusCode: 200,
      body: {
        success: true,
        comment: { content: "Test comment", author: mockUser.name },
      },
    }).as("postComment");

    cy.get('[data-cy="comment-input"]').type("Test comment");
    cy.get('[data-cy="submit-button"]').click();

    cy.wait("@postComment").its("response.statusCode").should("eq", 200);
  });

  /*it("Should handle delete comments successfully", () => {
    cy.intercept("DELETE", `/comments/${mockComments._id}`, {
      statusCode: 200,
      body: {
        success: true,
        token: "fakeToken",
      },
    }).as("deleteComment");

    cy.get('[data-cy="delete-button"]').click();
    cy.wait("@deleteComment").its("response.statusCode").should("eq", 200);
  });*/
});

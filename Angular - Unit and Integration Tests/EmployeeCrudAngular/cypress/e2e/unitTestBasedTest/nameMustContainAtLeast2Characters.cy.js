describe("editEmployeeTest", () => {
  it("Muestra el mensaje de error 'El nombre debe tener al menos 2 caracteres.' correctamente", () => {
    const baseUrl = Cypress.env("baseUrl");
    if (!baseUrl) {
      throw new Error(
        "Error: baseUrl is not defined. Please check your environment variables."
      );
    }
    cy.log("Visiting URL:", baseUrl);
    cy.visit(baseUrl);
    cy.get(".btn").click();
    cy.wait(500);
    cy.get(".form-control").type("a");
    cy.get(".btn").click();
    cy.wait(500);
    cy.get(".ng-trigger").should(
      "include.text",
      "El nombre debe tener al menos 2 caracteres."
    );
  });
});

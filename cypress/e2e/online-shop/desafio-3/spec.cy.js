const directorioName = __dirname.replaceAll("\\", "/");

const module = directorioName.split(/[/]/)[2];
const scenarioName = directorioName
  .slice(directorioName.lastIndexOf("/") + 1)
  .split("-")
  .slice(0, -1)
  .join("-");
const testCaseId = directorioName.split(/[-]/).pop();

import { ProductsPage, productsPage } from "../../../support/page/productsPage";

describe(`${scenarioName} - ${module}`, () => {
  const productsPage = new ProductsPage();

  before(() => {
    cy.login(Cypress.env().usuario, Cypress.env().password);
    cy.visit("");
  });

  it("Deberia permitir al usuario editar un producto", () => {
    cy.fixture(`${module}/${scenarioName}-${testCaseId}/data`).then((data) => {
      cy.eliminarProducto(data.product.id);
      cy.eliminarProducto(data.product2.id);
      cy.crearProducto(data.product);
      cy.crearProducto(data.product2);

      productsPage.clickOnlineShopButton();

      productsPage.valSearchType();
      productsPage
        .valSearchEnter(`${data.product.id} {enter}`)
        .wait(2000)
        .clear();
      //Se agrega el primer producto
      productsPage
        .clickAddButton(data.product.name)
        .find(`[name="${data.product.name}"]`)
        .click();
      productsPage.clickCloseModal();
      productsPage
        .clickAddButton(data.product.name)
        .find(`[name="${data.product.name}"]`)
        .click();
      productsPage.clickCloseModal();

      //Se agrega el segundo producto
      productsPage.valSearchType();

      productsPage
        .valSearchEnter(`${data.product2.id} {enter}`)
        .wait(2000)
        .clear();

      productsPage
        .clickAddButton(data.product2.name)
        .find(`[name="${data.product2.name}"]`)
        .click();
      productsPage.clickCloseModal();

      productsPage
        .clickAddButton(data.product2.name)
        .find(`[name="${data.product2.name}"]`)
        .click();
      productsPage.clickCloseModal();

      productsPage.clickGoToCart();

      productsPage.clickGoToCheckOut();

      cy.intercept("POST", "api/purchase").as("purchaseCheck");

      productsPage.completarFirstName(data.datosTarjeta.firstName);
      productsPage.completarLastName(data.datosTarjeta.lastName);
      productsPage.completarCardNumber(data.datosTarjeta.cardNumber);
      productsPage.clickButtonPurchase();
      productsPage.clickButtonThankYou();

      cy.wait("@purchaseCheck").then((purchase) => {
        //La intercepcion que se realizo previamente hacemos una asercion con los datos en la BD

        const queryPurchase = `SELECT * FROM 
                                    "purchaseProducts" p INNER JOIN 
                                        (SELECT * FROM SELLS  s WHERE s."firstName" = 'Jonhny' 
                                             AND s."lastName" = 'Martinez' 
                                                 ORDER BY s.ID DESC LIMIT 1) 
                                                   AS tarjetaNombre ON p.SELL_ID = tarjetaNombre.ID;`;

        cy.task("connectDB", queryPurchase).then((result) => {
          //valido el request de la compra interceptado con los datos de la bd
          expect(result[0].cardNumber).to.equal(
            purchase.request.body.cardNumber
          );
          expect(result[0].firstName).to.equal(purchase.request.body.firstName);
          expect(result[0].lastName).to.equal(purchase.request.body.lastName);

          productsPage.valSearchEnter(`{enter}`).wait(2000).clear();
        });
      });
    });
  });
});

const directorioName = __dirname.replaceAll("\\", "/");

const module = directorioName.split(/[/]/)[2];
const scenarioName = directorioName
  .slice(directorioName.lastIndexOf("/") + 1)
  .split("-")
  .slice(0, -1)
  .join("-");
const testCaseId = directorioName.split(/[-]/).pop();

import { ProductsPage, productsPage } from "../../../support/page/productsPage";
import { ShoppingCartPage } from "../../../support/page/shoppingCartPage";

describe(`${scenarioName} - ${module}`, () => {
  const productsPage = new ProductsPage();
  const shoppingCartPage = new ShoppingCartPage();

  /*before(() => {
    cy.login(Cypress.env().usuario, Cypress.env().password);
    cy.visit("");
  });*/
  before(() => {
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach("Login", () => {
    cy.login(Cypress.env().usuario, Cypress.env().password);
    cy.visit("");
  });

  it("Desafio Nro. 4", () => {
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

      //5.Verificar los productos que hay en el carrito de compra (qty/name/price/totalPrice)

      //Verificamos el nombre del producto
      shoppingCartPage.obtenerCantProducto(
        data.product.name,
        data.product.quantity
      );
      shoppingCartPage.obtenerCantProducto(
        data.product2.name,
        data.product2.quantity
      );

      shoppingCartPage.obtenerNombreProduct(
        data.product.price,
        data.product.name
      );

      shoppingCartPage.obtenerNombreProduct(
        data.product2.price,
        data.product2.name
      );

      //Verificamos el precio unitario del producto

      shoppingCartPage.obtenerShowPrice(data.product.name, data.product.price);

      shoppingCartPage.obtenerShowPrice(
        data.product2.name,
        data.product2.price
      );

      shoppingCartPage.obtenerPriceTotal(
        data.product.name,
        data.product.price * data.product.quantity
      );
      shoppingCartPage.obtenerPriceTotal(
        data.product2.name,
        data.product2.price * data.product.quantity
      );

      ///////////------fin del punto Nro.5------/////////////////////

      ////----6.Mostrar el total Price y verificarlo----///////////

      //Verificamos la suma total del producto

      shoppingCartPage.visualizarTotal();
      data.precioTotal = parseFloat(
        `${
          data.product.price * data.product.quantity +
          data.product2.price * data.product.quantity
        }`
      );

      shoppingCartPage.getTotalPrice(data.precioTotal.toFixed(2));

      ///////////-------------fin del punto Nro.6--------------/////////

      ///------------7.Verificar el billing summary (utilizar custom command) --------//////

      cy.getByDataCy("goBillingSummary").click();

      cy.verifyBillingSummary(
        `${data.precioTotal.toFixed(0)}`,
        `${data.precioTotal.toFixed(0)}`
      );

      cy.getByDataCy("goCheckout").click();

      ///////////-------------fin del punto Nro.7--------------/////////

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

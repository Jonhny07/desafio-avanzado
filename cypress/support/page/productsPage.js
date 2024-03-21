const constantes = require("../page/constants");
export class ProductsPage {
  constructor() {
    this.onlineShopButton = '[data-cy="onlineshoplink"]';
    this.searchType = '[data-cy="search-type"]';
    this.searchEnter = '[data-cy="search-bar"]';
    this.closeModal = "#closeModal";
    this.addButton = "add-to-cart-";
    this.goToCartButton = "#goShoppingCart";
    this.goToCheckOut = '[data-cy="goCheckout"]';
    this.firstName ='[data-cy="firstName"]';
    this.lastName ='[data-cy="lastName"]';
    this.cardNumber ='[data-cy="cardNumber"]';
    this.purchase = '[data-cy="purchase"]';
    this.buttonThankYou ='[data-cy="thankYou"]';
  }

  clickOnlineShopButton() {
    cy.get(this.onlineShopButton, { timeout: constantes.TIMEOUT }).click();
  }

  valSearchType() {
    cy.get(this.searchType).select("ID");
  }
  valSearchEnter(valor) {
    return cy.get(this.searchEnter).type(valor);
  }

  clickButtonEdit(valor) {
    return cy.get(`[data-cy="edit-${valor}"]`).click();
  }

  clickAddButton(product) {
    return cy.contains("p", product).siblings("div");
  }
  clickCloseModal() {
    cy.get(this.closeModal).should("be.visible").click();
  }
  clickGoToCart() {
    cy.get(this.goToCartButton, { timeout: constantes.TIMEOUT }).click();
  }
  clickGoToCheckOut() {
    cy.get(this.goToCheckOut, { timeout: constantes.TIMEOUT }).click();
  }
  completarFirstName(valor){
    return cy.get(this.firstName).type(valor)
  }
  completarLastName(valor){
    return cy.get(this.lastName).type(valor)
  }
  completarCardNumber(valor){
    return cy.get(this.cardNumber).type(valor)
  }
  clickButtonPurchase(){
    cy.get(this.purchase).click()
  }
  clickButtonThankYou(){
    cy.get(this.buttonThankYou, { timeout: constantes.TIMEOUT }).click()
  }
}

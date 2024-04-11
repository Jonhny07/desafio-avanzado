import { ProductsPage } from "./productsPage";
export class ShoppingCartPage {
  constructor() {
    this.productQuantity = "#productAmount";
    this.productName = "#productName";
    this.price = "#unitPrice";
    this.buttonShow = "div.css-n1d5pa";
    this.precioTotalProduct = "#price > b";
  }
  obtenerCantProducto(nombre, cantidad) {
    return cy
      .contains(this.productName, nombre)
      .prev(this.productQuantity)
      .invoke("text")
      .then((text) => {
        expect(text).to.be.equal(`${cantidad}`);
      });
  }
  obtenerNombreProduct(cantidad, nombre) {
    return cy
      .contains(this.price, cantidad)
      .siblings(this.productName)
      .invoke("text")
      .then((text) => {
        expect(text).to.be.equal(`${nombre}`);
      });
  }
  obtenerShowPrice(nombre, precio) {
    return cy
      .contains(this.productName, nombre)
      .siblings(this.price)
      .invoke("text")
      .then((text) => {
        expect(text).to.be.equal(`$${precio}`);
      });
  }

  visualizarTotal() {
    cy.get(this.buttonShow)
      .children("button")
      .contains("Show total price")
      .click();
  }

  getTotalPrice(sumaTotal) {
    return cy
      .get(this.precioTotalProduct)
      .invoke("text")
      .then((text) => {
        expect(text).to.be.equal(`${sumaTotal}`);
      });
  }
  obtenerPriceTotal(nombre, totalUnitario) {
    return cy
      .contains("p", nombre)
      .siblings("#totalPrice")
      .invoke("text")
      .then((text) => {
        expect(text).to.be.equal(`$${totalUnitario}`);
      });
  }
}


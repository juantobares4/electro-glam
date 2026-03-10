import { getDataFromLocalStorage, purchaseSummary, totalPriceCart } from "./utils.js";

const viewPurchaseSummary = () => {
  const cartSummary = purchaseSummary();
  const summaryList = document.getElementById('summaryList');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');

  cartSummary.forEach(product => {
    summaryList.innerHTML += `
      <span class="font-title fw-bold text-wrap">${product.title} x ${product.quantity}</span>
      <span>Precio por unidad: €${product.price}</span>
      ${product.quantity > 1 ? `<span>Precio total: €${product.totalPrice}</span>` : ''}
    `;
  
  });

  summaryTotalPrice.innerHTML += `
    <p class="font-title">Cantidad de productos: ${getDataFromLocalStorage().length}</p>
    <p class="font-title fw-bold">Precio final: €${totalPriceCart()}</p>

  `;

};

const main = () => {
  viewPurchaseSummary();

};

main();
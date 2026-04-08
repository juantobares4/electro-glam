import { getDataFromLocalStorage, purchaseSummary, totalPriceCart } from "./utils.js";
import { postalCodes } from "./postalCodes.js";

const formPostalCode = document.getElementById('formPostalCode');
const selectedPostalCode = document.getElementById('selectedPostalCode');
const btn = document.getElementById('finishPurchase');

const viewPurchaseSummary = () => {
  const cartSummary = purchaseSummary();
  const summaryList = document.getElementById('summaryList');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');

  if (cartSummary.length) {
    cartSummary.forEach(product => {
        summaryList.innerHTML += `
          <span class="font-title fw-bold text-wrap">${product.title} x ${product.quantity}</span>
          <span>Precio por unidad: €${product.price}</span>
          ${product.quantity > 1 ? `<span>Precio total: €${product.totalPrice}</span>` : ''}
        `;
  
    });

  } else {
    summaryList.innerHTML += `
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-start">
        <h6 class="text-start"><span class="d-block py-1 fw-bold">No hay productos</span> en el carrito.</h4>
      </div>

    `;

  };

  const shipping = handleCalculateShipping() || 0;

  summaryTotalPrice.innerHTML += `
    <p class="font-title">Cantidad de productos: ${getDataFromLocalStorage().length}</p>
    <p class="font-title fw-bold">Subtotal: €${totalPriceCart()}</p>
    <p class="font-title fw-bold">Envío: €<span id="priceShipping">${shipping > 0 ? shipping : 0}</span></p>
    <hr>
    <p class="font-title fw-bold">Total a pagar: €<span id="total">${totalPriceCart()}</span></p>

  `;

};

const renderPostalCodes = () => {
  postalCodes.forEach((item, index) => {
    const option = document.createElement("option");

    option.value = item.code;
    option.id = `provinceId-${index}`;
    option.dataset.id = item.code;

    option.textContent = `${item.province} - ${item.code}`;

    selectedPostalCode.appendChild(option);
  
  });

  selectedPostalCode.addEventListener("change", (e) => {
    const code = e.target.value;

    const selected = postalCodes.find(item => item.code === code);

    if (selected) {
      handleCalculateShipping(Number(selected.price));
    
    };

  });

};

const handleCalculateShipping = (priceShipping) => {
  const shippingCostsElement = document.getElementById('priceShipping');
  const totalPriceElement = document.getElementById('total');

  if (shippingCostsElement && totalPriceElement){
    shippingCostsElement.innerText = priceShipping;
    totalPriceElement.innerText = Number(priceShipping) + Number(totalPriceCart());

  };

};

btn.addEventListener('click', () => {
  console.log('CLICK FUNCIONA');

});

const main = () => {
  formPostalCode?.addEventListener('submit', handleCalculateShipping);
  
  viewPurchaseSummary();
  renderPostalCodes();

};

main();
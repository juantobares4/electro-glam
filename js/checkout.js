import { getDataFromLocalStorage, purchaseSummary, showToast, totalPriceCart } from "./utils.js";
import { postalCodes } from "./postalCodes.js";

const formPostalCode = document.getElementById('formPostalCode');
const selectedPostalCode = document.getElementById('selectedPostalCode');
const finishPurchaseBtn = document.getElementById('finishPurchase');
const mainContainer = document.getElementById('purchaseSummary');

let productsInCart = getDataFromLocalStorage();

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener('hide.bs.modal', function(event) {
    if (document.activeElement) {
        document.activeElement.blur();
    };

  });

});

const viewPurchaseSummary = () => {
  const cartSummary = purchaseSummary();
  const productsContainer = document.getElementById('productsContainer');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');

  if (cartSummary.length) {
    cartSummary.forEach(product => {
        productsContainer.innerHTML += `
          <span class="font-title fw-bold text-wrap">${product.title} x ${product.quantity}</span>
          <span>Precio por unidad: €${product.price}</span>
          ${product.quantity > 1 ? `<span>Precio total: €${product.totalPrice}</span>` : ''}
        `;
  
    });

  } else {
    productsContainer.innerHTML += `
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

const showPurchaseSuccessModal = () => {
  const modal = document.createElement("div");

  modal.className = "modal fade";
  modal.tabIndex = -1;

  modal.innerHTML = `
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-body d-flex justify-content-center align-items-center text-center flex-column">
          <h2 class="mb-3 text-success font-title">Compra realizada</h2>
          <p class="mb-4">Tu compra se realizó correctamente.</p>
          <button class="btn btn-outline-dark rounded-0" data-bs-dismiss="modal">
            Aceptar
          </button>
        </div>
      </div>
    </div>

  `;

  document.body.appendChild(modal);

  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  modal.addEventListener("hidden.bs.modal", () => {
    localStorage.clear();
    productsInCart = [];

    document.getElementById('productsContainer').innerHTML = "";
    document.getElementById('summaryTotalPrice').innerHTML = "";
    selectedPostalCode.value = '';

    viewPurchaseSummary();

    modal.remove();
  
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

const handleFinishPurchase = () => {
  if (!selectedPostalCode.value || !productsInCart.length) {
    if (!selectedPostalCode.value) {
      showToast('error', 'Seleccioná un código postal', 'Debes seleccionar el código postal correspondiente a tu provincia.', mainContainer);

      return;

    };

    if (!productsInCart.length) {
      showToast('error', 'No hay productos en el carrito', 'Debes agregar productos al carrito para finalizar la compra.', mainContainer);

      return;

    };
  
  };

  showPurchaseSuccessModal();

};

const main = () => {
  formPostalCode?.addEventListener('submit', handleCalculateShipping);
  finishPurchaseBtn.addEventListener('click', handleFinishPurchase)

  viewPurchaseSummary();
  renderPostalCodes();

};

main();
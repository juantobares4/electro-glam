import { fetchData } from "./fetch.js";
import { categoriesList, filterProducts, getDataFromLocalStorage, saveDataInLocalStorage, renderRatingStars, showToast, totalPriceCart } from "./utils.js";

const navCart = document.getElementById('navCart');
const mainContainer = document.getElementById('productsList');
const categoriesContainer = document.getElementById('categoriesContainer');
const formSearchProducts = document.getElementById('searchProducts');
const header = document.getElementById('headerProductsList');

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener('hide.bs.modal', function(event) {
    if (document.activeElement) {
        document.activeElement.blur();
    };

  });

});

const renderCategoriesOnMenu = async(container) => {
  try {
    const allCategories = await categoriesList();
    
    allCategories.forEach((category, index) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
 
      const categoryElement = `
        <a id="categoryAnchor-${index}" class="dropdown-item" href="#" data-id="${category}">${category}</a>
      `;

      a.innerHTML = categoryElement;

      li.appendChild(a);
      container.appendChild(li);

      const categoryAnchor = document.getElementById(`categoryAnchor-${index}`);

      if (categoryAnchor) {
        categoryAnchor.addEventListener('click', () => {
          handleCategoriesDropdown({  
            categoryName: categoryAnchor.dataset.id

          });

        });

      };

    });

  } catch(error) {
    console.error(error);

  };

};

const viewProducts = (products, { type = null, value = null } = {}) => {
  try {
    const filteredProducts = filterProducts(products, { type: type, value: value });

    setTimeout(() => { 
      let cards = [];
    
      mainContainer.textContent = '';
      
      if (filteredProducts.length) {
        filteredProducts.forEach(product => {
          let colDiv = document.createElement('div');
          colDiv.className = 'col-12 col-md-6 col-lg-6 mb-4 d-flex';
    
          let cardDiv = document.createElement('div');
          cardDiv.className = 'card rounded-0 border-1 border-black w-100 d-flex flex-column';
    
          let imageContainer = document.createElement('div');
          imageContainer.className = 'd-flex justify-content-center align-items-center';
          imageContainer.style.height = '200px';
          imageContainer.style.padding = '10px';
    
          let imageProduct = document.createElement('img');
          imageProduct.src = product.image;
          imageProduct.className = 'img-fluid';
          imageProduct.style.maxHeight = '100%';
          imageProduct.style.maxWidth = '100%';
          imageProduct.style.objectFit = 'contain';
          imageProduct.alt = product.title;
    
          imageContainer.appendChild(imageProduct);
    
          let cardBody = document.createElement('div');
          cardBody.className = 'card-body text-center d-flex flex-column';
    
          let cardTitle = document.createElement('h5');
          cardTitle.style.fontSize = '17px';
          cardTitle.style.lineHeight = '1.4';
          cardTitle.style.wordBreak = 'break-word';
          cardTitle.innerHTML = `<b>${product.title}</b>`;
    
          let productCategory = document.createElement('small');
          productCategory.style.lineHeight = '1.4';
          productCategory.style.wordBreak = 'break-word';
          productCategory.style.marginBlock = '10px';
          productCategory.innerHTML = `<b>${product.category}</b>`;
    
          let cardText = document.createElement('p');
          cardText.innerHTML = `<b>€${product.price}</b>`;
          cardText.style.fontSize = '17px';
          cardText.className = 'card-text';
    
          let buttonsContainer = document.createElement('div');
          buttonsContainer.className = 'mt-auto';
    
          let buttonBuyProduct = document.createElement('button');
          buttonBuyProduct.className = 'btn button-products w-100 mb-2';
          buttonBuyProduct.innerText = 'Añadir a la cesta';
          buttonBuyProduct.addEventListener('click', () => {
            addProductToCart(product.id);
          
          });
    
          let buttonViewDetail = document.createElement('button');
          buttonViewDetail.className = 'btn button-products w-100';
          buttonViewDetail.innerText = 'Más detalles';
          buttonViewDetail.addEventListener('click', () => {
            document.activeElement.blur();
            productDetail(product.id);
          
          });
    
          buttonsContainer.appendChild(buttonBuyProduct);
          buttonsContainer.appendChild(buttonViewDetail);
    
          cardBody.appendChild(cardTitle);
          cardBody.appendChild(productCategory);
          cardBody.appendChild(cardText);
          cardBody.appendChild(buttonsContainer);
    
          cardDiv.appendChild(imageContainer);
          cardDiv.appendChild(cardBody);
          colDiv.appendChild(cardDiv);
          mainContainer.appendChild(colDiv);
    
          cards.push(cardDiv);
        
        });
      
        if (window.innerWidth >= 992) {
          let maxHeight = 0;
    
          cards.forEach(card => {
            card.style.height = 'auto';
            let h = card.offsetHeight;
            if (h > maxHeight) maxHeight = h;
          });
    
          cards.forEach(card => {
            card.style.height = maxHeight + 'px';
          });
        
        } else {
          cards.forEach(card => {
            card.style.minHeight = 'auto';
          
          });
        
        };
      
      } else {
        const emptyMessageElement = document.createElement('p');
        
        emptyMessageElement.id = 'emptyProductsList';
        emptyMessageElement.innerHTML = '<span>No hay productos</span> con ese nombre';

        mainContainer.appendChild(emptyMessageElement);

      };
  
    }, 1000);
    
  } catch(error) {
    console.error(error);  
  
  };
  
};

const productDetail = async(idProduct) => {
  try {
    let dataProducts = await fetchData();
    let findProduct = dataProducts.find(product => product.id === idProduct);
    let modalProduct = document.createElement('div');
    let arrayProduct = [findProduct];

    if(modalProduct){
      modalProduct.remove();
    
    }

    modalProduct.className = 'modal fade';
    modalProduct.id = `modal-product-${idProduct}`; // Se le pasa un ID al modal, basado en el ID del producto que se clickeó, para que dicho modal muestre el producto clickeado y se mantenga actualizado.
    modalProduct.tabIndex = -1; // Nos permite que el modal reciba enfoque mediante JavaScript.

    let modalBodyContent = '<div class="modal-body">';
    
    arrayProduct.forEach(attr => {
      modalBodyContent += `
        <h5><b>${attr.title}</b></h5>
        <div class="mt-3 font-text">
          <div class="mb-3">
            <b>Precio:</b> <span>€${attr.price}</span>
          </div>
          <div class="mb-3">
            <b>Valoración:</b> <span>${attr.rating.rate} ${renderRatingStars(attr.rating.rate)} (${attr.rating.count})</span>
          </div>
          <div class="mb-3">
            <b>Descripción:</b> <span>${attr.description}</span>
          </div>
        </div>

      `

    });

    modalBodyContent += '</div>';

    modalProduct.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle del Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          ${modalBodyContent}
          <div class="modal-footer">
            <button type="button" class="btn border-1 border-black rounded-0 button-products" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    
    `;

    document.body.appendChild(modalProduct);

    $(`#modal-product-${idProduct}`).modal('show'); // Se llama al modal con ID asigando anteriormente.

  } catch(error) {
    console.error(error);

  }

};

const addProductToCart = async(productId) => {
  try {
    let productsInLocalStorage = getDataFromLocalStorage();
    
    let productsAPI = await fetchData();
    let addedProduct = productsAPI.find(product => product.id === productId);
    
    productsInLocalStorage.push(addedProduct);
    saveDataInLocalStorage(productsInLocalStorage);
    
    setTimeout(() => {
      showToast('success', '¡Producto agregado correctamente!', 'Agregaste correctamente el producto a la cesta.', mainContainer);
      
    }, 500);

    await counterProductsInCart();
    renderTotalPrice();

  } catch(error) {
    console.error(error.message);

  };

};

const counterProductsInCart = () => {
  let productsInLocalStorage = getDataFromLocalStorage();
  let cartSection = document.getElementById('navCart');
  let countProducts = productsInLocalStorage.length;
  let counterElement = document.getElementById('cart-counter');
  
  if(!counterElement){
    counterElement = document.createElement('p');
    counterElement.style.listStyle = 'none';
    counterElement.style.fontSize = '0.8rem'
    counterElement.className = 'counter-products me-0 mt-3';
    counterElement.id = 'cart-counter';
    cartSection.appendChild(counterElement);

  };

  counterElement.innerText = `${countProducts}`;

};

const renderTotalPrice = () => {
  const totalElement = document.getElementById('totalCart');
  
  if (!totalElement) return;

  totalElement.textContent = `€${totalPriceCart()}`;

};

const myCart = (event) => {
  event?.preventDefault();

  let productsInLocalStorage = getDataFromLocalStorage();

  try {
    if (productsInLocalStorage) {
      const deleteDuplicate = (array) => {
        let uniqueProducts = {};
        
        array.forEach(element => {
          uniqueProducts[element.title] = element;
        
        });
        
        return Object.values(uniqueProducts);
      
      };

      const countDuplicate = (array) => {
        let countMap = {};

        array.forEach(element => {
          countMap[element.title] = (countMap[element.title] || 0) + 1;
        
        });
        
        return countMap;
      
      };

      let modalBodyContent = '';
      let noneDuplicate = deleteDuplicate(productsInLocalStorage);
      let count = countDuplicate(productsInLocalStorage);

      if (productsInLocalStorage.length > 0) {
        noneDuplicate.forEach(attr => {
          let productCount = count[attr.title];
          let totalPrice = attr.price * productCount;

          modalBodyContent += `
            <div class="d-flex justify-content-start mb-4 border-bottom pb-4">
              <div class="d-flex align-items-center">
                <div class="border border-1 border-dark p-3">
                  <img class="img-cart" src="${attr.image}">
                </div>
                <div class="text-start p-2">
                  <h5 class="mb-1">
                    ${attr.title}
                  </h5>
                  <p class="mb-0 text-black bg-secondary-subtle py-1">
                      Precio: €${attr.price} | Cantidad: ${productCount} | Total: €${totalPrice.toFixed(2)}
                    <a title="Eliminar producto de la cesta" href="#" class="ms-3 remove-product text-black" data-id="${attr.id}">
                      <i class="bi bi-trash"></i>
                    </a>
                    </p>
                </div>
              </div>
            </div>
          
          `;
        
        });

      } else {
        modalBodyContent = `
          <div class="d-flex flex-column flex-md-row align-items-center justify-content-center">
            <img class="empty-cart" src="images/assets/empty-cart.png">
            <h4 class="text-center">¡Oh, mi cesta está vacía!</h4>
          </div>
        `;
      
      };

      let modalCart = document.getElementById('modal-cart');

      if (!modalCart) {
        modalCart = document.createElement('div');
        modalCart.className = 'modal fade';
        modalCart.id = 'modal-cart';
        modalCart.tabIndex = -1;

        modalCart.innerHTML = `
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content rounded-0">
              <div class="modal-header text-center">
                <h5 class="modal-title titles">Mi cesta de compras</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body"></div>
              <div class="modal-footer">
                <h6 class="me-2" id="totalCart"></h6>
                <button disabled id="confirmPurchaseBtn" type="button" class="btn border-1 border-black rounded-0 button-products" data-bs-dismiss="modal">
                  Comprar
                </button>
                <button type="button" class="btn border-1 border-black rounded-0 button-products" data-bs-dismiss="modal">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
    
        `;

        document.body.appendChild(modalCart);
      
      };

      modalCart.querySelector('.modal-body').innerHTML = modalBodyContent;

      const finishPurchaseBtn = modalCart.querySelector('#confirmPurchaseBtn');
      finishPurchaseBtn.disabled = productsInLocalStorage.length === 0;

      const linkRemove = modalCart.querySelectorAll('.remove-product');

      linkRemove.forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();

          const productId = Number(link.dataset.id);
          
          removeProductFromCart(productId);
        
        });
      
      });

      $(`#modal-cart`).modal('show');
    
    };

    renderTotalPrice();

  } catch(error) {
    console.error(error.message);
  
  };

};

const removeProductFromCart = async(productId) => {
  try {
    let productsInLocalStorage = getDataFromLocalStorage();
    let deleteProduct = productsInLocalStorage.findIndex(product => product.id === productId);

    productsInLocalStorage.splice(deleteProduct, 1);

    saveDataInLocalStorage(productsInLocalStorage);
  
    await myCart();
    await counterProductsInCart();
    await showToast('success', '¡Producto eliminado correctamente!', 'Eliminaste correctamente el producto de la cesta.', mainContainer);
    renderTotalPrice();
    
  } catch(error) {
    console.error(error.message);

  };

};

const handleFormSearchProducts = (event) => {
  event.preventDefault();

  const inputValue = document.getElementById('inputAttribute').value;

  handleFilterProducts({ type: 'search', value: inputValue });
  header.innerText = `Resultados para: ${inputValue}`;

};

const handleCategoriesDropdown = ({ categoryName = null } = {}) => {
  handleFilterProducts({ type: 'dropdown', value: categoryName }); 
  header.innerText = `Buscar por: ${categoryName}`;

};

const handleFilterProducts = async({ type = null, value = null } = {}) => {
  try {
    const products = await fetchData();

    viewProducts(products, { type: type, value: value });

  } catch(error) {
    console.error(error);
  
  };

};

const main = () => {
  navCart.addEventListener('click', myCart);
  formSearchProducts.addEventListener('submit', handleFormSearchProducts);

  handleFilterProducts();
  renderCategoriesOnMenu(categoriesContainer);
  counterProductsInCart();

};

main();
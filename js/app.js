import { fetchData } from "./fetch.js";
import { getDataFromLocalStorage, saveDataInLocalStorage, renderRatingStars, showToast } from "./utils.js";

const navCart = document.getElementById('navCart');
const mainContainer = document.getElementById('products-list');

const loadingMessage = (container) => {
  let containerLoadingMessage = document.createElement('div');
  let elementMessage = document.createElement('p');

  let loadingMessage = 'Cargando los productos...';
  containerLoadingMessage.className = 'd-flex align-items-center justify-content-center mt-5';
  
  elementMessage.innerText = loadingMessage;
  containerLoadingMessage.style.fontSize = '1rem';

  containerLoadingMessage.appendChild(elementMessage);
  
  container.appendChild(containerLoadingMessage);

  elementMessage.style.fontFamily = 'var(--font-main)';

};

const categoriesList = () => {
  let data = fetchData()

  return data
    .then(products => {
      let arrayCategories = products.map(product => product.category);
      let dataArray = new Set(arrayCategories); // Set es una estructura de datos que no puede almacenar valores duplicados.
      let result = [...dataArray];

      return result;

  })


};

const filterByCategory = (nameCategory) => {
  let allProducts = fetchData();
  let containerProducts = document.getElementById('products-list');
  containerProducts.innerHTML = '';

  return allProducts
    .then(products => {
      let byCategory = products.filter(product => product.category === nameCategory);
      let cards = [];
        
      byCategory.forEach(product => {
        let colDiv = document.createElement('div');
        colDiv.className = 'col-lg-6 mb-4';

        let cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.boxShadow = '15px 15px 15px 10px rgba(0, 0, 0, 0.3)';

        let imageProduct = document.createElement('img');
        imageProduct.src = product.image;
        imageProduct.className = 'card-img-top mx-auto d-block img-fluid';
        imageProduct.style.maxWidth = '12rem';
        imageProduct.style.marginTop = '20px';
        imageProduct.style.marginBottom = '20px';
        imageProduct.title = product.title;

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body text-center';

        let cardTitle = document.createElement('h5');
        cardTitle.style.fontSize = '17px';
        cardTitle.style.lineHeight = '30px';

        let productTitle = `<b>${product.title}</b>`
        cardTitle.innerHTML = productTitle;

        let cardText = document.createElement('p');
        let price = `<b>€${product.price}</b>`;
        cardText.innerHTML = price;
        cardText.style.fontSize = '17px';
        cardText.className = 'card-text';

        let cardButton = document.createElement('button');
        cardButton.className = 'btn button-products';
        cardButton.innerHTML = 'Añadir a la cesta';

        cardButton.addEventListener('click', () => {
          addProductToCart(product.id);

        });

        let buttonViewDetail = document.createElement('button');
        buttonViewDetail.className = 'btn button-products';
        
          buttonViewDetail.addEventListener('click', () => {
            productDetail(product.id);

          });

        buttonViewDetail.innerHTML = 'Más detalles';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);
        cardBody.appendChild(buttonViewDetail);
        cardDiv.appendChild(imageProduct);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);

        containerProducts.appendChild(colDiv);
          
        cards.push(cardDiv);

      }); 

      let maxHeight = 0;
      cards.forEach(card => {
            let cardHeight = card.offsetHeight;
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
      
      });

      cards.forEach(card => {
            card.style.height = maxHeight + 'px';
      
      });

      /* containerProducts.scrollIntoView({
        behavior: 'smooth'
      
      }); */

    });    

}

const viewProducts = () => {
  const allProducts = fetchData();
  let containerProducts = document.getElementById('products-list');
  containerProducts.innerHTML = '';

  return allProducts.then(products => {

    loadingMessage(containerProducts);
      
    setTimeout(() => {
      let cards = [];
      containerProducts.innerHTML = '';
        
      products.forEach(product => {

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
          productDetail(product.id);
        
        });

        buttonsContainer.appendChild(buttonBuyProduct);
        buttonsContainer.appendChild(buttonViewDetail);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(buttonsContainer);

        cardDiv.appendChild(imageContainer);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        containerProducts.appendChild(colDiv);

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

    }, 1000);
  
  });

};

const productDetail = async(idProduct) => {
  try{
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
  try{
    let productsInLocalStorage = getDataFromLocalStorage();
    
    let productsAPI = await fetchData();
    let addedProduct = productsAPI.find(product => product.id === productId);
    
    productsInLocalStorage.push(addedProduct);
    saveDataInLocalStorage(productsInLocalStorage);
    
    setTimeout(() => {
      showToast('success', '¡Producto agregado correctamente!', 'Agregaste correctamente el producto a la cesta.', mainContainer);
      
    }, 500);

    await counterProductsInCart();
    await totalPriceCart();

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

  }

  counterElement.innerText = `${countProducts}`;

};

const totalPriceCart = () => {
  const totalProductsInCart = getDataFromLocalStorage();

  const totalPrice = totalProductsInCart.map(product => product.price).reduce((accum, num) => accum + num, 0).toFixed(2);
  
  return totalPrice;

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
                <h6 class="me-2" id="totalCart">Total: €${totalPriceCart()}</h6>
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

    totalPriceCart();

  } catch(error) {
    console.error(error.message);
  
  };

};


const removeProductFromCart = async(productId) => {
  try{
    let productsInLocalStorage = getDataFromLocalStorage();
    let deleteProduct = productsInLocalStorage.findIndex(product => product.id === productId);

    productsInLocalStorage.splice(deleteProduct, 1);

    saveDataInLocalStorage(productsInLocalStorage);
  
    await myCart();
    await counterProductsInCart();
    await showToast('success', '¡Producto eliminado correctamente!', 'Eliminaste correctamente el producto de la cesta.', mainContainer);
    await totalPriceCart();
    
  } catch(error) {
    console.error(error.message);

  };

};

const main = () => {
  navCart.addEventListener('click', myCart);
  
  viewProducts ();
  counterProductsInCart();

};

main();
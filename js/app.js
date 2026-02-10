function getDataFromLocalStorage(){
  let data = localStorage.getItem('data');

  return data ? JSON.parse(data) : [];

}

function saveDataInLocalStorage(data){
  localStorage.setItem('data', JSON.stringify(data));

}

function fetchData(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        fetch('https://fakestoreapi.com/products')
          .then(res => res.json())
          .then(json => resolve(json)) // El segundo .then nos parsea la respuesta del primer .then a formato JSON.
          .catch(error => reject(error));
  
    }, 100);

  });

}

function renderRatingStars(rating){
  let maxStars = 5;
  let starFill = '<img class="mb-1" src="images/icons/star-fill.svg" alt="Star">';
  let star = '<img class="mb-1" src="images/icons/star.svg" alt="Star">';
  let message = '';
  let roundedRating = Math.round(rating);

  for(let x = 1; x <= maxStars; x++){
    if(x <= roundedRating){
      message += starFill;

    }else{
      message += star;

    }

  }

  return message;

}

function showToast(message, title){
  toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
  
  };

  toastr.success(message, title);

}

function loadingMessage(container){
  let containerLoadingMessage = document.createElement('div');
  let loadingMessage = 'Cargando los productos, por favor espere... ⌛';
  containerLoadingMessage.className = 'loading-container d-flex align-items-center font-card-products';
  containerLoadingMessage.innerHTML = loadingMessage;
  containerLoadingMessage.style.textShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
  containerLoadingMessage.style.fontSize = '20px';

  container.appendChild(containerLoadingMessage);

}

function categoriesList(){
  let data = fetchData()

  return data
    .then(products => {
      let arrayCategories = products.map(product => product.category);
      let dataArray = new Set(arrayCategories); // Set es una estructura de datos que no puede almacenar valores duplicados.
      let result = [...dataArray];

      return result;

  })


};

function filterByCategory(nameCategory){
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
        imageProduct.className = 'card-img-top mx-auto d-block';
        imageProduct.style.width = '200px';
        imageProduct.style.height = '200px';
        imageProduct.style.marginTop = '20px';
        imageProduct.style.marginBottom = '20px';
        imageProduct.alt = product.title;

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body text-center';

        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title font-card-products';
        cardTitle.style.fontSize = '17px';
        cardTitle.style.lineHeight = '30px';

        let productTitle = `<b>${product.title}</b>`
        cardTitle.innerHTML = productTitle;

        let cardText = document.createElement('p');
        let price = `<b>€${product.price}</b>`;
        cardText.innerHTML = price;
        cardText.style.fontFamily = 'var(--font-products)';
        cardText.style.fontSize = '17px';
        cardText.className = 'card-text';

        let cardButton = document.createElement('button');
        cardButton.className = 'btn btn-warning mb-5 font-buttons';
        cardButton.style.color = 'black';
        cardButton.innerHTML = 'Añadir al carrito';

        cardButton.addEventListener('click', () => {
          addProductToLocalstorage(product.id);

        });

        let buttonViewDetail = document.createElement('button');
        buttonViewDetail.className = 'btn btn-secondary ml-1 mb-5 font-buttons';
        buttonViewDetail.style.color = 'black';
        
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

      containerProducts.scrollIntoView({
        behavior: 'smooth'
      
      });

    });    

}

function returnAllTheProducts(){
  allProducts = fetchData();
  let containerProducts = document.getElementById('products-list');
  containerProducts.innerHTML = '';

  return allProducts
    .then(products => {

      loadingMessage(containerProducts);
      
      setTimeout(() => {
        let cards = [];
        containerProducts.innerHTML = '';
        
        products.forEach(product => {
          let colDiv = document.createElement('div');
          colDiv.className = 'col-lg-6 mb-4';

          let cardDiv = document.createElement('div');
          cardDiv.className = 'card';
          cardDiv.style.boxShadow = '15px 15px 15px 10px rgba(0, 0, 0, 0.3)';

          let imageProduct = document.createElement('img');
          imageProduct.src = product.image;
          imageProduct.className = 'card-img-top mx-auto d-block';
          imageProduct.style.width = '200px';
          imageProduct.style.height = '200px';
          imageProduct.style.marginTop = '20px';
          imageProduct.style.marginBottom = '20px';
          imageProduct.alt = product.title;

          let cardBody = document.createElement('div');
          cardBody.className = 'card-body text-center';

          let cardTitle = document.createElement('h5');
          cardTitle.className = 'card-title font-card-products';
          cardTitle.style.fontSize = '17px';
          cardTitle.style.lineHeight = '30px';

          let productTitle = `<b>${product.title}</b>`
          cardTitle.innerHTML = productTitle;

          let cardText = document.createElement('p');
          let price = `<b>€${product.price}</b>`;
          cardText.innerHTML = price;
          cardText.style.fontFamily = 'var(--font-products)';
          cardText.style.fontSize = '17px';
          cardText.className = 'card-text';

          let buttonBuyProduct = document.createElement('button');
          buttonBuyProduct.className = 'btn btn-warning mb-5 font-buttons';
          buttonBuyProduct.style.color = 'black';
          
          buttonBuyProduct.addEventListener('click', () => {
            addProductToLocalstorage(product.id);

          });

          buttonBuyProduct.innerHTML = 'Añadir al carrito';

          let buttonViewDetail = document.createElement('button');
          buttonViewDetail.className = 'btn btn-secondary ml-1 mb-5 font-buttons';
          buttonViewDetail.style.color = 'black';
          
          buttonViewDetail.addEventListener('click', () => {
            productDetail(product.id);

          });

          buttonViewDetail.innerHTML = 'Más detalles';

          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardText);
          cardBody.appendChild(buttonBuyProduct);
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
          if(cardHeight > maxHeight){
            maxHeight = cardHeight;
          
          }
      
        });

        cards.forEach(card => {
          card.style.height = maxHeight + 'px';
        
        });

        containerProducts.scrollIntoView({
          behavior: 'smooth'
        
        });

      }, 1000);
         
    });

}

async function productDetail(idProduct){
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
        <h5 class="titles"><b>${attr.title}</b></h5>
        <br>
        <b class="titles">Precio: €${attr.price}</b>
        <br>
        <br>
        <b class="titles element-rating">Valoración: ${attr.rating.rate} ${renderRatingStars(attr.rating.rate)} (${attr.rating.count}) </b>
        <br>
        <br>
        <b class="titles">Descripción:</b> ${attr.description}

      `

    })

    modalBodyContent += '</div>';

    modalProduct.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle del Producto</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          ${modalBodyContent}
          <div class="modal-footer">
            <button type="button" class="btn btn-warning font-buttons" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalProduct);

    $(`#modal-product-${idProduct}`).modal('show'); // Se llama al modal con ID asigando anteriormente.

  }catch{
    throw new Error(console.error('Error.'));

  }

};

async function addProductToLocalstorage(productId){
  try{
    let productsAPI = await fetchData();
    let productsInLocalStorage = getDataFromLocalStorage();
    let addedProduct = productsAPI.find(product => product.id === productId);
    
    productsInLocalStorage.push(addedProduct);
    saveDataInLocalStorage(productsInLocalStorage);
    
    setTimeout(() => {
      showToast('¡El producto fue agregado exitosamente al carrito!', 'Producto agregado con éxito');
      
    }, 500);

    await counterProductsInCart();

  }catch(error){
    console.error(error.message);

  }

}

function counterProductsInCart(){
  let productsInLocalStorage = getDataFromLocalStorage();
  let cartSection = document.getElementById('nav-cart');
  let countProducts = productsInLocalStorage.length;
  let counterElement = document.getElementById('cart-counter');
  
  if(!counterElement){
    counterElement = document.createElement('p');
    counterElement.style.listStyle = 'none';
    counterElement.style.fontSize = '11px'
    counterElement.style.color = 'white'; 
    counterElement.className = 'counter-products ml-0 mt-3';
    counterElement.id = 'cart-counter';
    cartSection.appendChild(counterElement);

  }

  counterElement.innerHTML = `<b>${countProducts}</b>`;

}

function myCart(event) {
  if(event){
    event.preventDefault();
  
  }
  
  let productsInLocalStorage = getDataFromLocalStorage();
  
  try{
    if(productsInLocalStorage){
      function deleteDuplicate(array){
        let uniqueProducts = {};
        array.forEach(element => {
          uniqueProducts[element.title] = element; // Esto nos garantiza que no se puedan agregar objetos con el mismo título.
        
        });
      
        return Object.values(uniqueProducts);
      
      }
  
      function countDuplicate(array){
        let countMap = {};
        
        array.forEach(element => {
          if(countMap[element.title]){
            countMap[element.title]++;
          
          }else{
            countMap[element.title] = 1;
          
          }
        
        });
  
        return countMap;
  
      }
  
      let modalBodyContent = '<div class="modal-body">';
      let noneDuplicate = deleteDuplicate(productsInLocalStorage);
      let count = countDuplicate(productsInLocalStorage);
  
      if(productsInLocalStorage.length > 0){
        noneDuplicate.forEach(attr => {
          let productCount = count[attr.title];
          let totalPrice = attr.price * productCount;

          modalBodyContent += `
            <div class="d-flex align-items-start mb-4">
              <img class="image-product-to-cart" src="${attr.image}" style="margin-right: 20px;">
              <div>
                <h5 class="titles"><b>${attr.title}</b></h5>
                <p class="titles"><b>Precio: €${attr.price} | Cantidad: ${productCount} | Total: €${totalPrice.toFixed(2)} |</b><a class="link-remove m-3" onclick="removeProductToCart(${attr.id})"><img class="mr-1 mb-1" src="/images/icons/trash3-fill.svg">Remover</a></p>
              </div>
            </div>
            <hr class="horizontal-line my-2">
          `;

        });      
        
        
      }else if(productsInLocalStorage.length === 0){
        let message = `
          <div class="d-flex align-items-center justify-content-center">
            <img class="empty-cart" src="images/pngwing.com.png">
          </div>
          <h4 class="justify-content-center text-center title-empty-cart">¡Tu carrito de compras está vacío!</h4>

        `
        modalBodyContent += message;
        
      };
      
      modalBodyContent += '</div>';
      
      let modalCart = document.getElementById('modal-cart');
      
      if(!modalCart){ 
        modalCart = document.createElement('div');
        let bagCheckImg = '/images/icons/bag-dash-fill.svg';
        modalCart.className = 'modal fade';
        modalCart.id = 'modal-cart';
        modalCart.tabIndex = -1;
        
        modalCart.innerHTML = `
          <div class="modal-dialog custom-modal-cart">
            <div class="modal-content">
              <div class="modal-header align-items-center text-center">
                <h5 class="modal-title titles">
                  <img src="${bagCheckImg}" class="ml-3 mr-3 img-cart">Mi carrito
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              ${modalBodyContent}
              <div class="modal-footer">
                <button type="button" id='close-mycart' class="btn btn-warning font-buttons" data-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modalCart);
      
      }else{
        modalCart.querySelector('.modal-body').innerHTML = modalBodyContent;
      
      }
          
      $(`#modal-cart`).modal('show'); // Se llama al modal con ID asignado anteriormente.  

    }  
    
  }catch(error){
    console.error(error);
  
  }

}

async function removeProductToCart(productID){
  try{
    let productsInLocalStorage = getDataFromLocalStorage();
    let productIndex = productsInLocalStorage.findIndex(product => product.id === productID);
    productsInLocalStorage.splice(productIndex, 1);
    
    saveDataInLocalStorage(productsInLocalStorage);
  
    showToast('Producto eliminado con éxito');
  
    await myCart();
    await counterProductsInCart();
    
  }catch(error){
    console.error(error);

  }

}

function main(){
  returnAllTheProducts();
  counterProductsInCart();

}

main();
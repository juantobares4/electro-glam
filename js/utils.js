export const getDataFromLocalStorage = () => {
  let data = localStorage.getItem('data');

  return data ? JSON.parse(data) : [];

};

export const saveDataInLocalStorage = (data) => {
  localStorage.setItem('data', JSON.stringify(data));

};

export const getStatusIcon = (status) => {
  let tag;
  
  switch (status) {
    case 'error':
      tag = '<i class="bi bi-x-circle me-2"></i>';  

      break;

    case 'success':
      tag = '<i class="bi bi-check-circle me-2"></i>';

      break
  
    case 'warning':
      tag = '<i class="bi bi-exclamation-triangle me-2"></i>';

      break

    default:
      tag = '<i class="bi bi-info-circle me-2"></i>';

      break

  };

  return tag;

};

export const renderRatingStars = (rating) => {
  let maxStars = 5;
  let starFill = '<img class="mb-1" src="images/assets/star-fill.svg" alt="Star">';
  let star = '<img class="mb-1" src="images/assets/star.svg" alt="Star">';
  let message = '';
  let roundedRating = Math.round(rating);

  for(let x = 1; x <= maxStars; x++){
    if (x <= roundedRating) {
      message += starFill;

    } else {
      message += star;

    };

  }

  return message;

};

const changeFormat = (minutes) => {
  const parseMinutes = minutes.toString();

  const newFormat = parseMinutes.length < 2 ? '0' + minutes : minutes;

  return newFormat;

};

export const whatTime = () => {
  const objectDate = new Date();
  const getMinutes = objectDate.getMinutes();

  const newFormatMinutes = changeFormat(getMinutes);

  return `${objectDate.getHours()}:${newFormatMinutes}`;

};

export const showToast = (type, title, msg, container) => {
  let mainContainer = container || document.body;
  let toastWrapper = document.getElementById('toast-wrapper');
  
  if (!toastWrapper) {
    toastWrapper = document.createElement('div');
    toastWrapper.id = 'toast-wrapper';
    toastWrapper.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastWrapper.style.zIndex = 1090;
    mainContainer.appendChild(toastWrapper);
  
  };

  const iconElement = getStatusIcon(type);

  const toast = document.createElement('div');
  toast.className = 'toast align-items-center';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-header titles-font">
      ${iconElement}
      <strong class="me-auto text-${type === 'success' ? 'success' : 'danger'}" style="font-size: 14px">${title}</strong>
      <small class="text-muted ms-2">${whatTime()}hs</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-center paragraph-font" style="font-size: 13px">
      ${msg}
    </div>
  
  `;

  toastWrapper.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
  
  bsToast.show();

  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  
  });

};

export const totalPriceCart = () => {
  const totalProductsInCart = getDataFromLocalStorage();

  const total = totalProductsInCart.reduce((accum, product) => {
    return accum + product.price;
  
  }, 0);
  
  return total.toFixed(2);

};
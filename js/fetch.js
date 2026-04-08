export const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        fetch('https://fakestoreapi.com/products')
          .then(res => res.json())
          .then(json => resolve(json)) // El segundo .then nos parsea la respuesta del primer .then a formato JSON.
          .catch(error => reject(error));
  
    }, 100);

  });

};
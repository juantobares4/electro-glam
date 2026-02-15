const objectDate = new Date();
const getMinutes = (objectDate.getMinutes() - 10).toString();

const parseMinutes = parseMinutes.length < 2 ? '0' + getMinutes : getMinutes;

console.log(digits);
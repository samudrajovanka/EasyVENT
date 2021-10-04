const formatRupiah = (money) => {
  const reverse = money.toString().split('').reverse().join('');
  let result = reverse.match(/\d{1,3}/g);
  result = result.join('.').split('').reverse().join('');
  return `Rp ${result}`;
};

export default formatRupiah;

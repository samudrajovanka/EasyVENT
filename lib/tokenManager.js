import jwt from 'jsonwebtoken';

const createToken = (payload, secretKey, options) => jwt.sign(payload, secretKey, options);
const decodeToken = (token, secretKey) => new Promise((resolve, reject) => {
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

export {
  createToken,
  decodeToken,
};

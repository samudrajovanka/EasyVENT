import jwt from 'jsonwebtoken';

const createToken = (payload, options) => jwt.sign(payload, process.env.SECRET_KEY, options);
const decodedToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

export {
  createToken,
  decodedToken,
};

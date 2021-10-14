const isAlphanumericWithSpace = (str) => /^[a-zA-Z0-9\s]+$/gm.test(str);
const isUsername = (str) => /^[a-z0-9_.]+$/gm.test(str);
const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/gm.test(str);

export {
  isAlphanumericWithSpace,
  isUsername,
  isEmail,
};

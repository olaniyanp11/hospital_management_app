const check = (req, res, next) => {
  console.log(`${req.method} : ${req.ip}`);
  next();
};
export default check;

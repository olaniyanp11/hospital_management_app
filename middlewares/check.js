const check = (req, res, next) => {
  console.log(`${req.method} : ${req.ip} to ${req.path}`);
  next();
};
export default check;

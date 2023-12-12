import jwt from "jsonwebtoken";

const checkCookie = (req, res, next) => {
  try {
    let authenticatedcookie = req.cookies.Authentication;
    let decodecookie = jwt.verify(authenticatedcookie, process.env.SECRETE);
    if (decodecookie) {
      let user_id = decodecookie.user_id;
      let role = decodecookie.role;
      let exp = decodecookie.exp;
      if (Date.now() <= exp && user_id) {
        req.user = { id: user_id, role: role };
        next();
        return;
      }

    } else {
      console.log("no token");
    }
  } catch (error) {
    console.log("unavailabe authorisation : " + error);
  }
  return res.status(401).json("unauthorised");
};
export default checkCookie;

import jwt from "jsonwebtoken";

const checkPatientCookie = (req, res, next) => {
  try {
    let authenticatedcookie = req.cookies.Authentication;
    let decodecookie = jwt.verify(authenticatedcookie, process.env.SECRETE);
    if (decodecookie) {
      let patient_id = decodecookie.patient_id;
      let exp = decodecookie.exp;
      if (Date.now() <= exp && patient_id) {
        req.user = { id: patient_id };
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
export default checkPatientCookie;

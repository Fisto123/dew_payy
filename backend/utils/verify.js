import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, "ZoJzc70XB0hXJNaPmnKkooOd5wiaJz0e", (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authentitcated!");
  }
};
export const adminauth = (req, res, next) => {
  const authHeader = req.cookies.admintoken;
  if (authHeader) {
    jwt.verify(authHeader, "ZoJzc70XB0hXJNaPmnKkooOd5wiaJz0e", (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authentitcated!");
  }
};
export const verifyTokenAndAdmin = (req, res, next) => {
  adminauth(req, res, () => {
    if (
      req.user.role === "superadmin" ||
      req.user.role === "corporate_owner" ||
      req.user.role === "product_owner"
    ) {
      next();
    } else {
      res.status(403).json("Only a superadmin can perfoem this operation!");
    }
  });
};

export const verifyTokenAndProductOwner = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === "product_owner") {
      next();
    } else {
      res.status(403).json("sorry!!! You are not a productowner!");
    }
  });
};
export const verifyTokenAndCorporateOwner = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === "corporate_owner") {
      next();
    } else {
      res.status(403).json("sorry!!! You are not a corporate_owner!");
    }
  });
};

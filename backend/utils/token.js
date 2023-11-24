import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.userid,
      surname: user.surname,
      firstname: user.firstname,
      email: user.email,
      orgid: user.organizationid,
      isact: user.accountactivated,
      veri: user.verifiedorgstatus,
      roles: user.roles,
    },
    "ZoJzc70XB0hXJNaPmnKkooOd5wiaJz0e",
    {
      expiresIn: "1h",
    }
  );
  return token;
};

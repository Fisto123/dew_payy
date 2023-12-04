import { dbConn } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import { userModel } from "./user/user.js";
import { departmentModel } from "./department/department.js";
import { billerModel } from "./biller/biller.js";
import { invoiceModel } from "./invoice/invoice.js";
import { paymentModel } from "./payment/payment.js";
export const sequelize = new Sequelize(
  dbConn.DB,
  dbConn.USER,
  dbConn.PASSWORD,
  {
    host: dbConn.HOST,
    dialect: dbConn.dialect,
    operatorsAlliases: false,
    pool: {
      max: dbConn.pool.max,
      min: dbConn.pool.min,
      acquire: dbConn.pool.acquire,
      idle: dbConn.pool.idle,
    },
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("connected...");
  })
  .catch((error) => console.log(error));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = userModel(sequelize, DataTypes);
db.department = departmentModel(sequelize, DataTypes);
db.biller = billerModel(sequelize, DataTypes);
db.invoice = invoiceModel(sequelize, DataTypes);
db.payment = paymentModel(sequelize, DataTypes);

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("yes re-sync done!!");
// });

//await sequelize.sync({ alter: true });
// await sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Schema updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Schema update error:", error);
//   });

// db.sequelize.sync({ force: true, alter: true }).then(() => {
//   console.log("Hard reset done!!");
// });  "CASCADE",
db.user.hasMany(db.department, {
  foreignKey: "userid",
});
db.department.belongsTo(db.user, {
  foreignKey: "userid",
  as: "user",
});

db.biller.hasMany(db.user, {
  foreignKey: "userid",
});
db.user.belongsTo(db.biller, {
  foreignKey: "userid",
  as: "user",
});

db.department.hasMany(db.biller, {
  foreignKey: "departmentid",
});
db.biller.belongsTo(db.department, {
  foreignKey: "departmentid",
  as: "department",
});

// db.biller.belongsTo(db.user, { foreignKey: "userid", as: "users" });

// Define the association
// db.invoice.belongsToMany(db.biller, {
//   through: "InvoiceBillers", // This is the name of your intermediary table
//   foreignKey: "invoiceid",
// });
// db.biller.belongsToMany(db.invoice, {
//   through: "InvoiceBillers", // This is the name of your intermediary table
//   foreignKey: "billers",
// });

db.invoice.hasMany(db.payment, {
  foreignKey: "invoiceid",
});
db.payment.belongsTo(db.invoice, {
  foreignKey: "invoiceid",
  as: "invoices",
});
export default db;

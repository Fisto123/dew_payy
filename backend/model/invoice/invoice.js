export const invoiceModel = (sequelize, DataTypes) => {
  const invoice = sequelize.define("invoice", {
    invoiceid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    organizationid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerfirstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerlastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amountpaid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amountdue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customeremail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    billings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM,
      defaultValue: "pending",
      values: ["pending", "paid"],
    },
  });

  return invoice;
};

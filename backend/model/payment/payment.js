export const paymentModel = (sequelize, DataTypes) => {
  const payment = sequelize.define("payment", {
    paymentid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    invoiceid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organizationid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return payment;
};

export const billerModel = (sequelize, DataTypes) => {
  const biller = sequelize.define("biller", {
    billerid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // userid: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "Users",
    //     key: "userid",
    //   },
    // },
    departmentid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organizationid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    billcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    billdescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  });

  return biller;
};

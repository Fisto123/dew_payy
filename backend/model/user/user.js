import { isValidImageLink } from "../../utils/validlink.js";

export const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    userid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    organizationid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "firstname must be between 3 and 30 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter your password",
        },
        customValidation(value) {
          if (value === "admin" || value === "user" || value === "name") {
            throw new Error(`password cannot be ${value} `);
          }
        },
      },
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 20],
          msg: "surname must be between 3 and 30 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    companyname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Please provide your 11 digits phonenumber",
        },
        isNumeric: {
          msg: "Phone only numbers",
        },
      },
    },
    actcode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    accountactivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilepicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordchanged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM,
      defaultValue: "active",
      values: ["active", "inactive"],
    },
    corporateinformation: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    corporateidentitystatus: {
      type: DataTypes.ENUM,
      defaultValue: "notsubmitted",
      values: ["pending", "approved", "rejected", "notsubmitted"],
      validateCorporateInfo(value) {
        if (!value || typeof value !== "object") {
          throw new Error("Corporate information must be an object");
        }

        if (!value.RCNo || isNaN(value.RCNo)) {
          throw new Error("RCNo must be a valid number");
        }

        if (!value.CAC || !isValidImageLink(value.CAC)) {
          throw new Error("CAC must be a valid image link");
        }

        if (!value.utility || !isValidImageLink(value.utility)) {
          throw new Error("Utility must be a valid image link");
        }
      },
    },
    corporatedocumentinfo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    corporatedocumentinfostatus: {
      type: DataTypes.ENUM,
      defaultValue: "notsubmitted",
      values: ["pending", "approved", "rejected", "notsubmitted"],
    },
    corporatecontact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    corporatecontactstatus: {
      type: DataTypes.ENUM,
      defaultValue: "notsubmitted",
      values: ["pending", "approved", "rejected", "notsubmitted"],
    },
    verifiedorgstatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // roles: {
    //   type: DataTypes.ENUM(
    //     "corporate_owner",
    //     "dashboard_admin",
    //     "biller_agent",
    //     "terminal_agent",
    //     "product_owner"
    //   ),
    //   allowNull: false,
    // },
    roles: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
  });

  return User;
};

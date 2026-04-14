// models/otp.model.js
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define(
    "Otp",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      otp: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      attempt_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "otps",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",

      indexes: [
        {
          fields: ["customer_id"],
        },
        {
          fields: ["customer_id", "type", "method"],
        },
        {
          fields: ["expires_at"],
        },
      ],
    }
  );
  return Otp;
};

const { DataTypes } = require("sequelize");

const Plan = (sequelize) => {
  return sequelize.define(
    "Plan",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "plans",
      timestamps: true,
    }
  );
};
module.exports = Plan;

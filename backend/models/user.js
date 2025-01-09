const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "coach", "athlete"),
        allowNull: false,
        defaultValue: "athlete",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
};

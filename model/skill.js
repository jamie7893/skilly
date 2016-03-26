module.exports = function(sequelize, DataTypes) {
    return sequelize.define('skill', {
        skillid: {
          type: DataTypes.INTEGER(10),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unsigned: true
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false
        }
        },
        {
          tableName: 'skill',
          freezeTableName: true,
          timestamps: false
        });
    };

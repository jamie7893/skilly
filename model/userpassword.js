

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userpassword', {

      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      facebookid: DataTypes.STRING,
      facebooktoken: DataTypes.STRING,
      facebookemail: DataTypes.STRING,
      facebookname: DataTypes.STRING,
      googleid: DataTypes.STRING,
      googletoken: DataTypes.STRING,
      googleemail: DataTypes.STRING,
      googlename: DataTypes.STRING,
      windowsliveid: DataTypes.STRING,
      windowslivetoken: DataTypes.STRING(1024),
      windowsliveemail: DataTypes.STRING,
      windowslivename: DataTypes.STRING
    }, {
      tableName: 'userpassword',
      freezeTableName: true,
      timestamps: false
    });
  };

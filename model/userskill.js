module.exports = function(sequelize, DataTypes) {
		return sequelize.define('userskill', {
				userid: {
					type: DataTypes.INTEGER(10),
					allowNull: false,
					primaryKey: true,
					unsigned: true
				},
        skillid: {
					type: DataTypes.INTEGER(10),
					allowNull: false,
					primaryKey: true,
					unsigned: true
				}
				},
				{
					tableName: 'userskill',
					freezeTableName: true,
					timestamps: false
				});
		};

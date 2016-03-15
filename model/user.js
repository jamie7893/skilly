module.exports = function(sequelize, DataTypes) {
		return sequelize.define('user', {
				userid: {
					type: DataTypes.INTEGER(10),
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					unsigned: true
				},
				nameLast: {
					type: DataTypes.CHAR(30),
					allowNull: false
				},
				nameFirst: {
					type: DataTypes.CHAR(30),
					allowNull: false
				},
				age: {
					type: DataTypes.INTEGER(10),
					unsigned: true
				},
				idTitle: {
					type: DataTypes.INTEGER(10),
					allowNull: false
				}
				},
				{
					tableName: 'user',
					freezeTableName: true,
					timestamps: false
				});
		};

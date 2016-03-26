module.exports = function(sequelize, DataTypes) {
		return sequelize.define('title', {
				id: {
					type: DataTypes.INTEGER(10),
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: DataTypes.CHAR(30),
					allowNull: false
				}
				},
				{
					tableName: 'title',
					freezeTableName: true,
					timestamps: false
				});
		};

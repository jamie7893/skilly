module.exports = function(sequelize, DataTypes) {
		return sequelize.define('userskill', {
				id: {
					type: DataTypes.INTEGER(10),
					allowNull: false,
					primaryKey: true,
					unsigned: true
				},
        idSkill: {
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

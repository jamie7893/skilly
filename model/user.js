module.exports = function(sequelize, DataTypes) {
		return sequelize.define('user', {
			id: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
				primaryKey: true,
				unique: true,
				autoIncrement: true
				},
				nameLast: {
		      type: DataTypes.STRING,
		      allowNull: false
		    },
		    nameFirst: {
		      type: DataTypes.STRING,
		      allowNull: false
		    },
		    localemail: {
		      type: DataTypes.STRING,
		      allowNull: false,
		      unique: true
		    },
				idTitle: {
					type: DataTypes.INTEGER(10),
					primaryKey: true
				}
				},
				{
					tableName: 'user',
					freezeTableName: true,
					timestamps: false
				});
		};

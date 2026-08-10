module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    'Genre',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deskripsi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'genre',
      timestamps: true,
    }
  );
Genre.associate = (models) => {
  Genre.belongsToMany(models.Komik, {
    through: 'KomikGenre',
    foreignKey: 'genre_id',
    otherKey: 'komik_id',
    as: 'komik'
  });
};

return Genre;
};
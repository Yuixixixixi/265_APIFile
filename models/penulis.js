module.exports = (sequelize, DataTypes) => {
  const Penulis = sequelize.define('Penulis', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'penulis',
    timestamps: true
  });

  Penulis.associate = (models) => {
    Penulis.hasMany(models.Komik, { foreignKey: 'penulis_id', as: 'buku' });
  };

  return Penulis;
};

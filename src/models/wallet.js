export default (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    'Wallet',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      walletNo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      denomination: {
        type: DataTypes.STRING,
        defaultValue: 'NGN',
      },
      balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {},
  );

  Wallet.associate = models => {
    Wallet.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    Wallet.hasMany(models.Transaction, {
      foreignKey: {
        name: 'walletId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  };

  return Wallet;
};

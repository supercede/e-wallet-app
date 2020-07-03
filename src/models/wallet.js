module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {},
  );

  Wallet.prototype.verifyBalance = function (amount) {
    return this.balance >= amount;
  };

  Wallet.prototype.toJSON = function () {
    const values = { ...this.get() };

    values.balance /= 100;
    return values;
  };

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

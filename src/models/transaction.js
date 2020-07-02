module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('credit', 'debit', 'self-fund'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      source: {
        type: DataTypes.STRING,
      },
      recipient: {
        type: DataTypes.STRING,
      },
      narration: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('success', 'failed', 'pending'),
        allowNull: false,
      },
      walletBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      denomination: {
        type: DataTypes.STRING,
        defaultValue: 'NGN',
      },
      errMsg: {
        type: DataTypes.STRING,
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

  Transaction.prototype.toJSON = function () {
    const values = { ...this.get() };

    values.amount /= 100;
    values.walletBalance /= 100;
    return values;
  };

  Transaction.associate = models => {
    Transaction.belongsTo(models.Wallet, {
      foreignKey: {
        name: 'walletId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  };

  return Transaction;
};

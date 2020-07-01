export default (sequelize, DataTypes) => {
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
    },
    {},
  );

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

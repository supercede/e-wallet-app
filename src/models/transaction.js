export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('credit', 'debit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    narration: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      allowNull: false,
    },
  });

  Transaction.associate = models => {
    Transaction.belongsTo(models.Wallet, {
      foreignKey: {
        name: 'walletId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  };

  return User;
};

export default (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    walletNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    password: {
      type: DataType.tring,
    },
  });

  Wallet.associate = models => {
    Wallet.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
    Wallet.hasMany(models.User, {
      foreignKey: {
        name: 'walletId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    });
  };
};

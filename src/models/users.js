export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
    },
  });

  User.getExistingUser = async (queryString, column = 'email') => {
    const user = await User.findOne({
      where: { [column]: queryString },
    });
    return user;
  };

  User.associate = models => {
    User.hasOne(models.Wallet, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return User;
};

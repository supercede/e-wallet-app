export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
    },
    {},
  );

  User.getExistingUser = async (queryString, column = 'email') => {
    const user = await User.findOne({
      where: { [column]: queryString },
    });
    return user;
  };

  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash();
  });

  User.beforeUpdate(async user => {
    if (user.changed('password')) {
      user.password = await user.generatePasswordHash();
    }
  });

  User.prototype.generatePasswordHash = async function generatePasswordHash() {
    const saltRounds = +process.env.SALT;
    return bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, secret, {
      expiresIn: '3d',
    });
  };

  User.prototype.getSafeDataValues = function () {
    const { password, ...data } = this.dataValues;
    return data;
  };

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
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

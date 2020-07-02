import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const secret = process.env.JWT_SECRET;

module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.STRING,
      },
      passwordLastChanged: DataTypes.DATE,
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
      user.passwordLastChanged = Date.now();
    }
  });

  // User.beforeSave(async user => {
  //   if (user.changed('password')) {
  //     user.password = await user.generatePasswordHash();
  //     user.passwordLastChanged = Date.now();
  //   }
  // });

  User.prototype.generatePasswordHash = async function generatePasswordHash() {
    const saltRounds = +process.env.SALT;
    return bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.generateAccessToken = function () {
    return jwt.sign({ id: this.id }, secret, {
      expiresIn: '3d',
    });
  };

  // User.prototype.getSafeDataValues = function () {
  //   const { password, ...data } = this.dataValues;
  //   return data;
  // };
  User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
  };

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.checkLastPasswordChange = function (jwtTimestamp) {
    if (this.passwordLastChanged) {
      const lastPasswordChange = this.passwordLastChanged.getTime() / 1000;

      return jwtTimestamp < lastPasswordChange;
    }
    // false indicates that JWT was issued after last password change and thus is valid

    return false;
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

const { DataTypes } = require('sequelize');
import { UserRole } from '@interfaces/IModels';
import CustomError from '@utils/customError';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECURE } from '../../constants';
import db from '../db';

const User = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.User,
  },
  authenticated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  auth0ProviderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

/**
 * Instance method to compare the password entered by the user
 */
User.prototype.comparePassword = function (userPwd: string): Promise<boolean> {
  return bcryptjs.compare(userPwd, this.password);
};

User.prototype.generateTokens = function (): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = jwt.sign(
    {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      authenticated: this.authenticated,
      role: this.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '15m', // 15 minutes
    }
  );

  const refreshToken = jwt.sign(
    {
      id: this.id,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: 7 * 24 * 60 * 60 * 1000, // "7d"
    }
  );

  return { accessToken, refreshToken };
};

/**
 * classMethods
 */

User.authenticate = async function (
  email: string,
  password: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError('Invalid login credentials', 401);
  }
  return user.generateTokens();
};

User.findByToken = async function (token: string): Promise<any> {
  try {
    const { id } = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as { id: number };
    const user = await User.findByPk(id);
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    return user;
  } catch (error) {
    throw new CustomError('Invalid token', 401);
  }
};

/**
 * Hooks
 */

const hashPwd = async (user: any) => {
  if (user.changed('password')) {
    user.password = await bcryptjs.hash(user.password, SECURE.SALT);
  }
};

User.beforeCreate(hashPwd);
User.beforeUpdate(hashPwd);
User.beforeBulkCreate((users: any) => Promise.all(users.map(hashPwd)));
export default User;

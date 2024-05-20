const { DataTypes } = require('sequelize');
import { SECURE } from '../../constants';
import CustomError from '@utils/customError';
import db from '../db';
import bcrypt from 'bcrypt';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@interfaces/IModels';

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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 50],
    },
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.User,
  },
});

/**
 * Instance method to compare the password entered by the user
 */
User.prototype.comparePassword = function (userPwd: string): Promise<boolean> {
  return bcryptjs.compare(userPwd, this.password);
};

User.prototype.generateToken = function (): string {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
};

/**
 * classMethods
 */

User.authenticate = async function (
  email: string,
  password: string
): Promise<string> {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError('Invalid login credentials', 401);
  }
  return user.generateToken();
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

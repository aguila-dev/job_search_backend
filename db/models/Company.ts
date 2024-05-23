import db from '../db';
import { DataTypes } from 'sequelize';
import path from 'path';

const Company = db.define('company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: path.join('/images', 'placeholder.png'),
  },
  frontendUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apiEndpoint: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});
export default Company;

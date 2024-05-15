import { DataTypes } from 'sequelize';
import db from '../db';
import { JobSourceEnum } from '@interfaces/IModels';

const JobSource = db.define('jobSource', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM(...Object.values(JobSourceEnum)),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
});

export default JobSource;

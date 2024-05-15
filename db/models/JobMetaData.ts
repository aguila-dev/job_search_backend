import { DataTypes } from 'sequelize';
import db from '../db';
import { Job } from '..';

const JobMetadata = db.define('jobMetaData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'id',
    },
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

export default JobMetadata;

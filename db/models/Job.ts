import { DataTypes } from 'sequelize';
import db from '../db';
import { Company, JobSource } from '..';

const Job = db.define(
  'job',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    jobSourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: JobSource,
        key: 'id',
      },
    },
    jobId: {
      type: DataTypes.STRING || DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    absoluteUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requisitionId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dataCompliance: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    lastUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // isUnitedStates: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    // },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['jobId', 'jobSourceId'], // Ensure combination of jobId and jobSourceId is unique
      },
    ],
  }
);

function isValidUrl(value: string) {
  try {
    new URL(value);
  } catch (error) {
    return false;
  }
}

export default Job;

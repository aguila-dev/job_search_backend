import { ApplicationStatus } from "@interfaces/IModels";
import { DataTypes } from "sequelize";
import { Job, User } from "..";
import db from "../db";
const JobApplication = db.define("jobApplication", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: "id",
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  applicationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
    allowNull: true,
  },
  noLongerConsidering: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// JobApplication.addHook("beforeSave", async (jobApplication: any) => {
//   if (
//     jobApplication.status === ApplicationStatus.ACTIVE &&
//     !jobApplication.applicationDate
//   ) {
//     jobApplication.applicationDate = new Date();
//   }
//   if (jobApplication.status === ApplicationStatus.REJECTED) {
//     jobApplication.noLongerConsidering = true;
//   }
// });

const addAppliedDate = async (jobApplication: any) => {
  if (jobApplication.status === ApplicationStatus.ACTIVE) {
    jobApplication.applicationDate = new Date();
  }
};

const updateApplicationStatus = async (jobApplication: any) => {
  if (jobApplication.status === ApplicationStatus.REJECTED) {
    jobApplication.noLongerConsidering = true;
  }
};

JobApplication.beforeCreate(addAppliedDate);
JobApplication.beforeSave(updateApplicationStatus);

export default JobApplication;

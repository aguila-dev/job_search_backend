import db from './db';
import Company from './models/Company';
import Job from './models/Job';
import JobApplication from './models/JobApplication';
import JobMetadata from './models/JobMetaData';
import JobSource from './models/JobSource';
import User from './models/User';
import UserFavorite from './models/UserFavorite';

Job.belongsTo(Company, { foreignKey: 'companyId' });
Company.hasMany(Job, { foreignKey: 'companyId' });

Job.belongsTo(JobSource, { foreignKey: 'jobSourceId' });
JobSource.hasMany(Job, { foreignKey: 'jobSourceId' });

Company.belongsTo(JobSource, { foreignKey: 'jobSourceId' });
JobSource.hasMany(Company, { foreignKey: 'jobSourceId' });

JobApplication.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(JobApplication, { foreignKey: 'userId', onDelete: 'CASCADE' });

JobApplication.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(JobApplication, { foreignKey: 'jobId' });

JobMetadata.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(JobMetadata, { foreignKey: 'jobId' });

User.belongsToMany(Company, {
  through: UserFavorite,
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Company.belongsToMany(User, { through: UserFavorite, foreignKey: 'companyId' });

export {
  Company,
  Job,
  JobApplication,
  JobMetadata,
  JobSource,
  User,
  UserFavorite,
  db,
};

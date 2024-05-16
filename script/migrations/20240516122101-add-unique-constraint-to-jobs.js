'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('jobs', {
      fields: ['jobId', 'jobSourceId'],
      type: 'unique',
      name: 'jobs_jobId_jobSourceId_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('jobs', 'jobs_jobId_jobSourceId_unique');
  }
};
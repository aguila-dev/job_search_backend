'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('job_sources', [
      { name: 'workday' },
      { name: 'greenhouse' },
      // Add more job sources as needed
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('job_sources', {
      name: ['workday', 'greenhouse'], // Adjust as needed
    }, {});
  }
};

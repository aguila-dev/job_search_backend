import { JobApplication, User } from '@/db'; // Adjust the path as needed

export const deleteAllUsers = async () => {
  try {
    // Step 1: Delete all job applications first
    await JobApplication.destroy({ where: {} });
    console.log('All job applications deleted.');
    await User.destroy({
      where: {}, // This will delete all rows
      truncate: {
        cascade: true, // Cascade to all referencing tables
      },
    });
    console.log('All users have been deleted.');
    await User.drop({ cascade: true });
    console.log('User table has been dropped.');
    await User.sync();
    console.log('User table has been re-synced.');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
};

// Run the function if this script is executed directly
if (require.main === module) {
  deleteAllUsers().then(() => {
    console.log('All users have been deleted.');
  });
}

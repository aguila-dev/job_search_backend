import { deleteAllUsers } from './deleteUsers';

const resetAndSeedUsers = async () => {
  await deleteAllUsers().then(() => {
    console.log('All users have been deleted.');
  });
  // await seedTestUsers().then(() => {
  //   console.log("Test users seeded.");
  // });
};

// Run the function if this script is executed directly
if (require.main === module) {
  resetAndSeedUsers();
}

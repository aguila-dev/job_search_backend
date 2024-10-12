import { User } from '@/db'; // Adjust the path as needed
// import { testUsers } from "@/data/testUsers"; // Adjust the path as needed

export const seedTestUsers = async () => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('Seeding test users...');
      // await User.bulkCreate(testUsers);
      console.log('Test users seeded.');
    } else {
      console.log('Test users already seeded.');
    }
  } catch (error) {
    console.error('Error seeding test users:', error);
  }
};

// Run the function if this script is executed directly
if (require.main === module) {
  seedTestUsers().then(() => {
    console.log('Test users seeded.');
  });
}

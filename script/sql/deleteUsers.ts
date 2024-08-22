import { User } from "@/db"; // Adjust the path as needed

export const deleteAllUsers = async () => {
  try {
    await User.destroy({
      where: {}, // This will delete all rows
      truncate: {
        cascade: true, // Cascade to all referencing tables
      },
    });
    console.log("All users have been deleted.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

// Run the function if this script is executed directly
if (require.main === module) {
  deleteAllUsers().then(() => {
    console.log("All users have been deleted.");
  });
}

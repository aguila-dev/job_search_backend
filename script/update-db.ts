import { updateDatabaseJobListings } from "@services/populateDatabase";

async function runUpdateDatabaseJobListings() {
  try {
    await updateDatabaseJobListings();
    console.log("Database job listings updated successfully.");
  } catch (error) {
    console.error("Error running the update database script:", error);
  }
}

runUpdateDatabaseJobListings();

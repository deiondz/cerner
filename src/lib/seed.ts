import { createWard } from "~/server/wards";
import { db } from "../server/db/index";
import { workers, wards, households } from "../server/db/schema";

export async function seedWards() {
  const wardNames = [
    "Ward A - North District",
    "Ward B - South District",
    "Ward C - East District",
    "Ward D - West District",
    "Ward E - Central District",
  ];

  console.log("🌱 Seeding wards...");
  for (const name of wardNames) {
    try {
      await createWard({ name });
      console.log(`✅ Created ward: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to create ward ${name}:`, error);
    }
  }
}

async function seedWorkers() {
  const workersData = [
    {
      name: "John Smith",
      contactNumber: "+1234567890",
      wardAssigned: "Ward A - North District",
      deviceId: "DEV001",
    },
    {
      name: "Sarah Johnson",
      contactNumber: "+1987654321",
      wardAssigned: "Ward B - South District",
      deviceId: "DEV002",
    },
    {
      name: "Michael Brown",
      contactNumber: "+1122334455",
      wardAssigned: "Ward C - East District",
      deviceId: "DEV003",
    },
  ];

  console.log("🌱 Seeding workers...");
  for (const worker of workersData) {
    try {
      await db.insert(workers).values(worker);
      console.log(`✅ Created worker: ${worker.name}`);
    } catch (error) {
      console.error(`❌ Failed to create worker ${worker.name}:`, error);
    }
  }
}

async function seedHouseholds() {
  // First get all wards
  const allWards = await db.select().from(wards);

  const householdsData = [
    {
      householdId: "HH001",
      ownerNumber: "+1234567890",
      address: "123 Main St",
      status: "active",
    },
    {
      householdId: "HH002",
      ownerNumber: "+1987654321",
      address: "456 Oak Ave",
      status: "active",
    },
    {
      householdId: "HH003",
      ownerNumber: "+1122334455",
      address: "789 Pine Rd",
      status: "active",
    },
  ];

  console.log("🌱 Seeding households...");
  for (const household of householdsData) {
    try {
      // Assign each household to a random ward
      const randomWard = allWards[Math.floor(Math.random() * allWards.length)];
      if (!randomWard) {
        throw new Error("No wards available for household assignment");
      }
      await db.insert(households).values({
        ...household,
        wardCode: randomWard.wardCode,
      });
      console.log(`✅ Created household: ${household.householdId}`);
    } catch (error) {
      console.error(
        `❌ Failed to create household ${household.householdId}:`,
        error,
      );
    }
  }
}

async function main() {
  try {
    await seedWards();
    await seedWorkers();
    await seedHouseholds();
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

void main();

import { prisma } from "../../src/libs/prisma";
import { seedItens } from "./item";
import { seedUser } from "./user";

async function seed() {
  await seedUser();
  await seedItens()
}

seed().then(() => {
  console.log("Seeding completed!");
  prisma.$disconnect();
});

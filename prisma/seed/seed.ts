import { prisma } from "../../src/libs/prisma";
import { seedItens } from "./item";
import { seedPayments } from "./payments";
import { seedUser } from "./user";

async function seed() {
  await seedUser();
  await seedItens()
  await seedPayments()
}

seed().then(() => {
  console.log("Seeding completed!");
  prisma.$disconnect();
});

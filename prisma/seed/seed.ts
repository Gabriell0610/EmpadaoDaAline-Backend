import { prisma } from "../../src/libs/prisma";
import { seedItens } from "./item";
import { seedItemTypes } from "./itemType";
import { seedPayments } from "./payments";
import { seedUser } from "./user";

async function seed() {
  await seedUser();
  await seedItemTypes();
  await seedItens()
  await seedPayments()
}

seed().then(() => {
  console.log("Seeding completed!");
  prisma.$disconnect();
});

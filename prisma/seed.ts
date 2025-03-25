import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Möjliga värden för role, level och contract
const roles = ["Frontend", "Backend", "Fullstack"];
const levels = ["Junior", "Midweight", "Senior"];
const contracts = ["Full Time", "Part Time"];

// Funktion för att generera ett slumpmässigt jobb
function generateJob() {
  return {
    company: faker.company.name(),
    position: `${faker.name.jobTitle()}`, // Slumpmässig jobbtitel
    role: faker.helpers.arrayElement(roles), // Slumpmässig roll
    level: faker.helpers.arrayElement(levels), // Slumpmässig nivå
    contract: faker.helpers.arrayElement(contracts), // Slumpmässig kontraktstyp
    location: `${faker.address.city()}`, // Slumpmässig plats
    languages: [faker.helpers.arrayElement(["JavaScript", "Python", "Java", "C#", "Ruby"])], // Slumpmässigt språk (som en array)
  };
}

async function main() {
  // Rensa befintliga jobb (valfritt)
  await prisma.job.deleteMany({});

  // Generera 30 jobb
  const jobs = Array.from({ length: 50 }, generateJob);

  // Lägg till jobben i databasen
  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

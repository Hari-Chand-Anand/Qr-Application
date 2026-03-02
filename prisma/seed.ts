import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.machine.upsert({
    where: { machineId: "demo-001" },
    update: {},
    create: {
      machineId: "demo-001",
      name: "Demo Machine – DY-4412P",
      driveLink: "https://drive.google.com/",
      sheetsLink: "https://docs.google.com/spreadsheets/",
      whatsappNumber: process.env.NEXT_PUBLIC_DEFAULT_WA_NUMBER ?? "919999999999",
      whatsappTemplate:
        process.env.NEXT_PUBLIC_DEFAULT_WA_TEMPLATE ??
        "Hi, I'd like to request a quote for [Machine Name] ([Machine ID]).",
    },
  });

  console.log("Seed complete: demo-001");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

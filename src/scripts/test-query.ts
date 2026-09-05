import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  // CREATE — bikin 1 role baru
  const ownerRole = await prisma.role.create({
    data: { name: "OWNER" },
  });
  console.log("Role dibuat:", ownerRole);

  // READ — ambil semua role
  const allRoles = await prisma.role.findMany();
  console.log("Semua role:", allRoles);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
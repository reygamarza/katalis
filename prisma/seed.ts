import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Mulai seeding...");

  // 1. Bikin Role
  const ownerRole = await prisma.role.upsert({
    where: { name: "OWNER" },
    update: {},
    create: { name: "OWNER" },
  });
  console.log("Role dibuat:", ownerRole.name);

  // 2. Bikin User (password di-hash, JANGAN pernah simpan plain text)
  const hashedPassword = await bcrypt.hash("password123", 10);

  const ownerUser = await prisma.user.upsert({
    where: { username: "owner" },
    update: {},
    create: {
      username: "owner",
      passwordHash: hashedPassword,
    },
  });
  console.log("User dibuat:", ownerUser.username);

  // 3. Assign role ke user (lewat UserRole, inget konsep many-to-many kita)
  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: ownerUser.id, roleId: ownerRole.id },
    },
    update: {},
    create: { userId: ownerUser.id, roleId: ownerRole.id },
  });
  console.log("Role OWNER di-assign ke user:", ownerUser.username);

  // 4. Bikin Location
  const mainStore = await prisma.location.upsert({
    where: { id: 1n },
    update: {},
    create: { name: "Toko Utama", type: "STORE" },
  });
  console.log("Location dibuat:", mainStore.name);

  // 5. Bikin Category
  const minuman = await prisma.category.upsert({
    where: { name: "Minuman" },
    update: {},
    create: { name: "Minuman" },
  });
  console.log("Category dibuat:", minuman.name);

  // 6. Bikin Supplier
  const supplierA = await prisma.supplier.upsert({
    where: { id: 1n },
    update: {},
    create: { name: "Supplier Sembako Jaya", contactInfo: "0812-3456-7890" },
  });
  console.log("Supplier dibuat:", supplierA.name);

  // 7. Bikin Product
  const kopiSachet = await prisma.product.upsert({
    where: { sku: "KOPI-001" },
    update: {},
    create: {
      sku: "KOPI-001",
      name: "Kopi Sachet Renceng",
      categoryId: minuman.id,
      sellingPrice: 15000,
      minimumStock: 10,
    },
  });
  console.log("Product dibuat:", kopiSachet.name);

  // 8. Bikin Inventory awal
  const inventory = await prisma.inventory.upsert({
    where: {
      productId_locationId: { productId: kopiSachet.id, locationId: mainStore.id },
    },
    update: {},
    create: {
      productId: kopiSachet.id,
      locationId: mainStore.id,
      currentStock: 0,
      averageCost: 0,
    },
  });
  console.log("Inventory dibuat, stok awal:", inventory.currentStock);

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
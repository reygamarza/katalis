import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Mulai seeding...");

  // 1. Bikin Location
  const mainStore = await prisma.location.create({
    data: { name: "Toko Utama", type: "STORE" },
  });
  console.log("Location dibuat:", mainStore.name);

  // 2. Bikin Category
  const minuman = await prisma.category.create({
    data: { name: "Minuman" },
  });
  console.log("Category dibuat:", minuman.name);

  // 3. Bikin Supplier
  const supplierA = await prisma.supplier.create({
    data: { name: "Supplier Sembako Jaya", contactInfo: "0812-3456-7890" },
  });
  console.log("Supplier dibuat:", supplierA.name);

  // 4. Bikin Product
  const kopiSachet = await prisma.product.create({
    data: {
      sku: "KOPI-001",
      name: "Kopi Sachet Renceng",
      categoryId: minuman.id,
      sellingPrice: 15000,
      minimumStock: 10,
    },
  });
  console.log("Product dibuat:", kopiSachet.name);

  // 5. Bikin Inventory awal (stok 0, nanti ditambah lewat adjustStock)
  const inventory = await prisma.inventory.create({
    data: {
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
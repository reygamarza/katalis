import "dotenv/config";
import { prisma } from "../lib/prisma";
import { adjustStock } from "../lib/stock";

async function main() {
  // Ambil product & location yang udah kita seed
  const product = await prisma.product.findUniqueOrThrow({
    where: { sku: "KOPI-001" },
  });
  const location = await prisma.location.findFirstOrThrow({
    where: { name: "Toko Utama" },
  });

  console.log("Stok sebelum:", (await prisma.inventory.findUnique({
    where: { productId_locationId: { productId: product.id, locationId: location.id } },
  }))?.currentStock);

  // Simulasi barang masuk 50 unit (anggap dari receiving id 1, walau receiving-nya belum beneran ada)
  const afterQty = await adjustStock({
    productId: product.id,
    locationId: location.id,
    quantityDelta: 50,
    sourceType: "RECEIVING",
    sourceId: 1n,
  });

  console.log("Stok sesudah:", afterQty);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
import { prisma } from "./prisma";
import { StockMovementSourceType } from "../../generated/prisma/client";

export async function adjustStock({
  productId,
  locationId,
  quantityDelta,
  sourceType,
  sourceId,
  userId,
}: {
  productId: bigint;
  locationId: bigint;
  quantityDelta: number;
  sourceType: StockMovementSourceType;
  sourceId: bigint;
  userId?: bigint;
}) {
  return prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: { productId_locationId: { productId, locationId } },
    });

    if (!inventory) {
      throw new Error("Inventory record tidak ditemukan untuk produk & lokasi ini");
    }

    const beforeQty = inventory.currentStock;
    const afterQty = beforeQty + quantityDelta;

    await tx.inventory.update({
      where: { productId_locationId: { productId, locationId } },
      data: { currentStock: afterQty },
    });

    await tx.stockMovement.create({
      data: {
        productId,
        locationId,
        userId,
        sourceType,
        sourceId,
        quantityDelta,
        beforeQty,
        afterQty,
      },
    });

    return afterQty;
  });
}
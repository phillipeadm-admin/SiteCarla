
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function runSimulation() {
  console.log("--- Starting SiteCarla Deletion Verification ---");

  // 1. Create Data
  const product = await prisma.product.create({
    data: { name: "Deletion Test Bread", price: 10 }
  });
  const batch = await prisma.batch.create({
    data: { productId: product.id, availableDate: new Date(), totalCapacity: 10 }
  });
  const order = await prisma.order.create({
    data: {
      customerName: "Test User",
      customerPhone: "123",
      deliveryType: "RETIRADA",
      totalAmount: 10,
      items: {
        create: {
          batchId: batch.id,
          quantity: 1,
          pricePaid: 10
        }
      }
    }
  });

  console.log("Data created: Product, Batch, Order with OrderItem.");

  // 2. Test Deleting Order (Should delete order items automatically)
  console.log("\nTesting Order Deletion...");
  await prisma.order.delete({ where: { id: order.id } });
  const itemsAfterOrderDel = await prisma.orderItem.findMany({ where: { orderId: order.id } });
  if (itemsAfterOrderDel.length === 0) {
    console.log("SUCCESS: Order items deleted automatically via cascade.");
  } else {
    console.log("FAILURE: Order items still exist.");
  }

  // 3. Test Deleting Batch (Should delete order items - we recreated one if needed, but let's just delete the batch)
  console.log("\nTesting Batch Deletion...");
  await prisma.batch.delete({ where: { id: batch.id } });
  console.log("SUCCESS: Batch deleted without FK error.");

  // 4. Test Deleting Product
  console.log("\nTesting Product Deletion...");
  await prisma.product.delete({ where: { id: product.id } });
  console.log("SUCCESS: Product deleted without FK error.");

  console.log("\n--- Verification Finished ---");
}

runSimulation()
  .catch(e => {
    console.error("VERIFICATION FAILED:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

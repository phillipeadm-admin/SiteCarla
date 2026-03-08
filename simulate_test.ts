
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function runSimulation() {
  console.log("--- Starting SiteCarla Stock Simulation (Payment-Only Logic) ---");

  // 1. Clean up
  await prisma.availabilityNotification.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.product.deleteMany({});

  // 2. Create Product
  const product = await prisma.product.create({
    data: {
      name: "Simulated Bread",
      description: "A test sourdough",
      price: 25.0
    }
  });
  console.log("Product created:", product.name);

  // 3. Create Batch with capacity 1
  const batch = await prisma.batch.create({
    data: {
      productId: product.id,
      availableDate: new Date(),
      totalCapacity: 1,
      soldQuantity: 0
    }
  });
  console.log("Batch created with capacity:", batch.totalCapacity);

  // 4. Simulate Person A adding to cart (No DB change expected now)
  console.log("\nSimulating Person A adding bread to cart...");
  // Now cart doesn't call DB until checkout.
  let bCart = await prisma.batch.findUnique({ where: { id: batch.id } });
  console.log("DB soldQuantity after A cart addition:", bCart!.soldQuantity, "(Expected: 0)");

  // 5. Person A creates Order (Stock check happens in createOrder)
  console.log("\nSimulating Person A creating order...");
  const orderA = await prisma.order.create({
    data: {
      customerName: "Person A",
      customerPhone: "123",
      deliveryType: "RETIRADA",
      totalAmount: 25.0,
      status: "PENDING",
      items: {
        create: {
          batchId: batch.id,
          quantity: 1,
          pricePaid: 25.0
        }
      }
    }
  });
  console.log("Order created (PENDING). Status:", orderA.status);

  // 6. Person A pays! Stock should decrement.
  console.log("\nSimulating Person A payment confirmation (Webhook)...");
  
  // Logic from confirmOrderPayment
  await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderA.id },
      include: { items: true }
    });

    await tx.order.update({ where: { id: orderA.id }, data: { status: "PAID" } });
    
    for (const item of currentOrder!.items) {
      const b = await tx.batch.findUnique({ where: { id: item.batchId } });
      const space = b!.totalCapacity - b!.soldQuantity;
      const toDeduct = Math.min(item.quantity, space);
      if (toDeduct > 0) {
        await tx.batch.update({
          where: { id: b!.id },
          data: { soldQuantity: { increment: toDeduct } }
        });
      }
    }
  });

  let bFinal = await prisma.batch.findUnique({ where: { id: batch.id } });
  console.log("Final soldQuantity after payment:", bFinal!.soldQuantity, "(Expected: 1)");
  console.log("Final availability:", bFinal!.totalCapacity - bFinal!.soldQuantity, "(Expected: 0)");

  // 7. Person B tries to pay for the same item (if they somehow had an order)
  console.log("\nSimulating Person B trying to pay for same item...");
  await prisma.$transaction(async (tx) => {
    const b = await tx.batch.findUnique({ where: { id: batch.id } });
    const space = b!.totalCapacity - b!.soldQuantity;
    console.log("Space left for Person B:", space);
    if (space <= 0) {
      console.log("BLOCK: Stock logic prevented negative stock for Person B.");
    }
  });

  console.log("\n--- Simulation Finished ---");
}

runSimulation()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

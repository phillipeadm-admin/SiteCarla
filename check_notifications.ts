import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.availabilityNotification.count()
  console.log(`Total notifications: ${count}`)
  
  const pending = await prisma.availabilityNotification.count({ where: { notified: false } })
  console.log(`Pending notifications: ${pending}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

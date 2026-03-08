import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.orderItem.deleteMany({})
  await prisma.batch.deleteMany({})
  console.log('Fornadas e itens de pedido zerados com sucesso.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

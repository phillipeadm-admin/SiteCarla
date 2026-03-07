import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.batch.deleteMany({});
    console.log('Todas as fornadas pré-cadastradas foram deletadas com sucesso!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

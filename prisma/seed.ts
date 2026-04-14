import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Clean existing data to ensure a fresh start
  console.log('🧹 Cleaning database...');
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ticket.deleteMany();

  // 2. Create 1000 users using createMany for high performance
  console.log('👥 Generating 1000 users...');
  const users = Array.from({ length: 1000 }).map((_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));
  await prisma.user.createMany({ data: users });

  // 3. Create 10 major event tickets with different stock levels
  console.log('🎫 Generating tickets...');
  const tickets = [
    { eventName: 'Champions League Final', totalStock: 500, price: 1500 },
    { eventName: 'Tarkan Open Air', totalStock: 1000, price: 500 },
    { eventName: 'Interstellar Symphony', totalStock: 300, price: 250 },
    { eventName: 'Tech Conference 2026', totalStock: 2000, price: 100 },
    { eventName: 'Formula 1 Istanbul GP', totalStock: 5000, price: 800 },
    { eventName: 'Rock n Coke', totalStock: 3000, price: 400 },
    { eventName: 'Jazz Night', totalStock: 50, price: 150 },
    { eventName: 'Theater: Hamlet', totalStock: 120, price: 80 },
    { eventName: 'E-Sport World Cup', totalStock: 1500, price: 50 },
    { eventName: 'Gourmet Festival', totalStock: 800, price: 120 },
  ];
  await prisma.ticket.createMany({ data: tickets });

  console.log('✅ Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client connection
    await prisma.$disconnect();
  });
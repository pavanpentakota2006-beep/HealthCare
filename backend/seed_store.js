const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding store...");
  
  const subCategory = await prisma.category.upsert({
    where: { name: 'Subscriptions' },
    update: {},
    create: { name: 'Subscriptions', description: 'Premium HealthCare Plans' }
  });

  const gearCategory = await prisma.category.upsert({
    where: { name: 'Fitness Gear' },
    update: {},
    create: { name: 'Fitness Gear', description: 'Equipment for your home gym' }
  });

  const supplementsCategory = await prisma.category.upsert({
    where: { name: 'Supplements' },
    update: {},
    create: { name: 'Supplements', description: 'Vitamins and Protein' }
  });

  const products = [
    {
      categoryId: subCategory.id,
      name: "HealthCare Pro - 1 Month",
      description: "Unlock advanced AI features, priority doctor bookings, and premium workout plans for 30 days.",
      price: 19.99,
      stock: 9999,
      imageUrl: "/images/products/pro_monthly.png"
    },
    {
      categoryId: subCategory.id,
      name: "HealthCare Pro - 1 Year",
      description: "Get 2 months free! Full access to everything HealthCare offers.",
      price: 199.99,
      stock: 9999,
      imageUrl: "/images/products/pro_yearly.png"
    },
    {
      categoryId: gearCategory.id,
      name: "Smart Yoga Mat",
      description: "Self-rolling, anti-slip yoga mat with built-in alignment indicators.",
      price: 89.99,
      stock: 50,
      imageUrl: "/images/products/yoga_mat.png"
    },
    {
      categoryId: gearCategory.id,
      name: "Adjustable Dumbbells",
      description: "Space-saving dumbbells adjusting from 5 to 52.5 lbs.",
      price: 299.99,
      stock: 15,
      imageUrl: "/images/products/dumbbells.png"
    },
    {
      categoryId: supplementsCategory.id,
      name: "Premium Whey Protein",
      description: "Grass-fed whey protein isolate. 30g protein per scoop. Chocolate flavor.",
      price: 45.00,
      stock: 100,
      imageUrl: "/images/products/protein.png"
    }
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
      console.log(`Created product: ${p.name}`);
    } else {
      console.log(`Product already exists: ${p.name}`);
    }
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());

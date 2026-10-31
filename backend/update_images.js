const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  console.log("Updating product images...");
  
  await prisma.product.updateMany({
    where: { name: "HealthCare Pro - 1 Month" },
    data: { imageUrl: "/images/products/pro_monthly.png" }
  });

  await prisma.product.updateMany({
    where: { name: "HealthCare Pro - 1 Year" },
    data: { imageUrl: "/images/products/pro_yearly.png" }
  });

  await prisma.product.updateMany({
    where: { name: "Smart Yoga Mat" },
    data: { imageUrl: "/images/products/yoga_mat.png" }
  });

  await prisma.product.updateMany({
    where: { name: "Adjustable Dumbbells" },
    data: { imageUrl: "/images/products/dumbbells.png" }
  });

  await prisma.product.updateMany({
    where: { name: "Premium Whey Protein" },
    data: { imageUrl: "/images/products/protein.png" }
  });

  console.log("Images updated successfully!");
}

updateImages().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function fixProfiles() {
  const users = await prisma.user.findMany({ include: { profile: true } });
  for (const u of users) {
    if (!u.profile) {
      const name = u.email.split('@')[0];
      await prisma.profile.create({
        data: {
          userId: u.id,
          firstName: name,
          lastName: ''
        }
      });
      console.log('Fixed profile for', u.email);
    }
  }
}
fixProfiles().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function seedDoctors() {
  const hash = await bcrypt.hash('Doctor1234!', 10);

  const doctors = [
    {
      email: 'dr.priya@healthverse.ai',
      specialty: 'Cardiologist',
      bio: 'Expert in heart health with 12 years of experience.',
      yearsExp: 12,
      rating: 4.9,
    },
    {
      email: 'dr.arjun@healthverse.ai',
      specialty: 'Orthopedic Surgeon',
      bio: 'Specializes in sports injuries and joint replacements.',
      yearsExp: 8,
      rating: 4.7,
    },
    {
      email: 'dr.meera@healthverse.ai',
      specialty: 'Neurologist',
      bio: 'Expert in brain and nervous system disorders.',
      yearsExp: 15,
      rating: 4.8,
    },
    {
      email: 'dt.kavya@healthverse.ai',
      specialty: 'Clinical Dietitian',
      bio: 'Certified nutritionist specializing in diabetes and metabolic health.',
      yearsExp: 6,
      rating: 4.9,
      role: 'DIETITIAN'
    },
  ];

  for (const doc of doctors) {
    const role = doc.role || 'DOCTOR';
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: { email: doc.email, passwordHash: hash, role }
    });

    if (role === 'DOCTOR') {
      await prisma.doctorProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          specialization: doc.specialty,
          licenseNumber: `LIC-${Math.floor(Math.random()*900000+100000)}`,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee || 1500,
          bio: doc.bio,
        }
      });
    } else {
      await prisma.dietitianProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          certifications: doc.specialty,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee || 1200,
          bio: doc.bio,
        }
      });
    }
    console.log(`✅ Seeded: ${doc.email} (${role})`);
  }
  console.log('\n🎉 Doctors & Dietitians seeded successfully!');
}

seedDoctors()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

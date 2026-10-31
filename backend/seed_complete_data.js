const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function seedCompleteData() {
  console.log('🚀 Starting complete data seed for HealthCare platform...');

  const passwordHash = await bcrypt.hash('Health1234!', 10);
  const doctorHash = await bcrypt.hash('Doctor1234!', 10);

  // -------------------------------------------------------------
  // 1. Users & Profiles (Demo user + Community members + Specialists)
  // -------------------------------------------------------------
  console.log('👤 Seeding Users & Profiles...');

  // Primary Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@healthcare.ai' },
    update: { passwordHash },
    create: {
      email: 'demo@healthcare.ai',
      passwordHash,
      role: 'USER',
      isVerified: true
    }
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {
      firstName: 'Alex',
      lastName: 'Morgan',
      phone: '+1 (555) 234-5678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      gender: 'Non-binary',
      country: 'United States'
    },
    create: {
      userId: demoUser.id,
      firstName: 'Alex',
      lastName: 'Morgan',
      phone: '+1 (555) 234-5678',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      gender: 'Non-binary',
      country: 'United States'
    }
  });

  // Healthcheck / Secondary Demo User
  const healthCheckUser = await prisma.user.upsert({
    where: { email: 'healthcheck@hv.ai' },
    update: { passwordHash },
    create: {
      email: 'healthcheck@hv.ai',
      passwordHash,
      role: 'USER',
      isVerified: true
    }
  });

  await prisma.profile.upsert({
    where: { userId: healthCheckUser.id },
    update: {
      firstName: 'Jordan',
      lastName: 'Lee',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      gender: 'Male',
      country: 'Canada'
    },
    create: {
      userId: healthCheckUser.id,
      firstName: 'Jordan',
      lastName: 'Lee',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      gender: 'Male',
      country: 'Canada'
    }
  });

  // Fix all existing users to have valid profiles
  const allUsers = await prisma.user.findMany({ include: { profile: true } });
  for (const u of allUsers) {
    if (!u.profile) {
      const emailName = u.email.split('@')[0].replace('.', ' ');
      const formatted = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      await prisma.profile.create({
        data: {
          userId: u.id,
          firstName: formatted,
          lastName: '',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          country: 'Global'
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 2. Doctors & Dietitians
  // -------------------------------------------------------------
  console.log('🩺 Seeding Doctors & Dietitians...');

  const medicalStaff = [
    {
      email: 'dr.priya@healthverse.ai',
      firstName: 'Priya',
      lastName: 'Sharma',
      role: 'DOCTOR',
      specialty: 'Cardiologist',
      bio: 'Senior Cardiologist specializing in preventive heart health and cardiovascular longevity.',
      yearsExp: 12,
      fee: 1500,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    },
    {
      email: 'dr.arjun@healthverse.ai',
      firstName: 'Arjun',
      lastName: 'Mehta',
      role: 'DOCTOR',
      specialty: 'Orthopedic Surgeon',
      bio: 'Sports medicine specialist and joint rehabilitation expert.',
      yearsExp: 8,
      fee: 1400,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
    },
    {
      email: 'dr.meera@healthverse.ai',
      firstName: 'Meera',
      lastName: 'Patel',
      role: 'DOCTOR',
      specialty: 'Neurologist',
      bio: 'Clinical neurologist focused on sleep disorders and cognitive performance.',
      yearsExp: 15,
      fee: 1750,
      avatarUrl: 'https://images.unsplash.com/photo-1594824813583-05f31c2cd854?auto=format&fit=crop&q=80&w=300'
    },
    {
      email: 'dr.sarah@healthverse.ai',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: 'DOCTOR',
      specialty: 'Endocrinologist',
      bio: 'Specialist in metabolic health, hormone balance, and diabetes management.',
      yearsExp: 10,
      fee: 1600,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    },
    {
      email: 'dt.kavya@healthverse.ai',
      firstName: 'Kavya',
      lastName: 'Nair',
      role: 'DIETITIAN',
      specialty: 'Clinical Dietitian',
      bio: 'Certified nutritionist specializing in diabetes, gut microbiome, and athletic performance.',
      yearsExp: 7,
      fee: 1000,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
    },
    {
      email: 'dt.marcus@healthverse.ai',
      firstName: 'Marcus',
      lastName: 'Chen',
      role: 'DIETITIAN',
      specialty: 'Sports Nutritionist',
      bio: 'Performance dietitian specializing in plant-based nutrition and hypertrophy meal planning.',
      yearsExp: 6,
      fee: 1100,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    }
  ];

  const seededDoctorsMap = {};

  for (const doc of medicalStaff) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: { role: doc.role },
      create: {
        email: doc.email,
        passwordHash: doctorHash,
        role: doc.role,
        isVerified: true
      }
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        firstName: doc.firstName,
        lastName: doc.lastName,
        avatarUrl: doc.avatarUrl,
        country: 'United States'
      },
      create: {
        userId: user.id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        avatarUrl: doc.avatarUrl,
        country: 'United States'
      }
    });

    if (doc.role === 'DOCTOR') {
      const dp = await prisma.doctorProfile.upsert({
        where: { userId: user.id },
        update: {
          specialization: doc.specialty,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee,
          bio: doc.bio
        },
        create: {
          userId: user.id,
          specialization: doc.specialty,
          licenseNumber: `MED-${Math.floor(Math.random() * 800000 + 100000)}`,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee,
          bio: doc.bio
        }
      });
      seededDoctorsMap[doc.email] = { user, profile: dp };
    } else {
      const dt = await prisma.dietitianProfile.upsert({
        where: { userId: user.id },
        update: {
          certifications: doc.specialty,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee,
          bio: doc.bio
        },
        create: {
          userId: user.id,
          certifications: doc.specialty,
          yearsExperience: doc.yearsExp,
          consultationFee: doc.fee,
          bio: doc.bio
        }
      });
      seededDoctorsMap[doc.email] = { user, profile: dt };
    }
  }

  // -------------------------------------------------------------
  // 3. Health Record & Daily Logs for Demo Users
  // -------------------------------------------------------------
  console.log('📊 Seeding Health Records, Meals, Water, Sleep & Workouts...');

  const allRegularUsers = await prisma.user.findMany({
    where: { role: { notIn: ['DOCTOR', 'DIETITIAN', 'ADMIN'] } }
  });
  const targetUsers = allRegularUsers.length > 0 ? allRegularUsers : [demoUser, healthCheckUser];

  for (const u of targetUsers) {
    // Health Record
    await prisma.healthRecord.upsert({
      where: { userId: u.id },
      update: {
        bloodType: 'O+',
        heightCm: 178,
        weightKg: 71.5,
        allergies: JSON.stringify(['Peanuts', 'Pollen']),
        conditions: JSON.stringify(['None'])
      },
      create: {
        userId: u.id,
        bloodType: 'O+',
        heightCm: 178,
        weightKg: 71.5,
        allergies: JSON.stringify(['Peanuts', 'Pollen']),
        conditions: JSON.stringify(['None'])
      }
    });

    // Delete existing logs for clean fresh demo data
    await prisma.mealLog.deleteMany({ where: { userId: u.id } });
    await prisma.waterLog.deleteMany({ where: { userId: u.id } });
    await prisma.sleepLog.deleteMany({ where: { userId: u.id } });
    await prisma.workoutLog.deleteMany({ where: { userId: u.id } });

    // Seed Meals
    const sampleMeals = [
      { name: 'Avocado Toast & Poached Eggs', calories: 420, proteinG: 18, carbsG: 38, fatG: 22, loggedAt: new Date(Date.now() - 14400000) },
      { name: 'Mediterranean Salmon & Quinoa Bowl', calories: 650, proteinG: 46, carbsG: 52, fatG: 24, loggedAt: new Date(Date.now() - 7200000) },
      { name: 'Greek Yogurt with Blueberries & Chia', calories: 210, proteinG: 17, carbsG: 22, fatG: 5, loggedAt: new Date(Date.now() - 3600000) },
      { name: 'Herb-Roasted Chicken Breast & Asparagus', calories: 530, proteinG: 52, carbsG: 18, fatG: 16, loggedAt: new Date() }
    ];
    for (const m of sampleMeals) {
      await prisma.mealLog.create({ data: { userId: u.id, ...m } });
    }

    // Seed Water Logs (Total: 2,100 ml)
    const sampleWater = [
      { amountMl: 500, loggedAt: new Date(Date.now() - 18000000) },
      { amountMl: 600, loggedAt: new Date(Date.now() - 12000000) },
      { amountMl: 500, loggedAt: new Date(Date.now() - 6000000) },
      { amountMl: 500, loggedAt: new Date() }
    ];
    for (const w of sampleWater) {
      await prisma.waterLog.create({ data: { userId: u.id, ...w } });
    }

    // Seed Sleep Logs
    await prisma.sleepLog.create({
      data: {
        userId: u.id,
        durationMin: 465, // 7 hrs 45 min
        quality: 9,
        loggedAt: new Date(Date.now() - 28800000)
      }
    });

    // Seed Workout Logs
    const sampleWorkouts = [
      { type: 'Morning HIIT & Core Interval', durationMin: 45, caloriesBurned: 380, loggedAt: new Date(Date.now() - 14400000) },
      { type: 'Evening Vinyasa Yoga & Mobility', durationMin: 30, caloriesBurned: 130, loggedAt: new Date(Date.now() - 3600000) }
    ];
    for (const w of sampleWorkouts) {
      await prisma.workoutLog.create({ data: { userId: u.id, ...w } });
    }

    // Seed Appointments
    await prisma.appointment.deleteMany({ where: { patientId: u.id } });
    const drPriya = seededDoctorsMap['dr.priya@healthverse.ai'];
    if (drPriya && drPriya.profile) {
      await prisma.appointment.create({
        data: {
          patientId: u.id,
          doctorId: drPriya.profile.id,
          scheduledAt: new Date(Date.now() + 86400000 * 2), // in 2 days
          status: 'SCHEDULED',
          meetingLink: 'https://meet.healthverse.ai/dr-priya-consult',
          notes: 'Routine cardiovascular wellness checkup and biometric review.'
        }
      });
    }
    const dtKavya = seededDoctorsMap['dt.kavya@healthverse.ai'];
    if (dtKavya && dtKavya.profile) {
      await prisma.appointment.create({
        data: {
          patientId: u.id,
          dietitianId: dtKavya.profile.id,
          scheduledAt: new Date(Date.now() + 86400000 * 5), // in 5 days
          status: 'SCHEDULED',
          meetingLink: 'https://meet.healthverse.ai/dt-kavya-nutrition',
          notes: 'Macronutrient target alignment and anti-inflammatory meal planning.'
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 4. E-Commerce Categories & Products
  // -------------------------------------------------------------
  console.log('🛒 Seeding Store Categories & Expanded Products...');

  const catSubscriptions = await prisma.category.upsert({
    where: { name: 'Subscriptions' },
    update: { description: 'Premium HealthCare & AI Coaching Memberships' },
    create: { name: 'Subscriptions', description: 'Premium HealthCare & AI Coaching Memberships' }
  });

  const catGear = await prisma.category.upsert({
    where: { name: 'Fitness Gear' },
    update: { description: 'Smart ergonomic home gym equipment and recovery tools' },
    create: { name: 'Fitness Gear', description: 'Smart ergonomic home gym equipment and recovery tools' }
  });

  const catSupplements = await prisma.category.upsert({
    where: { name: 'Supplements' },
    update: { description: 'Clean certified vitamins, proteins, and electrolytes' },
    create: { name: 'Supplements', description: 'Clean certified vitamins, proteins, and electrolytes' }
  });

  const catWellness = await prisma.category.upsert({
    where: { name: 'Wellness & Recovery' },
    update: { description: 'Daily sleep, hydration, and relaxation essentials' },
    create: { name: 'Wellness & Recovery', description: 'Daily sleep, hydration, and relaxation essentials' }
  });

  const storeProducts = [
    {
      categoryId: catSubscriptions.id,
      name: "HealthCare Pro - 1 Month",
      description: "Unlock advanced AI health diagnostics, priority doctor bookings, and personalized meal planning for 30 days.",
      price: 19.99,
      stock: 9999,
      imageUrl: "/images/products/pro_monthly.png"
    },
    {
      categoryId: catSubscriptions.id,
      name: "HealthCare Pro - 1 Year",
      description: "Get 2 months free! Full unlimited access to all AI coaching, telemedicine discounts, and analytics.",
      price: 199.99,
      stock: 9999,
      imageUrl: "/images/products/pro_yearly.png"
    },
    {
      categoryId: catGear.id,
      name: "Smart Yoga Mat",
      description: "Self-rolling, anti-slip yoga mat with tactile alignment grid indicators for proper posture.",
      price: 89.99,
      stock: 45,
      imageUrl: "/images/products/yoga_mat.png"
    },
    {
      categoryId: catGear.id,
      name: "Adjustable Dumbbells",
      description: "Rapid weight adjustment from 5 to 52.5 lbs per dumbbell. Compact and durable.",
      price: 299.99,
      stock: 20,
      imageUrl: "/images/products/dumbbells.png"
    },
    {
      categoryId: catSupplements.id,
      name: "Premium Whey Protein",
      description: "100% grass-fed whey isolate with 28g pure protein and 5.5g BCAAs per serving. Rich Chocolate flavor.",
      price: 45.00,
      stock: 120,
      imageUrl: "/images/products/protein.png"
    }
  ];

  const seededProducts = [];
  for (const p of storeProducts) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      const updated = await prisma.product.update({
        where: { id: existing.id },
        data: p
      });
      seededProducts.push(updated);
    } else {
      const created = await prisma.product.create({ data: p });
      seededProducts.push(created);
    }
  }

  // Remove any obsolete products that don't match our 5 curated items
  const allowedProductNames = storeProducts.map(p => p.name);
  await prisma.product.deleteMany({
    where: { name: { notIn: allowedProductNames } }
  });

  // Create sample orders for all target users
  for (const u of targetUsers) {
    const existingOrders = await prisma.order.findMany({ where: { userId: u.id } });
    if (existingOrders.length === 0 && seededProducts.length > 0) {
      await prisma.order.create({
        data: {
          userId: u.id,
          totalAmount: 19.99,
          status: 'PAID',
          items: {
            create: [
              {
                productId: seededProducts[0].id,
                quantity: 1,
                priceAtBuy: seededProducts[0].price
              }
            ]
          },
          payment: {
            create: {
              method: 'STRIPE',
              status: 'COMPLETED',
              transactionId: `txn_${Date.now()}_${u.id.slice(0, 4)}`
            }
          }
        }
      });

      if (seededProducts.length > 2) {
        await prisma.order.create({
          data: {
            userId: u.id,
            totalAmount: 89.99,
            status: 'SHIPPED',
            items: {
              create: [
                {
                  productId: seededProducts[2].id, // Smart Yoga Mat
                  quantity: 1,
                  priceAtBuy: seededProducts[2].price
                }
              ]
            },
            payment: {
              create: {
                method: 'STRIPE',
                status: 'COMPLETED',
                transactionId: `txn_${Date.now() + 10}_${u.id.slice(0, 4)}`
              }
            }
          }
        });
      }
    }
  }
  console.log('✅ Seeded store orders for users');

  // -------------------------------------------------------------
  // 5. Challenges, Badges & Rewards
  // -------------------------------------------------------------
  console.log('🏆 Seeding Challenges, Badges & Rewards...');

  const challengesData = [
    {
      title: "Hydration Master",
      description: "Drink 2.5L of clean water for 5 consecutive days.",
      xpReward: 300,
      startDate: new Date(),
      endDate: new Date(Date.now() + 864000000)
    },
    {
      title: "7-Day Step Streak",
      description: "Walk at least 10,000 steps every day for 7 consecutive days.",
      xpReward: 500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 864000000)
    },
    {
      title: "Mindful Sleeper",
      description: "Log 7.5+ hours of restorative sleep for 5 days.",
      xpReward: 250,
      startDate: new Date(),
      endDate: new Date(Date.now() + 864000000)
    },
    {
      title: "Clean Fuel Challenge",
      description: "Hit your daily protein goal while staying within calorie limits for 5 days.",
      xpReward: 400,
      startDate: new Date(),
      endDate: new Date(Date.now() + 864000000)
    },
    {
      title: "Weekend HIIT Blast",
      description: "Complete 2 high-intensity training sessions this weekend.",
      xpReward: 350,
      startDate: new Date(),
      endDate: new Date(Date.now() + 864000000)
    }
  ];

  const seededChallenges = [];
  for (const c of challengesData) {
    const existing = await prisma.challenge.findFirst({ where: { title: c.title } });
    if (!existing) {
      const created = await prisma.challenge.create({ data: c });
      seededChallenges.push(created);
    } else {
      seededChallenges.push(existing);
    }
  }

  // Connect challenges to all target users
  for (const u of targetUsers) {
    for (let i = 0; i < seededChallenges.length; i++) {
      const ch = seededChallenges[i];
      await prisma.userChallenge.upsert({
        where: {
          userId_challengeId: {
            userId: u.id,
            challengeId: ch.id
          }
        },
        update: { progress: (i + 2) % 6 },
        create: {
          userId: u.id,
          challengeId: ch.id,
          progress: (i + 2) % 6,
          completed: false
        }
      });
    }
  }

  // Badges
  const badgesData = [
    { name: "Early Bird", description: "Logged a workout before 7:00 AM", iconUrl: "Sparkles" },
    { name: "Hydration Hero", description: "Reached daily hydration goal 7 days in a row", iconUrl: "Droplet" },
    { name: "Century Club", description: "Logged over 100 fitness activities", iconUrl: "Trophy" },
    { name: "Clean Eater", description: "Maintained a 14-day healthy nutrition streak", iconUrl: "Apple" },
    { name: "Zen Master", description: "Completed 10 restorative sleep & yoga sessions", iconUrl: "Moon" }
  ];

  for (const b of badgesData) {
    const existing = await prisma.badge.findFirst({ where: { name: b.name } });
    let badgeRecord = existing;
    if (!existing) {
      badgeRecord = await prisma.badge.create({ data: b });
    }
    // Award badges to all target users
    if (badgeRecord) {
      for (const u of targetUsers) {
        await prisma.userBadge.upsert({
          where: {
            userId_badgeId: {
              userId: u.id,
              badgeId: badgeRecord.id
            }
          },
          update: {},
          create: {
            userId: u.id,
            badgeId: badgeRecord.id,
            awardedAt: new Date(Date.now() - 86400000 * 3)
          }
        }).catch(() => {});
      }
    }
  }

  // Rewards (for Gamification coin redemption)
  const rewardsData = [
    { name: "1-Month HealthCare Pro Access", description: "Free 30-day premium membership with unlimited AI coach queries.", costCoins: 500 },
    { name: "1-on-1 Dietitian Consultation Voucher", description: "30-minute virtual nutrition session with a registered dietitian.", costCoins: 1200 },
    { name: "25% Off Store Discount Coupon", description: "Applies to any purchase in the HealthCare store.", costCoins: 350 },
    { name: "HealthCare Stainless Steel Shaker", description: "Double-insulated 700ml leak-proof stainless steel bottle.", costCoins: 750 },
    { name: "Resistance Bands 5-Pack", description: "Heavy-duty workout bands for home and travel fitness.", costCoins: 600 }
  ];

  for (const r of rewardsData) {
    const existing = await prisma.reward.findFirst({ where: { name: r.name } });
    if (!existing) {
      await prisma.reward.create({ data: r });
    }
  }

  // -------------------------------------------------------------
  // 6. Community Posts, Comments & Social Interactions
  // -------------------------------------------------------------
  console.log('💬 Seeding Community Social Feed, Comments & Likes...');

  // Clean old posts to establish a cohesive, realistic feed
  await prisma.post.deleteMany({});

  const drPriyaUser = seededDoctorsMap['dr.priya@healthverse.ai']?.user || demoUser;
  const dtKavyaUser = seededDoctorsMap['dt.kavya@healthverse.ai']?.user || demoUser;
  const dtMarcusUser = seededDoctorsMap['dt.marcus@healthverse.ai']?.user || demoUser;

  const samplePosts = [
    {
      userId: drPriyaUser.id,
      content: "🩺 Heart Health Insight: Did you know that just 30 minutes of brisk walking 5 times a week can reduce resting blood pressure by 5-8 mmHg? Small daily habits compound into massive cardiovascular longevity! ❤️",
      createdAt: new Date(Date.now() - 3600000 * 2),
      comments: [
        { userId: healthCheckUser.id, content: "Thank you Dr. Priya! Started my morning walk today." },
        { userId: demoUser.id, content: "Hit my step goal today! Feeling noticeably more energetic." }
      ]
    },
    {
      userId: dtKavyaUser.id,
      content: "🥗 Meal Prep Sunday: Quinoa bowls with roasted spiced chickpeas, steamed broccoli, avocado slices, and lemon-tahini dressing! Total prep time: 35 minutes. Healthy eating can be simple and delicious! 🥑",
      createdAt: new Date(Date.now() - 3600000 * 5),
      comments: [
        { userId: demoUser.id, content: "Saving this recipe! What is the protein breakdown per bowl?" },
        { userId: dtKavyaUser.id, content: "About 22 grams of clean plant-based protein per bowl! 🌱" }
      ]
    },
    {
      userId: demoUser.id,
      content: "🔥 Just completed Day 5 of the Hydration Master challenge! 2.5 Liters every single day. The mental clarity and skin improvements are real. Stay hydrated everyone! 💧🏃",
      createdAt: new Date(Date.now() - 3600000 * 8),
      comments: [
        { userId: dtMarcusUser.id, content: "Amazing consistency Alex! Hydration is the single easiest performance boost." }
      ]
    },
    {
      userId: dtMarcusUser.id,
      content: "🏃‍♂️ Finished a 10K morning trail run in 49 minutes! Beautiful sunrise and fresh crisp air. Remember: recovery is just as important as the workout—don't skip post-run stretching and protein! ⛰️💪",
      createdAt: new Date(Date.now() - 3600000 * 16),
      comments: [
        { userId: drPriyaUser.id, content: "Fantastic pace Marcus! Keep listening to your body." }
      ]
    }
  ];

  for (const postData of samplePosts) {
    const post = await prisma.post.create({
      data: {
        userId: postData.userId,
        content: postData.content,
        createdAt: postData.createdAt
      }
    });

    // Add comments
    for (const commentData of postData.comments) {
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: commentData.userId,
          content: commentData.content
        }
      });
    }

    // Add likes
    await prisma.like.create({
      data: {
        postId: post.id,
        userId: demoUser.id
      }
    }).catch(() => {});

    await prisma.like.create({
      data: {
        postId: post.id,
        userId: healthCheckUser.id
      }
    }).catch(() => {});
  }

  console.log('\n✨ COMPLETE DATA SEED FINISHED SUCCESSFULLY! ✨');
}

seedCompleteData()
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

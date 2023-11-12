import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("PFsTP4Aa5pkxcq3", 10);
  // create one of each data type
  await prisma.user.create({
    data: {
      email: "zacharysp@gmail.com",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const res = await prisma.featureProduct.create({
    data: {
      title: "Feature Product",
      description: "This is a feature product",
      price: 100,
      count: 10,
      features: JSON.stringify([]),
      order: 0,
    },
  });

  await prisma.media.create({
    data: {
      url: "https://picsum.photos/seed/1/200/300",
      primary: true,
      featureProduct: {
        connect: {
          id: res.id,
        },
      },
    },
  });

  const cat = await prisma.category.create({
    data: {
      title: "Category",
      order: 1,
    },
  });

  await prisma.categoryProduct.create({
    data: {
      title: "Category Product",
      description: "This is a category product",
      price: 100,
      count: 10,
      order: 0,
      category: {
        connect: {
          id: cat.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

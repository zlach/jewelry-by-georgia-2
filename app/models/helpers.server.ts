import { prisma } from "~/db.server";

export const shiftAll = async () => {
  const featureProducts = await prisma.featureProduct.findMany({});

  const categories = await prisma.category.findMany({});

  for (const featureProduct of featureProducts) {
    await prisma.featureProduct.update({
      where: {
        id: featureProduct.id,
      },
      data: {
        order: featureProduct.order + 1,
      },
    });
  }

  for (const category of categories) {
    await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        order: category.order + 1,
      },
    });
  }
};

export const shiftCategoryProducts = async (categoryId: string) => {
  const categoryProducts = await prisma.categoryProduct.findMany({
    where: { categoryId },
  });

  for (const categoryProduct of categoryProducts) {
    await prisma.categoryProduct.update({
      where: {
        id: categoryProduct.id,
      },
      data: {
        order: categoryProduct.order + 1,
      },
    });
  }
};

import type { Category, CategoryProduct } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createCategory({ title }: Pick<Category, "title">) {
  const res = await prisma.category.create({
    data: {
      title,
      order: 0,
    },
  });

  return res;
}

export async function updateCategory({
  id,
  title,
}: Pick<Category, "id" | "title">) {
  const res = await prisma.category.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });

  return res;
}

export async function createCategoryProduct({
  title,
  description,
  price,
  media,
  count,
  categoryId,
}: Pick<
  CategoryProduct,
  "title" | "description" | "price" | "categoryId" | "count"
> & {
  media: string[];
}) {
  const res = await prisma.categoryProduct.create({
    data: {
      title,
      description,
      price,
      count,
      order: 0,
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });

  for (let i = 0; i < media.length; i++) {
    await prisma.media.create({
      data: {
        url: media[i],
        primary: i === 0,
        categoryProduct: {
          connect: {
            id: res.id,
          },
        },
      },
    });
  }
}

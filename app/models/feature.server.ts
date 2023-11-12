import type { FeatureProduct } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createFeatureProduct({
  title,
  description,
  price,
  media,
  count,
  features,
}: Pick<
  FeatureProduct,
  "title" | "description" | "price" | "count" | "features"
> & {
  media: string[];
}) {
  const res = await prisma.featureProduct.create({
    data: {
      title,
      description,
      price,
      count,
      features,
      order: 0,
    },
  });

  for (let i = 0; i < media.length; i++) {
    await prisma.media.create({
      data: {
        url: media[i],
        primary: i === 0,
        featureProduct: {
          connect: {
            id: res.id,
          },
        },
      },
    });
  }
}

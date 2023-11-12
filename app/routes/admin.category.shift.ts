import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    await requireUserId(request);

    const formData = await request.formData();
    const id = formData.get("id") as string | null;
    const direction = formData.get("direction") as string | null;

    if (!id) return json({ success: false }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (category === null) return json({ success: false }, { status: 404 });

    const categories = await prisma.category.findMany({});
    const featureProducts = await prisma.featureProduct.findMany({});

    const currentOrder = category.order;

    if (direction === "up") {
      const previousCategory = categories.find(
        (c) => c.order === currentOrder - 1,
      );
      const previousFeatureProduct = featureProducts.find(
        (f) => f.order === currentOrder - 1,
      );

      const previous = previousCategory || previousFeatureProduct;

      if (!previous) return json({ success: false }, { status: 400 });

      await prisma.category.update({
        where: { id },
        data: { order: currentOrder - 1 },
      });

      if (previousCategory) {
        await prisma.category.update({
          where: { id: previous.id },
          data: { order: currentOrder },
        });
      } else {
        await prisma.featureProduct.update({
          where: { id: previous.id },
          data: { order: currentOrder },
        });
      }
    } else if (direction === "down") {
      const nextCategory = categories.find((c) => c.order === currentOrder + 1);
      const nextFeatureProduct = featureProducts.find(
        (f) => f.order === currentOrder + 1,
      );

      const next = nextCategory || nextFeatureProduct;

      if (!next) return json({ success: false }, { status: 400 });

      await prisma.category.update({
        where: { id },
        data: { order: currentOrder + 1 },
      });

      if (nextCategory) {
        await prisma.category.update({
          where: { id: next.id },
          data: { order: currentOrder },
        });
      } else {
        await prisma.featureProduct.update({
          where: { id: next.id },
          data: { order: currentOrder },
        });
      }
    } else {
      return json({ success: false }, { status: 400 });
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ success: false }, { status: 500 });
  }
};

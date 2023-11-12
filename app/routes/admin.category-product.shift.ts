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

    const categoryProduct = await prisma.categoryProduct.findUnique({
      where: { id },
    });

    if (categoryProduct === null)
      return json({ success: false }, { status: 404 });

    const categoryProducts = await prisma.categoryProduct.findMany({});

    const currentOrder = categoryProduct.order;

    if (direction === "left") {
      const previous = categoryProducts.find(
        (c) => c.order === currentOrder - 1,
      );

      if (!previous) return json({ success: false }, { status: 400 });

      await prisma.categoryProduct.update({
        where: { id },
        data: { order: currentOrder - 1 },
      });

      await prisma.categoryProduct.update({
        where: { id: previous.id },
        data: { order: currentOrder },
      });
    } else if (direction === "right") {
      const next = categoryProducts.find((c) => c.order === currentOrder + 1);

      if (!next) return json({ success: false }, { status: 400 });

      await prisma.categoryProduct.update({
        where: { id },
        data: { order: currentOrder + 1 },
      });

      await prisma.categoryProduct.update({
        where: { id: next.id },
        data: { order: currentOrder },
      });
    } else {
      return json({ success: false }, { status: 400 });
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ success: false }, { status: 500 });
  }
};

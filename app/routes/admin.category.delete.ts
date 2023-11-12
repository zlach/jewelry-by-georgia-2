import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    await requireUserId(request);

    const formData = await request.formData();
    const id = formData.get("id") as string | null;

    if (!id) return json({ success: false }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (category === null) return json({ success: false }, { status: 404 });

    const categoryProducts = await prisma.categoryProduct.findMany({
      where: { categoryId: category.id },
    });

    if (categoryProducts.length > 0) {
      return json({ success: false }, { status: 400 });
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    const featureProducts = await prisma.featureProduct.findMany({});
    const categories = await prisma.category.findMany({});

    for (const fP of featureProducts) {
      if (fP.order > category.order) {
        await prisma.featureProduct.update({
          where: {
            id: fP.id,
          },
          data: {
            order: fP.order - 1,
          },
        });
      }
    }

    for (const c of categories) {
      if (c.order > category.order) {
        await prisma.category.update({
          where: {
            id: c.id,
          },
          data: {
            order: c.order - 1,
          },
        });
      }
    }

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ success: false }, { status: 500 });
  }
};

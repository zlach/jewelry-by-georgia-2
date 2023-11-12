import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    await requireUserId(request);

    const formData = await request.formData();
    const id = formData.get("id") as string | null;

    if (!id) return json({ success: false }, { status: 404 });

    const categoryProduct = await prisma.categoryProduct.findUnique({
      where: { id },
    });

    if (categoryProduct === null)
      return json({ success: false }, { status: 404 });

    await prisma.categoryProduct.delete({
      where: {
        id,
      },
    });

    const categoryProducts = await prisma.categoryProduct.findMany({
      where: { categoryId: categoryProduct.categoryId },
    });

    for (const cP of categoryProducts) {
      if (cP.order > categoryProduct.order) {
        await prisma.categoryProduct.update({
          where: {
            id: cP.id,
          },
          data: {
            order: cP.order - 1,
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

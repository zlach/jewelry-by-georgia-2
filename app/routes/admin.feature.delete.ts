import { type LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: LoaderFunctionArgs) => {
  try {
    await requireUserId(request);

    const formData = await request.formData();
    const id = formData.get("id") as string | null;

    if (!id) return json({ success: false }, { status: 404 });

    const featureProduct = await prisma.featureProduct.findUnique({
      where: { id },
    });

    if (featureProduct === null)
      return json({ success: false }, { status: 404 });

    await prisma.featureProduct.delete({
      where: {
        id,
      },
    });

    const featureProducts = await prisma.featureProduct.findMany({});
    const categories = await prisma.category.findMany({});

    for (const fP of featureProducts) {
      if (fP.order > featureProduct.order) {
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

    for (const category of categories) {
      if (category.order > featureProduct.order) {
        await prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            order: category.order - 1,
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

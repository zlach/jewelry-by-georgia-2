import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";

import { updateCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(300, { message: "300 character max" }),
});

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserId(request);

  try {
    const formData = await request.formData();
    const title = formData.get("title");

    const categoryId = params.categoryId as string;

    const result = schema.safeParse({ title });

    if (!result.success) {
      return json({ success: false }, { status: 400 });
    }

    await updateCategory({
      title: result.data.title,
      id: categoryId,
    });

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ success: false }, { status: 500 });
  }
};

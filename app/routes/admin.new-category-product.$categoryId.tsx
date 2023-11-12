import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { z } from "zod";

import { createCategoryProduct } from "~/models/category.server";
import { shiftCategoryProducts } from "~/models/helpers.server";
import { requireUserId } from "~/session.server";
import { uploadImage } from "~/upload.server";

const maxFileSize = 5_000_000;

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(300, { message: "300 character max" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(10000, { message: "1000 character max" }),
  price: z.coerce.number().min(1),
  count: z.coerce.number().min(1),
  categoryId: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  try {
    const totalSize = request.headers.get("content-length");

    if (!totalSize || parseInt(totalSize, 10) > 24 * maxFileSize) {
      return json({ success: false }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    const allURLs: string[] = [];
    const uploadHandler = composeUploadHandlers(
      async ({ name, data, filename }) => {
        try {
          if (name !== "files" || !filename) return undefined;

          const newUrl = await uploadImage(filename, data, timestamp);
          allURLs.push(newUrl);

          return newUrl;
        } catch (error) {
          return undefined;
        }
      },
      createMemoryUploadHandler(),
    );

    const formData = await parseMultipartFormData(request, uploadHandler);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { files, ...data } = Object.fromEntries(formData.entries());

    const result = schema.safeParse(data);

    if (!result.success) {
      return json({ success: false }, { status: 400 });
    }

    await shiftCategoryProducts(result.data.categoryId);

    await createCategoryProduct({
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      media: allURLs,
      categoryId: result.data.categoryId,
      count: result.data.count,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ success: false }, { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  return json({});
};

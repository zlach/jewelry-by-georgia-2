import type {
  Category as CategoryType,
  CategoryProduct,
  FeatureProduct as FeatureProductType,
  Media,
} from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";

import { Category } from "~/components/admin/Category";
import { FeatureProduct } from "~/components/admin/FeatureProduct";
import Container from "~/components/Container";
import CategoryForm from "~/components/forms/CategoryForm";
import FeatureProductForm from "~/components/forms/FeatureProductForm";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const featureProducts = await prisma.featureProduct.findMany({
    include: {
      media: true,
    },
  });

  const categories = await prisma.category.findMany({
    include: {
      categoryProducts: {
        include: {
          media: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  const data = [...featureProducts, ...categories];

  return json({
    data: data.sort((a, b) =>
      a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
    ),
  });
};

interface AdminLoaderData {
  data: (
    | (FeatureProductType & { media: Media[] })
    | (CategoryType & {
        categoryProducts: (CategoryProduct & { media: Media[] })[];
      })
  )[];
}

export default function Admin() {
  const { data } = useLoaderData<AdminLoaderData>();
  const [featureProductForm, setFeatureProductForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(false);

  return (
    <main className="relative min-h-screen bg-white">
      <Container>
        <div className="flex h-20 w-full items-center justify-around bg-purple-100">
          <div>Admin Page</div>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </div>
        <button
          type="button"
          onClick={() => setFeatureProductForm((prev) => !prev)}
          className="my-2 mr-4 rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          New Feature Product
        </button>
        <button
          type="button"
          onClick={() => setCategoryForm((prev) => !prev)}
          className="my-2 rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          New Category
        </button>
        {featureProductForm ? (
          <FeatureProductForm
            handleClose={() => setFeatureProductForm(false)}
          />
        ) : null}
        {categoryForm ? (
          <CategoryForm handleClose={() => setCategoryForm(false)} />
        ) : null}
      </Container>

      {data.map(
        // @ts-expect-error remix is a mess
        (
          item:
            | (FeatureProductType & { media: Media[] })
            | (CategoryType & {
                categoryProducts: (CategoryProduct & { media: Media[] })[];
              }),
        ) => {
          if ("categoryProducts" in item) {
            return (
              <Category
                key={item.id}
                category={item}
                totalCount={data.length}
              />
            );
          }
          return (
            <FeatureProduct
              key={item.id}
              featureProduct={item}
              totalCount={data.length}
            />
          );
        },
      )}
    </main>
  );
}

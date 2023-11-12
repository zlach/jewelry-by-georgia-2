import type {
  Category as CategoryType,
  CategoryProduct as CategoryProductType,
  Media,
} from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

import Container from "../Container";
import CategoryForm from "../forms/CategoryForm";
import CategoryProductForm from "../forms/CategoryProductForm";

import { CategoryProduct } from "./CategoryProduct";

export const Category = ({
  category,
  totalCount,
}: {
  category: CategoryType & {
    categoryProducts: (CategoryProductType & { media: Media[] })[];
  };
  totalCount: number;
}) => {
  const deleteFetcher = useFetcher();
  const shiftFetcher = useFetcher();
  const [categoryForm, setCategoryForm] = useState(false);

  return (
    <div className="w-full bg-gray-100">
      <Container>
        <div className="flex gap-2">
          <shiftFetcher.Form
            method="put"
            action="/admin/category/shift"
            className={category.order > 0 ? "block" : "hidden"}
          >
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              className="h-fit cursor-pointer rounded-xl bg-gray-100 p-1 hover:bg-gray-300"
            >
              ▲
            </button>
          </shiftFetcher.Form>
          <shiftFetcher.Form
            method="put"
            action="/admin/category/shift"
            className={category.order === totalCount - 1 ? "hidden" : "block"}
          >
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              className="h-fit rotate-180 cursor-pointer rounded-xl bg-gray-100 p-1 hover:bg-gray-300"
            >
              ▲
            </button>
          </shiftFetcher.Form>
        </div>
        <div className="flex w-full items-center gap-4">
          <div>Category Name: </div>
          <div className="text-xl font-semibold">{category.title}</div>
          <button
            type="button"
            onClick={() => setCategoryForm((prev) => !prev)}
            className="my-2 rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Edit Category Name
          </button>
          {category.categoryProducts?.length === 0 ? (
            <deleteFetcher.Form method="delete" action="/admin/category/delete">
              <input type="hidden" name="id" value={category.id} />
              <button
                type="submit"
                className="h-fit cursor-pointer rounded-xl bg-white p-4 hover:shadow-md"
              >
                Remove
              </button>
            </deleteFetcher.Form>
          ) : null}
        </div>
        {categoryForm ? (
          <CategoryForm
            handleClose={() => setCategoryForm(false)}
            categoryId={category.id}
          />
        ) : null}
      </Container>
      <div className="hide-scrollbar flex snap-x snap-mandatory scroll-ps-6 gap-x-6 overflow-x-scroll px-3 py-6 md:px-20 xl:px-[calc(50vw-640px)]">
        <CategoryProductForm
          categoryId={category.id}
          className="min-h-[520px] min-w-[320px] max-w-[320px] snap-start scroll-ml-3 md:scroll-ml-20 xl:scroll-ml-[calc(50vw-640px)]"
        />
        {category?.categoryProducts.map(
          (categoryProduct: CategoryProductType & { media: Media[] }) => (
            <CategoryProduct
              key={categoryProduct?.id?.toString()}
              categoryProduct={categoryProduct}
              className="min-h-[520px] min-w-[320px] max-w-[320px] snap-start"
              totalCount={category.categoryProducts.length}
            />
          ),
        )}
      </div>
    </div>
  );
};

import type {
  Media,
  CategoryProduct as CategoryProductType,
} from "@prisma/client";
import { useFetcher } from "@remix-run/react";

export const CategoryProduct = ({
  categoryProduct,
  className,
  totalCount,
}: {
  categoryProduct: CategoryProductType & { media: Media[] };
  className?: string;
  totalCount: number;
}) => {
  const deleteFetcher = useFetcher();
  const shiftFetcher = useFetcher();

  return (
    <div className={className}>
      <shiftFetcher.Form
        method="put"
        action="/admin/category-product/shift"
        className={categoryProduct.order > 0 ? "block" : "hidden"}
      >
        <input type="hidden" name="id" value={categoryProduct.id} />
        <input type="hidden" name="direction" value="left" />
        <button
          type="submit"
          className="h-fit -rotate-90 cursor-pointer rounded-xl bg-gray-100 p-1 hover:bg-gray-300"
        >
          ▲
        </button>
      </shiftFetcher.Form>
      <shiftFetcher.Form
        method="put"
        action="/admin/category-product/shift"
        className={
          categoryProduct.order === totalCount - 1 ? "hidden" : "block"
        }
      >
        <input type="hidden" name="id" value={categoryProduct.id} />
        <input type="hidden" name="direction" value="right" />
        <button
          type="submit"
          className="h-fit rotate-90 cursor-pointer rounded-xl bg-gray-100 p-1 hover:bg-gray-300"
        >
          ▲
        </button>
      </shiftFetcher.Form>
      <img
        src={categoryProduct.media?.[0]?.url}
        alt={categoryProduct.title}
        className="h-36 w-36 rounded-md object-contain object-center"
      />

      <div className="flex w-full flex-col gap-y-2">
        <div className="text-xl font-semibold">{categoryProduct.title}</div>
        <div className="text-lg">{categoryProduct.description}</div>
        <div className="text-lg">{categoryProduct.price}</div>
      </div>

      <deleteFetcher.Form
        method="delete"
        action="/admin/category-product/delete"
      >
        <input type="hidden" name="id" value={categoryProduct.id} />
        <button
          type="submit"
          className="h-fit cursor-pointer rounded-xl bg-white p-4 hover:shadow-md"
        >
          Remove
        </button>
      </deleteFetcher.Form>
    </div>
  );
};

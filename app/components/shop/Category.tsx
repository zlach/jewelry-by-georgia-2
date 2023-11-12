import type {
  Category as CategoryType,
  CategoryProduct as CategoryProductType,
  Media,
} from "@prisma/client";

import Container from "../Container";

import { CategoryProduct } from "./CategoryProduct";

export const Category = ({
  category,
  cart,
  handleAddToCart,
  handleRemoveFromCart,
}: {
  category: CategoryType & {
    categoryProducts: (CategoryProductType & { media: Media[] })[];
  };
  cart: string[];
  handleAddToCart: (id: string) => void;
  handleRemoveFromCart: (id: string) => void;
}) => {
  return (
    <div className="pt-10">
      <Container>
        <div className="px-3 md:px-0">
          <h2 className="text-xl font-semibold">{category.title}</h2>
        </div>
      </Container>
      <div className="hide-scrollbar flex snap-x snap-mandatory scroll-ps-6 gap-x-6 overflow-x-scroll px-3 pb-10 pt-4 md:px-20 xl:px-[calc(50vw-640px)]">
        {category.categoryProducts?.map(
          (
            categoryProduct: CategoryProductType & { media: Media[] },
            i: number,
          ) => (
            <CategoryProduct
              key={categoryProduct.id}
              cart={cart}
              handleAddToCart={handleAddToCart}
              handleRemoveFromCart={handleRemoveFromCart}
              categoryProduct={categoryProduct}
              className={`min-w-[300px] snap-start ${
                i === 0
                  ? "scroll-ml-3 md:scroll-ml-20 xl:scroll-ml-[calc(50vw-640px)]"
                  : ""
              }`}
            />
          ),
        )}
      </div>
    </div>
  );
};

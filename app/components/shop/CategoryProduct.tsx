import type {
  Media,
  CategoryProduct as CategoryProductType,
} from "@prisma/client";
import { useNavigate } from "@remix-run/react";

export const CategoryProduct = ({
  categoryProduct,
  className,
  cart,
  handleAddToCart,
  handleRemoveFromCart,
}: {
  categoryProduct: CategoryProductType & { media: Media[] };
  className?: string;
  cart: string[];
  handleAddToCart: (id: string) => void;
  handleRemoveFromCart: (id: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className={`rounded-md ${className} flex flex-col`}>
      <img
        src={categoryProduct.media[0]?.url}
        alt={categoryProduct.title}
        style={{
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        }}
        className="mx-auto block h-[300px] w-[300px] rounded-md bg-black object-cover object-center"
      />
      <h2 className="block text-lg font-semibold">{categoryProduct.title}</h2>
      <p className="block">{categoryProduct.description}</p>
      <p className="block">${categoryProduct.price}</p>
      <div className="mt-auto flex justify-between justify-self-end pt-4">
        {!cart || !cart.length || !cart.includes(categoryProduct.id) ? (
          <button
            type="button"
            onClick={() => handleAddToCart(categoryProduct.id)}
            className="group font-medium"
            name="productId"
          >
            + <span className="group-hover:underline">Add to Cart</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleRemoveFromCart(categoryProduct.id)}
            className="group font-medium text-green-600"
            name="productId"
          >
            ✓ <span className="group-hover:underline">Added to Cart</span>
          </button>
        )}

        <button
          type="button"
          className="flex items-center gap-2 p-2 font-medium hover:underline"
          onClick={() =>
            navigate(`/gallery/${categoryProduct.id}`, {
              state: { internal: true },
              preventScrollReset: true,
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-image"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
          </svg>
          <span>View Photos</span>
        </button>
      </div>
    </div>
  );
};

import type { CategoryProduct, FeatureProduct, Media } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export const CartItems = ({
  items,
  paymentIntentId,
}: {
  items: (
    | (FeatureProduct & { media: Media[] })
    | (CategoryProduct & { media: Media[] })
  )[];
  paymentIntentId: string;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const cart = items.map(
        (
          item:
            | (FeatureProduct & { media: Media[] })
            | (CategoryProduct & { media: Media[] }),
        ) => item.id,
      );

      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.log(error);
    }
  }, [items]);

  const handleRemove = async (id: string) => {
    try {
      const c = localStorage.getItem("cart");

      if (!c) {
        return;
      }

      const parsedCart = JSON.parse(c);

      const filteredCart = parsedCart.filter((i: string) => i !== id);

      const queryString = filteredCart
        .map((id: string) => `id=${id}`)
        .join("&");

      if (!filteredCart.length) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(parsedCart));
      }

      navigate(`/cart?paymentIntentId=${paymentIntentId}&${queryString}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-bag"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
        </svg>
        <h2 className="text-lg font-semibold">Cart</h2>
      </div>
      {items.map(
        (
          item:
            | (FeatureProduct & { media: Media[] })
            | (CategoryProduct & { media: Media[] }),
          i: number,
        ) => (
          <div key={i} className="inline-flex items-center gap-4 p-4">
            <img
              className="h-40 w-40 object-cover object-center"
              src={item.media[0]?.url}
              alt={item.title}
            />
            <div className="max-w-[100px] break-words">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p>${item.price}</p>
              <button
                type="button"
                className="group font-medium"
                onClick={() => handleRemove(item.id)}
              >
                − <span className="group-hover:underline">Remove</span>
              </button>
            </div>
          </div>
        ),
      )}
    </>
  );
};

import type {
  Media,
  FeatureProduct as FeatureProductType,
} from "@prisma/client";
import { useNavigate } from "@remix-run/react";

export const FeatureProduct = ({
  featureProduct,
  reverse,
  cart,
  handleAddToCart,
  handleRemoveFromCart,
}: {
  featureProduct: FeatureProductType & { media: Media[] };
  reverse?: boolean;
  cart: string[];
  handleAddToCart: (id: string) => void;
  handleRemoveFromCart: (id: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-10 ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <img
        src={featureProduct.media[0]?.url}
        alt={featureProduct.title}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
        className="h-72 w-72 rounded-md bg-black object-cover object-center lg:h-96 lg:w-96"
      />
      <div className="w-72 lg:w-96">
        <h2 className="text-lg font-semibold">{featureProduct.title}</h2>
        <p className="italic">{featureProduct.description}</p>
        {featureProduct.features && (
          <ul className="list-disc py-4 pl-8">
            {JSON.parse(featureProduct.features).map(
              (feature: string, i: number) => (
                <li key={i}>{feature}</li>
              )
            )}
          </ul>
        )}
        <p>${featureProduct.price}</p>
        <div className="flex justify-between pt-4">
          {!cart || !cart.length || !cart.includes(featureProduct.id) ? (
            <button
              type="button"
              onClick={() => handleAddToCart(featureProduct.id)}
              className="group font-medium"
              name="productId"
            >
              + <span className="group-hover:underline">Add to Cart</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleRemoveFromCart(featureProduct.id)}
              className="group font-medium text-green-600"
              name="productId"
            >
              ✓ <span className="group-hover:underline">Added to Cart!</span>
            </button>
          )}{" "}
          <button
            type="button"
            className="flex items-center gap-2 p-2 font-medium hover:underline"
            onClick={() =>
              navigate(`/gallery/${featureProduct.id}`, {
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
    </div>
  );
};

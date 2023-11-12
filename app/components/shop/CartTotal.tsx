import type { CategoryProduct, FeatureProduct, Media } from "@prisma/client";

export const CartTotal = ({
  items,
}: {
  items: (
    | (FeatureProduct & { media: Media[] })
    | (CategoryProduct & { media: Media[] })
  )[];
}) => {
  return (
    <div className="flex justify-between">
      <h2 className="text-lg font-semibold">Total</h2>
      <mark>
        <h2 className="text-2xl font-semibold">
          $
          {items.reduce(
            (
              accumulator: number,
              currentValue:
                | (FeatureProduct & { media: Media[] })
                | (CategoryProduct & { media: Media[] }),
            ) => accumulator + currentValue.price,
            0,
          )}
        </h2>
      </mark>
    </div>
  );
};

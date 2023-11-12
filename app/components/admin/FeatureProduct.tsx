import type {
  Media,
  FeatureProduct as FeatureProductType,
} from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import Container from "../Container";

export const FeatureProduct = ({
  featureProduct,
  totalCount,
}: {
  featureProduct: FeatureProductType & { media: Media[] };
  totalCount: number;
}) => {
  const deleteFetcher = useFetcher();
  const shiftFetcher = useFetcher();

  return (
    <Container>
      <div className="group my-4">
        <div className="flex gap-2">
          <shiftFetcher.Form
            method="put"
            action="/admin/feature/shift"
            className={featureProduct.order > 0 ? "block" : "hidden"}
          >
            <input type="hidden" name="id" value={featureProduct.id} />
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
            action="/admin/feature/shift"
            className={
              featureProduct.order === totalCount - 1 ? "hidden" : "block"
            }
          >
            <input type="hidden" name="id" value={featureProduct.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              className="h-fit rotate-180 cursor-pointer rounded-xl bg-gray-100 p-1 hover:bg-gray-300"
            >
              ▲
            </button>
          </shiftFetcher.Form>
        </div>
        <div className="flex cursor-default gap-x-2 gap-y-4 rounded-sm p-4 py-4 transition-colors group-hover:bg-gray-100">
          <img
            src={featureProduct.media?.[0]?.url}
            alt={featureProduct.title}
            className="h-36 w-36 rounded-md object-contain object-center"
          />

          <div className="flex w-full flex-col gap-y-2">
            <div className="text-xl font-semibold">{featureProduct.title}</div>
            <div className="text-lg">{featureProduct.description}</div>
            <div className="text-lg">{featureProduct.price}</div>
          </div>

          <deleteFetcher.Form method="delete" action="/admin/feature/delete">
            <input type="hidden" name="id" value={featureProduct.id} />
            <button
              type="submit"
              className="h-fit cursor-pointer rounded-xl bg-white p-4 hover:shadow-md"
            >
              Remove
            </button>
          </deleteFetcher.Form>
        </div>
      </div>
    </Container>
  );
};

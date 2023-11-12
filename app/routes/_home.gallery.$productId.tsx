import type { Media } from "@prisma/client";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";

import Container from "~/components/Container";
import FullScreenDialog from "~/components/shop/FullScreenDialog";
import { prisma } from "~/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const id = params.productId;

    if (!id) {
      return json({ product: null }, { status: 404 });
    }

    let product;

    product = await prisma.categoryProduct.findUnique({
      where: { id },
      include: {
        media: true,
      },
    });

    if (!product) {
      product = await prisma.featureProduct.findUnique({
        where: { id },
        include: {
          media: true,
        },
      });
    }

    if (!product) {
      return json({ product: null }, { status: 404 });
    }

    return json(
      {
        product,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.log(error);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};

export default function Gallery() {
  // @ts-expect-error remix is a mess
  const { product } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <FullScreenDialog
      open={open}
      title={product.title}
      setOpen={setOpen}
      afterLeave={() =>
        location?.state?.internal ? navigate(-1) : navigate("/")
      }
      colorVariant="black"
      extraControl={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          className="bi bi-arrow-left-short"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
          />
        </svg>
      }
    >
      <Container>
        <div className="pb-10">
          {product.media.map((image: Media, i: number) => (
            <img
              key={i}
              className="mx-auto aspect-auto max-h-[75vh]"
              src={image.url}
              alt={product.title}
            />
          ))}
        </div>
      </Container>
    </FullScreenDialog>
  );
}

import type {
  Category as CategoryType,
  CategoryProduct,
  FeatureProduct as FeatureProductType,
  Media,
} from "@prisma/client";
import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import Container from "~/components/Container";
import Footer from "~/components/Footer";
import { Category } from "~/components/shop/Category";
import { FeatureProduct } from "~/components/shop/FeatureProduct";
import Navbar from "~/components/shop/Navbar";
import { prisma } from "~/db.server";

export const meta: MetaFunction = () => [{ title: "Jewelry by Georgia" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const redirectStatus = url.searchParams.get("redirect_status");

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
      },
    },
  });

  return json({
    data: [...featureProducts, ...categories].sort((a, b) =>
      a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
    ),
    success: redirectStatus === "succeeded",
  });
};

export default function Index() {
  // @ts-expect-error remix is a mess
  const { data, success } = useLoaderData();
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("cart");

      if (!c) {
        setCart([]);
        return;
      }

      const parsedCart = JSON.parse(c);

      setCart(parsedCart);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddToCart = (id: string) => {
    try {
      const c = localStorage.getItem("cart");

      if (!c) {
        localStorage.setItem("cart", JSON.stringify([id]));
      } else {
        const parsedCart = JSON.parse(c);

        localStorage.setItem("cart", JSON.stringify([...parsedCart, id]));
      }

      setCart((prev) => [...prev, id]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    try {
      const c = localStorage.getItem("cart");

      if (!c) {
        return;
      }

      const parsedCart = JSON.parse(c);

      localStorage.setItem(
        "cart",
        JSON.stringify(parsedCart.filter((i: string) => i !== id)),
      );

      setCart((prev) => prev.filter((i) => i !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Navbar cart={cart} success={success} />
      <div className="h-24 w-full"></div>
      {data?.map(
        (
          item:
            | (FeatureProductType & { media: Media[] })
            | (CategoryType & {
                categoryProducts: (CategoryProduct & { media: Media[] })[];
              }),
          i: number,
        ) => {
          if ("categoryProducts" in item) {
            return (
              <Category
                key={item.id}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                category={item}
              />
            );
          } else {
            return (
              <Container key={item.id}>
                <FeatureProduct
                  featureProduct={item}
                  cart={cart}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                  reverse={i % 2 === 0}
                />
              </Container>
            );
          }
        },
      )}
      <Outlet />
      <Footer />
    </main>
  );
}

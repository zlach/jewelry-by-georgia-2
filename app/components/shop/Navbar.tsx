import { useLocation, useNavigate } from "@remix-run/react";
import Container from "../Container";
import SuccessBanner from "./SuccessBanner";

export default function Navbar({
  cart,
  success = false,
}: {
  cart?: string[];
  success?: boolean;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleCartClick = () => {
    try {
      const c = localStorage.getItem("cart");

      if (!c) {
        return;
      }

      const parsedCart = JSON.parse(c);

      const queryString = parsedCart.map((id: string) => `id=${id}`).join("&");

      navigate(`/cart?${queryString}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="fixed z-10 w-full bg-white"
      style={{
        boxShadow:
          "rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset",
      }}
    >
      <Container>
        <div className="flex w-full items-center justify-between px-3 py-2 font-medium md:px-0">
          <h1 className="cursor-pointer text-3xl" onClick={() => navigate("/")}>
            Jewelry by Georgia
          </h1>
          <div className="flex justify-end">
            {pathname !== "/cart" && cart && (
              <button
                type="button"
                className="flex items-center gap-2 p-2 text-lg"
                onClick={handleCartClick}
              >
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
                <span>{cart.length}</span>
              </button>
            )}
          </div>
        </div>
      </Container>
      {success && <SuccessBanner />}
    </div>
  );
}

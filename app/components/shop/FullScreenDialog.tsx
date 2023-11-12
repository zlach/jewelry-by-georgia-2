import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Container from "~/components/Container";

export default function FullScreenDialog({
  colorVariant = "white",
  title,
  afterLeave = () => {},
  onClose = () => {},
  children,
  open = false,
  centerText = "",
  setOpen,
  reverseControls = false,
  extraControl,
  action = null,
}: {
  action?: ReactNode;
  colorVariant: "white" | "black";
  title?: string;
  afterLeave?: () => void;
  onClose?: () => void;
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  centerText?: string;
  reverseControls?: boolean;
  extraControl?: ReactNode;
}) {
  const colorVariants = {
    white: "bg-white text-gray-900",
    black: "bg-[#00091E] text-white",
  };

  return (
    <Transition.Root show={open} as={Fragment} appear={true}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={(value: boolean) => {
          setOpen(value);
          onClose && onClose();
        }}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 bottom-0 flex">
              <Transition.Child
                afterLeave={afterLeave}
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen">
                  <div
                    className={`flex h-full flex-col ${colorVariants[colorVariant]} shadow-xl`}
                  >
                    <div className={`z-10 ${colorVariants[colorVariant]} p-3`}>
                      <Container>
                        <div
                          className={`flex gap-2 ${
                            reverseControls ? "row-reverse" : ""
                          }`}
                        >
                          {!reverseControls && (
                            <Dialog.Title className="flex-1 text-base font-semibold leading-6">
                              {title}
                            </Dialog.Title>
                          )}
                          {!reverseControls && !extraControl && centerText && (
                            <div className="flex flex-1 justify-center">
                              {centerText}
                            </div>
                          )}
                          {reverseControls && extraControl && (
                            <div
                              className={`flex flex-1  ${
                                reverseControls
                                  ? "order-last items-end justify-end"
                                  : "justify-center"
                              }`}
                            >
                              {extraControl}
                            </div>
                          )}
                          <div
                            className={`flex flex-1  ${
                              reverseControls
                                ? "order-first flex-col justify-start"
                                : "ml-3 h-7 items-center justify-end"
                            }`}
                          >
                            <button
                              type="button"
                              className={`rounded-md ${
                                colorVariants[colorVariant]
                              } ${
                                reverseControls
                                  ? "order-first w-min justify-self-start "
                                  : ""
                              } text-gray-400 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#102145] focus:ring-offset-2`}
                              onClick={() => {
                                setOpen(false);
                                onClose && onClose();
                              }}
                            >
                              <span className="sr-only">Close panel</span>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="white"
                                className="bi bi-x-lg h-6 w-6"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </button>
                            {reverseControls && (
                              <Dialog.Title
                                className={`flex-1  font-semibold leading-6 ${
                                  reverseControls
                                    ? "order-last pt-4 text-2xl"
                                    : "text-base"
                                }`}
                              >
                                {title}
                              </Dialog.Title>
                            )}
                          </div>
                        </div>
                      </Container>
                    </div>
                    <div className="relative my-2 flex-1 overflow-y-scroll  px-3">
                      {children}
                    </div>
                    {action && <div className="p-3">{action}</div>}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

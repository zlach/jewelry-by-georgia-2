import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function CategoryForm({
  handleClose,
  categoryId,
}: {
  handleClose: () => void;
  categoryId?: string;
}) {
  const fetcher = useFetcher<{ success: boolean }>();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(
    function resetFormOnSuccess() {
      if (fetcher.data?.success) {
        ref.current?.reset();
        handleClose();
      }
    },
    [fetcher.state, fetcher.data, handleClose],
  );

  return (
    <fetcher.Form
      action={
        categoryId
          ? `/admin/update-category/${categoryId}`
          : "/admin/new-category"
      }
      method="post"
      className="flex flex-col gap-y-4 py-4"
      ref={ref}
    >
      <input
        className="rounded-md border-2 border-slate-500 p-2"
        type="text"
        name="title"
        placeholder="Title"
      />
      <button
        type="submit"
        disabled={fetcher.state === "submitting" || fetcher.state === "loading"}
        className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
      >
        Add Category
      </button>
    </fetcher.Form>
  );
}

import { Form, useFetcher } from "@remix-run/react";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import ImageUpload from "~/components/admin/ImageUpload";

export default function FeatureProductForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const fetcher = useFetcher<{ success: boolean }>();
  const [files, setFiles] = useState<File[]>([]);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(
    function resetFormOnSuccess() {
      if (fetcher.data?.success) {
        ref.current?.reset();
        setFiles([]);
        handleClose();
      }
    },
    [fetcher.state, fetcher.data, handleClose],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    files.forEach((file) => formData.append("files", file));

    fetcher.submit(formData, {
      method: "POST",
      action: "/admin/new-feature",
      encType: "multipart/form-data",
    });
  };

  return (
    <Form
      action="/admin/new-feature"
      method="post"
      className="flex flex-col gap-y-4 py-4"
      onSubmit={handleSubmit}
      ref={ref}
    >
      <input
        className="rounded-md border-2 border-slate-500 p-2"
        type="text"
        name="title"
        placeholder="Title"
      />
      <textarea
        className="rounded-md border-2 border-slate-500 p-2"
        name="description"
        placeholder="Description"
      />
      <div className="flex gap-4">
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
        />
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="number"
          name="count"
          placeholder="Count"
        />
      </div>
      <div className="flex gap-4">
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="text"
          name="features"
          placeholder="Feature 1"
        />
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="text"
          name="features"
          placeholder="Feature 2"
        />
      </div>
      <div className="flex gap-4">
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="text"
          name="features"
          placeholder="Feature 3"
        />
        <input
          className="w-1/2 rounded-md border-2 border-slate-500 p-2"
          type="text"
          name="features"
          placeholder="Feature 4"
        />
      </div>
      <ImageUpload setFiles={setFiles} files={files} />
      <button
        disabled={fetcher.state === "submitting" || fetcher.state === "loading"}
        type="submit"
        className={
          fetcher.state === "submitting" || fetcher.state === "loading"
            ? "rounded bg-slate-300 px-4 py-2 text-blue-100"
            : "rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        }
      >
        Add Product
      </button>
    </Form>
  );
}

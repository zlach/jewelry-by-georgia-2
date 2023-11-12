import type { ChangeEvent, Dispatch, DragEvent, SetStateAction } from "react";
import { useState } from "react";
import { z } from "zod";

const maxFiles = 24;
const maxFileSize = 5_000_000;
const acceptedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const filesSchema = z
  .instanceof(File)
  .array()
  .refine(
    (files) => files?.length <= maxFiles,
    `Max ${maxFiles} files allowed.`,
  )
  .refine((files) => {
    const totalSize = files.reduce(
      (acc: number, file: File) => acc + file.size,
      0,
    );

    return totalSize <= maxFiles * maxFileSize;
  }, `Max file size is 5MB.`)
  .refine(
    (files) =>
      files.every((file: File) => acceptedFileTypes.includes(file.type)),
    ".jpg, .jpeg, .png, .gif, and .webp files are accepted.",
  );

export default function ImageUpload({
  setFiles,
  files,
  label = "Upload Image",
  includeThumbnails = true,
  orientation = "vertical",
}: {
  setFiles: Dispatch<SetStateAction<File[]>>;
  files: File[];
  label?: string;
  includeThumbnails?: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const _updatedFiles = (prev: File[], arr: File[]) => {
    const prevNames = prev.map((file) => file.name);
    const newFiles = [
      ...prev,
      ...arr.filter((file) => !prevNames.includes(file.name)),
    ];

    return newFiles.length > maxFiles ? newFiles.slice(0, maxFiles) : newFiles;
  };

  const handleDrag = function (e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async function (e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (files.length >= maxFiles) return;

    if (e.dataTransfer?.files && e.dataTransfer?.files?.[0]) {
      const arr = [...e.dataTransfer.files].filter((file) =>
        acceptedFileTypes.includes(file.type),
      );

      const validated = filesSchema.safeParse(arr);

      if (validated.success) {
        setFiles((prev) => _updatedFiles(prev, arr));
      } else {
        const formatted = validated.error.format();

        setErrorMsg(formatted._errors?.[0]);
      }
    }
  };

  const handleChange = async function (e: ChangeEvent<HTMLInputElement>) {
    if (files.length >= maxFiles) return;

    if (e.currentTarget?.files && e.currentTarget?.files?.[0]) {
      const arr = [...e.currentTarget.files].filter((file) =>
        acceptedFileTypes.includes(file.type),
      );

      const validated = filesSchema.safeParse(arr);

      if (validated.success) {
        setFiles((prev) => _updatedFiles(prev, arr));
      } else {
        const formatted = validated.error.format();

        setErrorMsg(formatted._errors?.[0]);
      }

      e.currentTarget.value = "";
    }
  };

  return (
    <>
      {/* Drop zone/Upload button section */}
      <div
        onDragEnter={handleDrag}
        className={`rounded-lg border border-dashed px-6 ${
          dragActive ? "border-blue-900/25" : "border-gray-900/25"
        } ${orientation === "vertical" ? "h-40" : "h-24"}`}
      >
        {files.length < maxFiles ? (
          <div
            className={`flex h-full w-full items-center justify-center gap-x-2 ${
              orientation === "vertical" ? "flex-col" : "flex-row"
            }`}
          >
            <svg
              className="h-12 w-12 text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                clipRule="evenodd"
              />
            </svg>
            <div
              className={
                orientation === "vertical" ? "text-center" : "text-left"
              }
            >
              <div className="flex flex-wrap gap-x-1 text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-[#00376A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00376A] focus-within:ring-offset-2"
                >
                  {label}
                </label>
                <input
                  onChange={handleChange}
                  id="file-upload"
                  multiple
                  accept={acceptedFileTypes.join(",")}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
                <p>or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                .png .jpg .jpeg .gif .webp up to 5MB
              </p>
            </div>
          </div>
        ) : null}
        {files.length >= maxFiles ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-x-2">
            <div className="text-xs leading-5 text-gray-600">
              Thank you for uploading your photos!
            </div>
            <div className="text-xs leading-5 text-gray-600">
              Maximum of {maxFiles}
            </div>
          </div>
        ) : null}
        {dragActive ? (
          <div
            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-lg"
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        ) : null}
      </div>

      {/* Error message */}
      {errorMsg ? (
        <p className="mt-2 text-xs text-red-500">{errorMsg}</p>
      ) : null}

      {/* Image Thumbnails */}
      {includeThumbnails ? (
        <div className="mt-4 grid grid-cols-12 gap-4">
          {files.map((file, index) => (
            <div key={index} className="col-span-4">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={`h-36 w-full rounded-md object-contain object-center`}
              />
              <button
                type="button"
                onClick={() => {
                  setFiles((prev) => prev.filter((f) => f.name !== file.name));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

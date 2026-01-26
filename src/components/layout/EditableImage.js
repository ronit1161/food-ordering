import Image from "next/image";
import { toast } from "react-hot-toast"; // Import Toast for notifications
import { optimizeCloudinaryUrl } from "@/libs/utils";

export default function EditableImage({ link, setLink }) {
  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files?.length > 0) {
      const file = files[0];

      const data = new FormData();
      data.append("file", file);

      const uploadPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: data,
          });

          if (!response.ok) {
            reject("Failed to upload image");
            return;
          }

          const result = await response.json();
          setLink(result.link);
          resolve("Image uploaded successfully!");
        } catch (error) {
          reject("Image upload failed");
        }
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Image uploaded!",
        error: "Upload failed",
      });
    }
  };

  return (
    <>
      {link ? (
        <Image
          className="rounded-lg w-full h-full mb-4"
          src={optimizeCloudinaryUrl(link, { width: 250, height: 250 })}
          width={250}
          height={250}
          alt="Avatar"
        />
      ) : (
        <div className="bg-gray-200 p-4 text-gray-500 rounded-lg mb-1 text-center">
          No Image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border rounded-gray-300 rounded-lg p-2 text-center cursor-pointer">
          Change image
        </span>
      </label>
    </>
  );
}

import Image from "next/image";
import { toast } from "react-toastify"; // Import Toast for notifications

export default function EditableImage({ link, setLink }) {
  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files?.length > 0) {
      const file = files[0];

      const data = new FormData();
      data.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        setLink(result.link); // Update the link in the parent component state

        // Show success toast
        toast.success("Image uploaded successfully!");
      } catch (error) {
        // Show error toast
        toast.error("Image upload failed. Please try again.");
      }
    }
  };

  return (
    <>
      {link ? (
        <Image
          className="rounded-lg w-full h-full mb-4"
          src={link}
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

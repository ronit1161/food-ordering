import Image from "next/image";

export default function EditableImage({ link, setLink }) {
  const handleFileChange = async (e) => {
    const files = e.target.files;
   
    if (files?.length > 0) {
      const data = new FormData();
      data.append("file", files[0]);
  
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
  
        const link = await response.json();
        setLink(link);
  
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
      {link && (
        <Image
          className="rounded-lg w-full h-full mb-4"
          src={link}
          width={250}
          height={250}
          alt="Avatar"
        />
      )}
      {!link && (
        <div className="bg-gray-200 p-4 text-gray-500 rounded-lg mb-1 text-center">
            No Image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border rounded-gray-300 rounded-lg p-2 text-center cursor-pointer">
          Edit
        </span>
      </label>
    </>
  );
}

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    if (data.get('file')) {
      const file = data.get('file');

      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      // Convert buffer to data URI format
      const base64Content = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64Content}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'food-ordering',
      });

      const link = uploadResult.secure_url;
      return new Response(JSON.stringify({ link }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'No file found' }), { status: 400 });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return new Response(JSON.stringify({ message: 'File upload failed', error }), { status: 500 });
  }
}

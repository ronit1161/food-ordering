import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
  try {
    const data = await req.formData();
    if (data.get('file')) {
      const file = data.get('file');

      const s3client = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      });

      const ext = file.name.split('.').slice(-1)[0];
      const newFileName = uniqid() + '.' + ext;

      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const bucket = 'ronit-food-ordering';

      await s3client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: buffer,
      }));

      const link = `https://${bucket}.s3.amazonaws.com/${newFileName}`;
      return new Response(JSON.stringify({ link }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'No file found' }), { status: 400 });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return new Response(JSON.stringify({ message: 'File upload failed', error }), { status: 500 });
  }
}

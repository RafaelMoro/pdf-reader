import type { APIRoute } from "astro";
// import { createReadStream } from "streamifier";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
  cloud_name: 'dvhrooio0', 
  api_key: '421146935196895', 
  api_secret: import.meta.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadStream = async (buffer: Uint8Array, options: {
  folder: string
}) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(options, (error, result) => {
        if (result) resolve(result)
        reject(error)
      }).end(buffer)

      // Alternative to create Read streamable and pipe it to cloudinary uploader
      // createReadStream(buffer).pipe(theTransformStream)
    })
  } catch (error) {
    console.error(error);
  }
}

export const POST: APIRoute = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (file === null) {
      return new Response("No file uploaded", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const unit8Array = new Uint8Array(arrayBuffer);
    const result = await uploadStream(unit8Array, {
      folder: "pdf",
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
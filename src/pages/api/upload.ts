import type { APIRoute } from "astro";
// import { createReadStream } from "streamifier";
import fs from 'node:fs/promises'
import path from "node:path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

cloudinary.config({ 
  cloud_name: 'dvhrooio0', 
  api_key: '421146935196895', 
  api_secret: import.meta.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});

const outputDir = path.join(process.cwd(), 'public/text')

const uploadStream = async (buffer: Uint8Array, options: {
  folder: string;
  ocr?: string;
}): Promise<UploadApiResponse > => {
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
    return Promise.reject(error)
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
      ocr: 'adv_ocr'
    });
    const {
      asset_id: id,
      secure_url: url,
      pages,
      info
    } = result;

    // Advanced OCR from cloudinary
    // Docs: https://cloudinary.com/documentation/ocr_text_detection_and_extraction_addon?customer_external_id=aba5f859d76dfc7d689eb19a539a7d&frameless=1
    const data = info?.ocr?.adv_ocr?.data
    const text = data.map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks['textAnnotations'] ?? {}
      const first = annotations[0] ?? {}
      const content = first['description'] ?? ''
      return content.trim()
    }).filter(Boolean).join('\n')

    // Deberiamos de meter la info en una base de datos
    // O mejor todavia, en un vector y hacer los embeddings
    // Como minimo, lo deberiamos de subir a un S3 privado
    fs.writeFile(path.join(outputDir, `${id}.txt`), text, 'utf8')

    return new Response(JSON.stringify({
      id,
      url,
      pages,
    }));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import { successResponse, errorResponse } from "@/lib/api-utils";

export const runtime = "nodejs";

const CLOUDINARY_FOLDER = "sebisa/trusted-brand-logos";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const CLOUDINARY_UPLOAD_TIMEOUT_MS = 30_000;

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function cleanEnv(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "");
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudinaryUrl = cleanEnv(process.env.CLOUDINARY_URL);
  let cloudName = cleanEnv(
    process.env.CLOUDINARY_CLOUD_NAME ??
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  );
  let apiKey = cleanEnv(process.env.CLOUDINARY_API_KEY);
  let apiSecret = cleanEnv(process.env.CLOUDINARY_API_SECRET);

  if (cloudinaryUrl?.startsWith("cloudinary://")) {
    try {
      const url = new URL(cloudinaryUrl);
      apiKey ||= decodeURIComponent(url.username);
      apiSecret ||= decodeURIComponent(url.password);
      cloudName ||= url.hostname;
    } catch {
      return null;
    }
  }

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    cloudName.includes("your-") ||
    apiKey.includes("your-") ||
    apiSecret.includes("your-")
  ) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function configureCloudinary(config: CloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
    timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,
  });
}

async function uploadImageToCloudinary(file: File) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Upload ke Cloudinary timeout"));
    }, CLOUDINARY_UPLOAD_TIMEOUT_MS);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: "image",
        overwrite: true,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) => {
        clearTimeout(timer);

        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary tidak mengembalikan URL gambar"));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
}

export async function POST(request: Request) {
  try {
    const config = getCloudinaryConfig();

    if (!config) {
      return Response.json(
        errorResponse("Cloudinary belum dikonfigurasi di environment"),
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(errorResponse("File logo wajib diupload"), {
        status: 400,
      });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(errorResponse("File harus berupa gambar"), {
        status: 400,
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(errorResponse("Ukuran gambar maksimal 2MB"), {
        status: 400,
      });
    }

    configureCloudinary(config);
    const uploadResult = await uploadImageToCloudinary(file);

    return Response.json(
      successResponse({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      }),
    );
  } catch (error) {
    console.error("Trusted brand logo upload failed", error);

    return Response.json(
      errorResponse(
        error instanceof Error && error.message.includes("timeout")
          ? "Upload ke Cloudinary timeout. Coba lagi atau cek koneksi server."
          : error instanceof Error
            ? error.message
            : "Gagal upload logo brand",
      ),
      { status: 500 },
    );
  }
}

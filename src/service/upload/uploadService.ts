import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

export interface BrandPayload {
  logo_url: string;
}

export const uploadLogo = async (file: File) => {
  const formDataUpload = new FormData();
  formDataUpload.append("file", file);

  try {
    const response = await axios.post(baseUrl || "", formDataUpload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

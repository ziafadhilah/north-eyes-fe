import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

export interface uploadAreaPayload {
  logo_url: string;
}

export const uploadLogoArea = async (file: File) => {
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


import axios from "axios";

const CLOUD_NAME ="dxstkeqrh"; 
const UPLOAD_PRESET = "workshop_template_upload";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided");

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(url, formData);
  return response.data.secure_url;
};

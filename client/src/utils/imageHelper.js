import { SERVER_BASE } from "./api";

export const getImageUrl = (image) => {
  if (!image) {
    return `${SERVER_BASE}/uploads/no-image.jpg`;
  }

  let imageValue = image;

  // agar object aaya ho { url }, { path }, { filename }, { image }
  if (typeof image === "object") {
    imageValue =
      image.url ||
      image.path ||
      image.filename ||
      image.image ||
      "";
  }

  imageValue = String(imageValue).trim();

  if (!imageValue) {
    return `${SERVER_BASE}/uploads/no-image.jpg`;
  }

  // full url already ho
  if (/^https?:\/\//i.test(imageValue)) {
    return imageValue;
  }

  const cleanPath = imageValue
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  // agar already uploads/ se start ho raha hai
  if (cleanPath.startsWith("uploads/")) {
    return `${SERVER_BASE}/${cleanPath}`;
  }

  // agar sirf filename hai
  return `${SERVER_BASE}/uploads/${cleanPath}`;
};
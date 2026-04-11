const CLOUD_NAME = 'djolg0is0';

export interface UploadResult {
  url: string;
  format: string;
  resourceType: string;
  originalFilename: string;
  createdAt: string;
}

export async function uploadFile(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<UploadResult> {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const body = new FormData();
  body.append('file', { uri, name: fileName, type: mimeType } as any);
  body.append('folder', 'prescriptions');
  body.append('upload_preset', 'healthcare');

  const res = await fetch(endpoint, { method: 'POST', body });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? 'Upload failed');
  }
  const data = await res.json();
  
  console.log("Cloudinary response (file):", data);
  
  return {
    url: data.secure_url,
    format: data.format,
    resourceType: data.resource_type,
    originalFilename: data.original_filename,
    createdAt: data.created_at,
  };
}

export async function uploadByUrl(remoteUrl: string): Promise<UploadResult> {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  
  const formData = new FormData();
  formData.append('file', remoteUrl);
  formData.append('upload_preset', 'healthcare');
  formData.append('folder', 'prescriptions');

  const res = await fetch(endpoint, { 
    method: 'POST', 
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  
  if (!res.ok) {
    const err = await res.json();
    console.log("Upload error response:", err);
    throw new Error(err.error?.message ?? 'Upload failed');
  }
  const data = await res.json();
  
  console.log("Cloudinary response (URL):", data);
  
  return {
    url: data.secure_url,
    format: data.format,
    resourceType: data.resource_type,
    originalFilename: data.original_filename || remoteUrl.split('/').pop() || 'file',
    createdAt: data.created_at,
  };
}
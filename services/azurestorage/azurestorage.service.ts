import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
const BLOB_SAS_TOKEN = process.env.NEXT_PUBLIC_AZURE_STORAGE_BLOB_SAS_TOKEN;

export async function uploadImageToAzure(imageBase64: string, folder: string, contentType: string = 'image/png'): Promise<string | null> {
  try {

    if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME || !BLOB_SAS_TOKEN) {
      throw new Error("Azure Storage Connection String ou Container Name ou Blob SAS Token estão faltando");
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const filename = `${folder}/${Date.now()}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    const base64Data = imageBase64.split(',')[1]; 
    const imageBuffer = Buffer.from(base64Data, 'base64');

    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error("Erro enviando imagem:", error);
    return null;
  }
}

export function getBlobUrl(filename: string): string {

  if (!BLOB_SAS_TOKEN) {
    throw new Error("Blob SAS Token está faltando");
  }

  try {
    const blobUrl = `${filename}?${BLOB_SAS_TOKEN}`;
    return blobUrl;
  } catch (error) {
    console.error("Erro recuperando URL do blob:", error);
    throw error;
  }
}
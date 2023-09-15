

const BASE_URL = process.env.NEXT_PUBLIC_KV_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_KVPEAR_API_KEY;

export const storeKv = async (bucket: string, key: string, value: any) => {
  const url = `${BASE_URL}/v1/kvs/${bucket}/${key}`;
  const headers = {
    'Content-Type': 'text/plain',
    'x-api-key': API_KEY as string,
  };
  return await fetch(url, {
    method: 'POST',
    headers,
    body: value,
  })
};
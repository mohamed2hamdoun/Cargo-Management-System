// frontend/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

// Generic GET helper
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API GET ${path} failed: ${res.status}`);
  }

  return res.json();
}

// Generic POST helper
export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;
    console.log("POST URL:", url);   // add this
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API POST ${path} failed: ${res.status}`);
  }

  return res.json();
}

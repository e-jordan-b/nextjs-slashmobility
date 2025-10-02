export async function fetchData<T>(url: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 1212}`
  const response = await fetch(`${baseUrl}/api${url}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
}
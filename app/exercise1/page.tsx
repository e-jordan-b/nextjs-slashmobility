import Range from "../components/Range/Range";

interface RangeConfig {
  min: number;
  max: number;
}

async function getRangeConfig(): Promise<RangeConfig> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 1212}`
  const response = await fetch(`${baseUrl}/api/range-config`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch range-config');
  }

  return response.json();
}


export default async function Exercise1() {
  const rangeConfig = await getRangeConfig();

  return (
    <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Range max={rangeConfig.max} min={rangeConfig.min} />
    </main>
  )
}

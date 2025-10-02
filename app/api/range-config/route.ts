import { NextResponse } from "next/server";

export async function GET() {
  const rangeConfig = {
    min: 1,
    max: 99,
  };

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(rangeConfig);
}

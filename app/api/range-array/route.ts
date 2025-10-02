import { NextResponse } from "next/server";

export async function GET() {
  const rangeArray = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(rangeArray);
}

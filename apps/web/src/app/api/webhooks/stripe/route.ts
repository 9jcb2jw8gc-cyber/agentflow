import { NextResponse } from "next/server";

export async function POST() {
  // TODO: implement Stripe webhook handler
  return NextResponse.json({ received: true });
}

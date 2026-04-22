import { getLicenses } from "next-license-list";
import { headers } from "next/headers";

export async function GET() {
  await headers();
  const licenses = await getLicenses();
  return Response.json(licenses);
}

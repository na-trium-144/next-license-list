export async function getLicenses() {
  // @ts-ignore
  const data = (await import("next-license-list-file")).default;
  return data;
}

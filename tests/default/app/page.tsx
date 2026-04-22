import { getLicenses } from "next-license-list";

export default async function Home() {
  const licenses = await getLicenses();

  return (
    <main>
      <pre>{JSON.stringify(licenses, null, 2)}</pre>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

export function useLicenses() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch(
      // @ts-ignore
      `/_next/static/licenses-${NEXT_LICENSE_LIST_HASH}.json`,
    )
      .then((res) => res.json())
      .then((data) => setData(data as any));
  }, []);
  return data;
}

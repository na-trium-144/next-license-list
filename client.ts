"use client";

import { useEffect, useState } from "react";
import type { LicenseData } from "./list.js";

export function useLicenses() {
  const [data, setData] = useState<LicenseData[] | Error | undefined>();
  useEffect(() => {
    if (data === undefined) {
      fetch(
        // @ts-ignore
        `/_next/static/licenses-${NEXT_LICENSE_LIST_HASH}.json`,
      )
        .then(async (res) => {
          if (res.ok) {
            setData((await res.json()) as LicenseData[]);
          } else {
            setData(
              new Error(
                `Fetching license data failed with status ${res.status}: ${await res.text()}`,
              ),
            );
          }
        })
        .catch((e) => setData(e instanceof Error ? e : new Error(String(e))));
    }
  }, [data]);
  return data;
}

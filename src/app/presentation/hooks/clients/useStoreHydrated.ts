"use client";

import { useEffect, useState } from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
}

export function useStoreHydrated(persist: PersistApi | undefined): boolean {
  const [hydrated, setHydrated] = useState(() => persist?.hasHydrated() ?? false);

  useEffect(() => persist?.onFinishHydration(() => setHydrated(true)), [persist]);

  return hydrated;
}

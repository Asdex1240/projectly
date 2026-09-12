"use client";

import { useProfileStore } from "@/lib/stores/profile-store";
import type { CompanyProfile } from "@/app/presentation/types/profile/types";

export function useProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const update = (patch: Partial<CompanyProfile>) => updateProfile(patch);

  return { profile, update };
}

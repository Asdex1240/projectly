import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompanyProfile } from "@/app/presentation/types/profile/types";

export const PROFILE_STORE_KEY = "projectly:profile";

const EMPTY_PROFILE: CompanyProfile = {
  name: "",
  logo: null,
  brandColor: "#111827",
  preparedBy: "",
  contact: "",
};

interface ProfileState {
  profile: CompanyProfile;
  updateProfile: (patch: Partial<CompanyProfile>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
    }),
    { name: PROFILE_STORE_KEY }
  )
);

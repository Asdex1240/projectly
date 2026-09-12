"use client";

import { ProfileForm } from "@/app/presentation/pages/profile/ProfileForm";
import { useProfilePage } from "@/app/presentation/hooks/profile/useProfilePage";

export default function ProfilePage() {
  const { profile, update } = useProfilePage();

  return <ProfileForm profile={profile} onUpdate={update} />;
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyProfile } from "@/app/presentation/types/profile/types";
import { BrandFields } from "@/app/presentation/pages/shared/BrandFields";

interface ProfileFormProps {
  profile: CompanyProfile;
  onUpdate: (patch: Partial<CompanyProfile>) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          nativeButton={false}
          render={<Link href="/clients" />}
        >
          <ArrowLeft />
          Clientes
        </Button>
        <h1 className="text-lg font-semibold">Perfil</h1>
        <p className="text-sm text-muted-foreground">
          Estos datos se usan para precargar automáticamente cada nueva cotización y alcance.
        </p>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tu empresa
          </p>
          <BrandFields
            name={profile.name}
            logo={profile.logo}
            brandColor={profile.brandColor}
            onChange={onUpdate}
          />
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Contacto
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Preparado por</Label>
              <Input
                className="h-9 bg-background"
                value={profile.preparedBy}
                onChange={(e) => onUpdate({ preparedBy: e.target.value })}
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Contacto (email / teléfono)</Label>
              <Input
                className="h-9 bg-background"
                value={profile.contact}
                onChange={(e) => onUpdate({ contact: e.target.value })}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

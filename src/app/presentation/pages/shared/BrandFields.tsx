"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { readImageAsDataUrl } from "@/app/presentation/utils/shared/read-image-file";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

interface BrandFieldsProps {
  name: string;
  logo: string | null;
  brandColor: string;
  onChange: (patch: { name?: string; logo?: string | null; brandColor?: string }) => void;
}

export function BrandFields({ name, logo, brandColor, onChange }: BrandFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readImageAsDataUrl(file, MAX_LOGO_BYTES)
      .then((dataUrl) => onChange({ logo: dataUrl }))
      .catch((err: Error) => alert(err.message));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Nombre</Label>
        <Input
          className="h-9 bg-background"
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Mi Empresa"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={brandColor}
            onChange={(e) => onChange({ brandColor: e.target.value })}
            className="h-9 w-9 rounded cursor-pointer border border-input bg-background"
          />
          <Input
            className="h-9 bg-background flex-1 font-mono text-xs"
            value={brandColor}
            onChange={(e) => onChange({ brandColor: e.target.value })}
            placeholder="#000000"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Logo</Label>
        {logo ? (
          <div className="flex items-center gap-2 p-2 border border-input rounded-md bg-background h-9">
            <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
            <span className="flex-1 text-xs text-muted-foreground truncate">Logo cargado</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange({ logo: null })}
            >
              <X />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center h-9 border border-dashed border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
          >
            <span className="text-xs text-muted-foreground">Subir logo</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleLogoChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

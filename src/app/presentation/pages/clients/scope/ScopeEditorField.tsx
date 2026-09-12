"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface ScopeEditorFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}

export function ScopeEditorField({ label, htmlFor, hint, children }: ScopeEditorFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

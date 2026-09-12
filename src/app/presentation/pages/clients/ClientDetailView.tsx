"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Client,
  QuotationDocument,
  ScopeDocument,
} from "@/app/presentation/types/clients/types";
import { QuotationsTab } from "@/app/presentation/pages/clients/quotation/QuotationsTab";
import { ScopesTab } from "@/app/presentation/pages/clients/scope/ScopesTab";

interface ClientDetailViewProps {
  client: Client;
  quotations: QuotationDocument[];
  scopes: ScopeDocument[];
  onCreateQuotation: () => void;
  onDeleteQuotation: (id: string) => void;
  onCreateScope: () => void;
  onDeleteScope: (id: string) => void;
}

export function ClientDetailView({
  client,
  quotations,
  scopes,
  onCreateQuotation,
  onDeleteQuotation,
  onCreateScope,
  onDeleteScope,
}: ClientDetailViewProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col gap-1">
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
        <h1 className="text-lg font-semibold">{client.name}</h1>
        {client.company && (
          <p className="text-sm text-muted-foreground">{client.company}</p>
        )}
      </div>

      <Tabs defaultValue="quotation">
        <TabsList>
          <TabsTrigger value="quotation">Cotización</TabsTrigger>
          <TabsTrigger value="scope">Alcance</TabsTrigger>
        </TabsList>
        <TabsContent value="quotation">
          <QuotationsTab
            clientId={client.id}
            quotations={quotations}
            onCreate={onCreateQuotation}
            onDelete={onDeleteQuotation}
          />
        </TabsContent>
        <TabsContent value="scope">
          <ScopesTab
            clientId={client.id}
            scopes={scopes}
            onCreate={onCreateScope}
            onDelete={onDeleteScope}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

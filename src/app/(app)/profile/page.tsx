"use client";

import { useState } from "react";
import { Plus, FileText, Package, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentCard } from "@/components/profile/DocumentCard";
import { DocumentFormSheet } from "@/components/profile/DocumentFormSheet";
import { DocumentDetailSheet } from "@/components/profile/DocumentDetailSheet";
import { MaterialCard } from "@/components/profile/MaterialCard";
import { MaterialFormSheet } from "@/components/profile/MaterialFormSheet";
import { MaterialDetailSheet } from "@/components/profile/MaterialDetailSheet";
import { ContactCard } from "@/components/contacts/ContactCard";
import { ContactFormSheet } from "@/components/contacts/ContactFormSheet";
import { ContactDetailSheet } from "@/components/contacts/ContactDetailSheet";
import { useAppStore } from "@/lib/store";
import { Contact, DocumentRecord, Material } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "documents" | "materials" | "contacts";

export default function ProfilePage() {
  const documents = useAppStore((s) => s.documents);
  const materials = useAppStore((s) => s.materials);
  const contacts = useAppStore((s) => s.contacts);

  const [tab, setTab] = useState<Tab>("documents");

  const [docFormOpen, setDocFormOpen] = useState(false);
  const [docDetail, setDocDetail] = useState<DocumentRecord | null>(null);

  const [matFormOpen, setMatFormOpen] = useState(false);
  const [matEditing, setMatEditing] = useState<Material | undefined>(undefined);
  const [matDetail, setMatDetail] = useState<Material | null>(null);

  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [contactEditing, setContactEditing] = useState<Contact | undefined>(undefined);
  const [contactDetail, setContactDetail] = useState<Contact | null>(null);

  return (
    <div className="pb-6">
      <PageHeader title="Hồ sơ" />

      <div className="px-5">
        <div className="flex gap-1 mb-5 bg-surface-2 rounded-2xl p-1">
          <TabButton active={tab === "documents"} label="Tài liệu" onClick={() => setTab("documents")} />
          <TabButton active={tab === "materials"} label="Vật liệu" onClick={() => setTab("materials")} />
          <TabButton active={tab === "contacts"} label="Thầu & NCC" onClick={() => setTab("contacts")} />
        </div>

        {tab === "documents" ? (
          <div className="space-y-4">
            <Button className="w-full" size="lg" onClick={() => setDocFormOpen(true)}>
              <Plus size={18} /> Thêm tài liệu
            </Button>
            <Card className="p-4">
              {documents.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Chưa có tài liệu nào"
                  description="Lưu lại bản vẽ, hợp đồng, báo giá... ngay trên điện thoại."
                />
              ) : (
                <div className="divide-y divide-border">
                  {documents.map((d) => (
                    <DocumentCard key={d.id} document={d} onClick={() => setDocDetail(d)} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : tab === "materials" ? (
          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setMatEditing(undefined);
                setMatFormOpen(true);
              }}
            >
              <Plus size={18} /> Thêm vật liệu
            </Button>
            {materials.length === 0 ? (
              <Card className="p-4">
                <EmptyState
                  icon={Package}
                  title="Chưa có vật liệu nào"
                  description="Lưu lại các mẫu vật liệu bạn đang cân nhắc hoặc đã chốt."
                />
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {materials.map((m) => (
                  <MaterialCard key={m.id} material={m} onClick={() => setMatDetail(m)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setContactEditing(undefined);
                setContactFormOpen(true);
              }}
            >
              <Plus size={18} /> Thêm thầu/nhà cung cấp
            </Button>
            <Card className="p-4">
              {contacts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Chưa có thầu/nhà cung cấp nào"
                  description="Lưu lại thông tin và đánh giá ngắn gọn sau mỗi giai đoạn làm việc."
                />
              ) : (
                <div className="divide-y divide-border">
                  {contacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onClick={() => setContactDetail(c)} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      <DocumentFormSheet open={docFormOpen} onClose={() => setDocFormOpen(false)} />
      <DocumentDetailSheet document={docDetail} onClose={() => setDocDetail(null)} />

      <MaterialFormSheet open={matFormOpen} onClose={() => setMatFormOpen(false)} editing={matEditing} />
      <MaterialDetailSheet
        material={matDetail}
        onClose={() => setMatDetail(null)}
        onEdit={(m) => {
          setMatDetail(null);
          setMatEditing(m);
          setMatFormOpen(true);
        }}
      />

      <ContactFormSheet
        open={contactFormOpen}
        onClose={() => setContactFormOpen(false)}
        editing={contactEditing}
      />
      <ContactDetailSheet
        contact={contactDetail}
        onClose={() => setContactDetail(null)}
        onEdit={(c) => {
          setContactDetail(null);
          setContactEditing(c);
          setContactFormOpen(true);
        }}
      />
    </div>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2 rounded-xl text-sm font-medium transition-colors",
        active ? "bg-surface shadow-sm text-text-primary" : "text-text-secondary"
      )}
    >
      {label}
    </button>
  );
}

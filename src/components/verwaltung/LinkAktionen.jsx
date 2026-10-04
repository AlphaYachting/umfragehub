import React, { useState } from "react";
import { Copy, Eye, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { teilnahmeUrl, inZwischenablage } from "@/lib/verwaltung";
import VorschauDialog from "@/components/verwaltung/VorschauDialog";
import QrDialog from "@/components/verwaltung/QrDialog";

// Die drei Dinge, die man bei jeder Welle ständig braucht:
// Teilnahmelink kopieren, Vorschau ansehen, QR-Code zeigen.
export default function LinkAktionen({ welle, mitText = true, variant = "outline" }) {
  const [vorschau, setVorschau] = useState(false);
  const [qr, setQr] = useState(false);

  async function kopieren() {
    const ok = await inZwischenablage(teilnahmeUrl(welle.linkToken));
    if (!ok) {
      toast.error("Kopieren nicht möglich — bitte den QR-Dialog öffnen und den Link dort markieren.");
      return;
    }
    if (welle.status === "live") toast.success("Teilnahmelink kopiert.");
    else toast.success("Teilnahmelink kopiert — er funktioniert erst, wenn die Welle live ist.");
  }

  const knopf = (Icon, text, titel, onClick) => (
    <Button variant={variant} size="sm" onClick={onClick} title={titel} aria-label={titel}>
      <Icon size={15} className={mitText ? "mr-1" : ""} />
      {mitText && text}
    </Button>
  );

  return (
    <>
      <div className="flex items-center gap-1.5">
        {knopf(Eye, "Vorschau", "Vorschau ansehen", () => setVorschau(true))}
        {knopf(Copy, "Link", "Teilnahmelink kopieren", kopieren)}
        {knopf(QrCode, "QR", "QR-Code zeigen", () => setQr(true))}
      </div>
      {vorschau && <VorschauDialog welle={welle} offen={vorschau} onClose={() => setVorschau(false)} />}
      {qr && <QrDialog welle={welle} offen={qr} onClose={() => setQr(false)} />}
    </>
  );
}

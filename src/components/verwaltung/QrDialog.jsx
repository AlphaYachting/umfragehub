import React, { useRef } from "react";
import { Download, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { teilnahmeUrl, inZwischenablage } from "@/lib/verwaltung";

// QR-Code des Teilnahmelinks — zum Zeigen am Bildschirm oder als PNG für Aushang und Folie
export default function QrDialog({ welle, offen, onClose }) {
  const rahmen = useRef(null);
  if (!welle) return null;
  const url = teilnahmeUrl(welle.linkToken);

  function herunterladen() {
    const canvas = rahmen.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr_${(welle.name || "welle").replace(/[^a-z0-9äöüß]+/gi, "_")}.png`;
    a.click();
  }

  async function kopieren() {
    const ok = await inZwischenablage(url);
    if (ok) toast.success("Link kopiert.");
    else toast.error("Kopieren nicht möglich — bitte den Link markieren und kopieren.");
  }

  return (
    <Dialog open={offen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR-Code — {welle.name}</DialogTitle>
          <DialogDescription>
            Führt direkt zur Befragung.
            {welle.status !== "live" && " Die Welle ist noch nicht live — der Code funktioniert erst danach."}
          </DialogDescription>
        </DialogHeader>
        <div ref={rahmen} className="flex justify-center py-2">
          <QRCodeCanvas value={url} size={720} level="M" includeMargin style={{ width: 240, height: 240 }} />
        </div>
        <code className="block text-xs bg-muted px-3 py-2 rounded break-all text-muted-foreground">{url}</code>
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline" onClick={kopieren}>
            <Copy size={15} /> Link kopieren
          </Button>
          <Button className="flex-1" onClick={herunterladen}>
            <Download size={15} /> PNG laden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

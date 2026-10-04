import React, { useEffect, useState } from 'react';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Gestaltete Rückfrage statt des grauen Browser-Fensters.
//   if (!await bestaetigen("Welle schließen?", { aktion: "Schließen" })) return;
//   const name = await eingabe("Name der Kopie", "Welle (Kopie)");
// <BestaetigenHost /> steht einmal im App-Rahmen.
let oeffne = null;

export function bestaetigen(text, optionen = {}) {
  if (!oeffne) return Promise.resolve(window.confirm(text));
  return new Promise((resolve) => oeffne({ art: 'frage', text, ...optionen, resolve }));
}

export function eingabe(text, vorgabe = '', optionen = {}) {
  if (!oeffne) return Promise.resolve(window.prompt(text, vorgabe));
  return new Promise((resolve) => oeffne({ art: 'eingabe', text, vorgabe, ...optionen, resolve }));
}

export function BestaetigenHost() {
  const [anfrage, setAnfrage] = useState(null);
  const [wert, setWert] = useState('');

  useEffect(() => {
    oeffne = (a) => {
      setWert(a.vorgabe || '');
      setAnfrage(a);
    };
    return () => { oeffne = null; };
  }, []);

  if (!anfrage) return null;
  const istEingabe = anfrage.art === 'eingabe';
  const schliessen = (ergebnis) => {
    anfrage.resolve(ergebnis);
    setAnfrage(null);
  };
  const absaetze = String(anfrage.text || '').split(/\n\s*\n/);
  const titel = anfrage.titel || absaetze[0];
  const rest = anfrage.titel ? absaetze : absaetze.slice(1);

  return (
    <AlertDialog open onOpenChange={(o) => !o && schliessen(istEingabe ? null : false)}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-value leading-snug">{titel}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-body text-muted-foreground">
              {rest.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {istEingabe && (
          <Input
            autoFocus
            value={wert}
            onChange={(e) => setWert(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && wert.trim()) schliessen(wert); }}
          />
        )}
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => schliessen(istEingabe ? null : false)}>Abbrechen</Button>
          {anfrage.gefaehrlich ? (
            <Button variant="outline" className="border-status-critical text-status-critical hover:bg-status-critical-surface hover:border-status-critical" onClick={() => schliessen(true)}>
              {anfrage.aktion || 'Löschen'}
            </Button>
          ) : (
            <Button disabled={istEingabe && !wert.trim()} onClick={() => schliessen(istEingabe ? wert : true)}>
              {anfrage.aktion || (istEingabe ? 'Übernehmen' : 'Fortfahren')}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

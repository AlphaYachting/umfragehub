import sys
src = open(sys.argv[1], encoding='utf-8').read()

# 1. Import
src = src.replace(
  'import Kennzahlen from "@/components/aussenblick/Kennzahlen";',
  'import Kennzahlen from "@/components/aussenblick/Kennzahlen";\nimport { TraegtBricht, Belege, Vorschlag, Einschaetzung, Anzeigenpaar } from "@/components/aussenblick/Bericht";', 1)

# 2. Block 3 (Quellen above tabs) -> TraegtBricht
start = src.index('      {/* 3. Die Quellen: was sie verkaufen wollen, wie sie auftreten, was Kunden sagen */}')
end = src.index('      <Tabs value={reiter} onValueChange={setReiter}>')
neu3 = '''      {/* 3. Das Positive und das Negative nebeneinander */}
      <TraegtBricht ziel={ziel} />

'''
src = src[:start] + neu3 + src[end:]

# 3. Tab label
src = src.replace('<TabsTrigger value="befund">Befund</TabsTrigger>', '<TabsTrigger value="befund">Bericht</TabsTrigger>', 1)

# 4. Replace Befund tab content
start = src.index('        {/* ------------------------------------------------------------ Befund */}')
end = src.index('        {/* ------------------------------------------------------------ Portal */}')
neu = '''        {/* ------------------------------------------------------------ Bericht */}
        <TabsContent value="befund" className="space-y-5 mt-4">
          {/* 1. Belege: jede Behauptung mit A und B und der Spannung als Schluss */}
          <Belege widersprueche={d.widersprueche} offen={offen} setOffen={setOffen} />

          {/* 2. Vorschlag: Einstieg, Begründung, Hebel */}
          <Vorschlag ziel={ziel} />

          {/* 3. Einschätzung, Hypothese, offene Punkte */}
          <Einschaetzung ziel={ziel} scanHinweis={ziel.scanAm ? `Scan ${datumKurz(alsDatum(ziel.scanAm), true)}${ziel.scanVon ? ` · ${ziel.scanVon}` : ""}` : undefined} />

          {/* 4. Was wir gesehen haben: die Quellen hinter dem Urteil */}
          {(() => {
            const scanTage = ziel.scanAm ? Math.max(0, Math.round((Date.now() - alsDatum(ziel.scanAm).getTime()) / 86400000)) : null;
            const eckdaten = [
              ziel.markennamen?.length ? `${ziel.markennamen.length} Markennamen in Umlauf: ${ziel.markennamen.join(", ")}` : null,
              ziel.zielgruppen?.length ? `${ziel.zielgruppen.length} Zielgruppenbezeichnungen: ${ziel.zielgruppen.join(", ")}` : null,
              ziel.scanAm ? `Scan ${scanTage === 0 ? "heute" : `vor ${scanTage} Tagen`} (${datumKurz(alsDatum(ziel.scanAm), true)})` : "noch kein Scan",
            ];
            return <AufEinenBlick ziel={ziel} eckdaten={eckdaten} titel="Was wir gesehen haben" hinweis="die Quellen hinter dem Urteil" />;
          })()}
          <Anzeigenpaar werbung={w} />
        </TabsContent>

'''
src = src[:start] + neu + src[end:]
open(sys.argv[1], 'w', encoding='utf-8').write(src)
print("ok")

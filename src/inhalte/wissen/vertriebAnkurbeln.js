// Beitrag Nr. 23 im Wissensbereich: /wissen/vertrieb-ankurbeln
// Inhalte aus n14.py und grafik_n14.py (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 05.11.2026.
// Status entwurf. Belege im Projekt unter analyse/.
const beitrag = {
  "slug": "vertrieb-ankurbeln",
  "nr": 23,
  "status": "entwurf",
  "geprueft": null,
  "erschienen": null,
  "aktualisiert": null,
  "leitartikel": false,
  "modul": "vertrieb",
  "etikett": "Vertrieb",
  "themen": [
    "Vertrieb",
    "Kunden"
  ],
  "seitentitel": "Vertrieb ankurbeln: Wer kauft zuerst wieder? | andi fragt.",
  "beschreibung": "Die Industrie zieht wieder an. Wie du den Vertrieb ankurbelst, wenn du weißt, welche Kunden zuerst wieder kaufen, warum, und wo deine Angebote hängen.",
  "teaser": "Die Industrie zieht wieder an, aber nicht bei allen Kunden gleich. Wie du herausfindest, wer zuerst wieder kauft, warum, und wo deine Angebote hängen.",
  "kurztitel": "Vertrieb ankurbeln im Aufschwung",
  "titel": "Vertrieb ankurbeln, wenn die Industrie anzieht:",
  "titelAkzent": "Weißt du, wer zuerst wieder kauft?",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Titelgrafik: Eine Karte mit der Überschrift Deine Kunden im Aufschwung und drei Zeilen. Pink hervorgehoben: Export und Investitionen, kauft schon wieder. Grau: Lageraufbau, kauft auf Vorrat. Umrandet: Bau und Konsum, wartet noch.",
    "unterschrift": "Die Aufträge kommen zurück, aber nicht bei allen Kunden gleichzeitig und nicht aus demselben Grund.",
    "platzhalter": "Platzhalter Titelbild: Gespräch zwischen Vertriebsleiter und Kunde in einer Produktionshalle, 1600 x 900 px"
  },
  "titelgrafik": true,
  "kurzAntwort": "Den Vertrieb kurbelst du am besten an, indem du weißt, welche Kunden wieder kaufen und warum. Laut WIFO trägt 2026 die Industrie das Wachstum, gestützt von Exporten und Investitionen. Ein Teil der neuen Aufträge geht aber auf Vorsorgekäufe zurück, und Bau und Konsum bleiben schwach. Wer Verkäufer und Kunden fragt, sieht, wo er zuerst ansetzen soll.",
  "wichtigstes": [
    {
      "fett": "Die Industrie zieht an.",
      "text": "Laut WIFO wächst die Wertschöpfung der Herstellung von Waren 2026 um 2,3 %, der Einkaufsmanagerindex der Bank Austria stand im Oktober auf dem höchsten Wert seit 53 Monaten.",
      "akzent": false
    },
    {
      "fett": "Nicht alle Kunden kaufen gleichzeitig.",
      "text": "Export und Investitionen ziehen, Bau und Konsum kaum. In der Steiermark ist der Aufschwung noch schwach zu spüren.",
      "akzent": false
    },
    {
      "fett": "Nicht jeder Auftrag ist Wachstum.",
      "text": "Betriebe bauen vorsorglich Lager auf, weil Lieferzeiten länger werden. Wer das als Trend liest, plant falsch.",
      "akzent": false
    },
    {
      "fett": "Den Kaufgrund kennt der Kunde.",
      "text": "Ein Vertriebs-Interview mit andi fragt. fragt Verkäufer und Kunden und liefert aus denselben Antworten Verkaufsargumente und Positionierung.",
      "akzent": true
    }
  ],
  "kennzahlen": [
    {
      "wert": "55,9",
      "einheit": "",
      "text": "Punkte erreichte der Einkaufsmanagerindex im Oktober 2026, den höchsten Wert seit 53 Monaten.",
      "quelle": "UniCredit Bank Austria, Oktober 2026"
    },
    {
      "wert": "2,3",
      "einheit": " %",
      "text": "wächst laut WIFO 2026 die Wertschöpfung der Herstellung von Waren.",
      "quelle": "WIFO-Prognose, 14.10.2026"
    },
    {
      "wert": "45",
      "einheit": " %",
      "text": "der Betriebe in investitionsgüternahen Gewerbe- und Handwerksbranchen könnten sofort zusätzliche Aufträge ausführen.",
      "quelle": "KMU Forschung Austria, 3. Quartal 2026"
    }
  ],
  "abschnitte": [
    {
      "id": "lage",
      "toc": "Was die Zahlen sagen",
      "frage": "Zieht die Industrie in Österreich 2026 wirklich wieder an?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Ja, aber langsam und nicht überall gleich. Laut den Prognosen vom 14. Oktober 2026 wächst die österreichische Wirtschaft 2026 um 0,9 % (WIFO) und 0,8 % (IHS), 2027 um 1,3 % und 1,0 %. Neu ist, wer das Wachstum trägt: Laut WIFO löst die Industrie den öffentlichen Bereich als Wachstumsträger ab."
        },
        {
          "typ": "absatz",
          "text": "Laut WIFO steigt die Wertschöpfung der Herstellung von Waren 2026 um 2,3 %, gestützt durch die Nachfrage aus dem Ausland. Die Exporte wachsen um 2,3 %, die Ausrüstungsinvestitionen um 1,9 %. Der private Konsum legt nur um 0,4 % zu, und der Bau schrumpft um 0,6 %."
        },
        {
          "typ": "balken",
          "dick": true,
          "titel": "Wo das Wachstum 2026 herkommt",
          "zeilen": [
            {
              "label": "Herstellung von Waren, Wertschöpfung",
              "wert": "2,3 %",
              "anteil": 100,
              "akzent": true
            },
            {
              "label": "Exporte",
              "wert": "2,3 %",
              "anteil": 100,
              "akzent": true
            },
            {
              "label": "Ausrüstungsinvestitionen",
              "wert": "1,9 %",
              "anteil": 83
            },
            {
              "label": "Wirtschaft gesamt (BIP)",
              "wert": "0,9 %",
              "anteil": 39
            },
            {
              "label": "Privater Konsum",
              "wert": "0,4 %",
              "anteil": 17
            }
          ],
          "fazit": "Industrie, Export und Investitionen ziehen. Konsum wächst kaum, der Bau schrumpft um 0,6 %.",
          "unterschrift": "Prognose des WIFO für 2026, reale Veränderung zum Vorjahr. Quelle: WIFO, Presseaussendung vom 14.10.2026."
        },
        {
          "typ": "absatz",
          "text": "Der Einkaufsmanagerindex der UniCredit Bank Austria stieg im Oktober 2026 auf 55,9 Punkte, den höchsten Wert seit 53 Monaten. Die Neuaufträge erreichten 57,2 Punkte und damit den höchsten Stand seit Anfang 2022, die Exportaufträge 56,2 Punkte."
        },
        {
          "typ": "begriff",
          "text": "Der Einkaufsmanagerindex zeigt jeden Monat, wie sich Aufträge, Produktion, Beschäftigung, Lager und Lieferzeiten in der österreichischen Industrie entwickeln. Werte über 50 Punkte stehen für Wachstum, Werte darunter für Rückgang."
        },
        {
          "typ": "absatz",
          "text": "Die Erholung hat aber Haken. Die Bank Austria nennt für Oktober vorsorglichen Lageraufbau und deutlich längere Lieferzeiten. Die Wirtschaftskammer hält in ihrer Zusammenfassung der Prognosen fest, dass ein Teil der jüngsten Auftragszuwächse auf Vorsorgekäufe zurückgeht. Als größtes Risiko nennen WIFO und IHS die Geopolitik, vor allem den Krieg im Nahen Osten und die hohen Energiepreise."
        },
        {
          "typ": "absatz",
          "text": "In der Steiermark ist vom Aufschwung noch wenig zu spüren. In der Konjunkturumfrage der IV Steiermark für das zweite Quartal 2026 (40 Betriebe, veröffentlicht im Juli) fiel das Geschäftsklima von plus 11 auf plus 0,5 Punkte, obwohl die Betriebe ihre Auftragsbestände besser bewerteten als zuvor. Eine neuere Umfrage lag Anfang November noch nicht vor. Ende Oktober waren beim AMS Steiermark 38.166 Menschen arbeitslos gemeldet, knapp 6 % mehr als ein Jahr davor. AMS-Landesgeschäftsführer Karl-Heinz Snobe sagt, die steirische Wirtschaft entwickle sich derzeit schwächer als erhofft."
        },
        {
          "typ": "absatz",
          "text": "Für deinen Vertrieb heißt das: Der Aufschwung kommt nicht bei allen Kunden gleichzeitig an."
        }
      ]
    },
    {
      "id": "wer",
      "toc": "Wer zuerst wieder kauft",
      "frage": "Welche Kunden kaufen im Aufschwung zuerst wieder?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Das hängt davon ab, woher die Nachfrage deiner Kunden selbst kommt. Aus den Prognosen lassen sich vier Gruppen ableiten, die du in deiner Kundenliste wahrscheinlich findest. Wie groß jede Gruppe bei dir ist, zeigen nur deine eigenen Kunden."
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "globus",
              "titel": "Kunden mit Exportgeschäft",
              "text": "Laut WIFO trägt vor allem die Auslandsnachfrage die Industrie. Die Bank Austria sah im August den Rückenwind vor allem in der Erholung der deutschen Industrie. Wer an solche Betriebe liefert, spürt das wahrscheinlich früher."
            },
            {
              "symbol": "werkzeug",
              "titel": "Kunden, die investieren",
              "text": "Die Ausrüstungsinvestitionen steigen 2026 laut WIFO um 1,9 %, laut IHS um 2,5 %. Wer Maschinen, Anlagen, Wartung oder technische Leistungen anbietet, hat hier seine Chance."
            },
            {
              "symbol": "archiv",
              "titel": "Kunden, die Lager aufbauen",
              "text": "Sie bestellen mehr, weil sie Engpässe fürchten, nicht unbedingt, weil sie mehr verkaufen. Diese Aufträge können wegfallen, sobald sich die Lieferketten beruhigen."
            },
            {
              "symbol": "abwaerts",
              "titel": "Kunden am Bau und im Konsum",
              "text": "Der Bau schrumpft 2026 weiter, der private Konsum wächst kaum. Hier hilft Geduld mehr als Druck."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Bei neuen Kunden kommt dazu: Nicht jeder sucht gerade. John Dawes vom Ehrenberg-Bass Institute schätzt als Faustregel, dass im B2B pro Quartal nur rund 5 % der möglichen Kunden einen Anbieter suchen, wenn sie ihn im Schnitt alle fünf Jahre wechseln. Wenn sie suchen, greifen sie eher zu Anbietern, an die sie sich erinnern. Bleib also auch mit denen in Kontakt, die gerade nicht kaufen."
        }
      ]
    },
    {
      "id": "warum",
      "toc": "Warum Kunden wieder kaufen",
      "frage": "Warum kaufen deine Kunden wieder, und warum ist das wichtig?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Zwei Kunden bestellen gleich viel, aber aus verschiedenen Gründen. Der eine hat volle Auftragsbücher, der andere baut Lager auf, weil er Lieferengpässe fürchtet. Für deinen Vertrieb sind das zwei verschiedene Gespräche."
        },
        {
          "typ": "tabelle",
          "kopf": [
            "Woran du es merkst",
            "Was der Kunde von dir braucht"
          ],
          "zeilen": [
            [
              "Mehr Aufträge beim Kunden",
              "Größere Mengen, regelmäßig, neue Produkte",
              "Kapazität, verlässliche Termine, einen festen Ansprechpartner"
            ],
            [
              "Vorsorge und Lageraufbau",
              "Einmalig große Bestellungen, viele Fragen zur Lieferzeit",
              "Klare Zusagen zur Lieferung, aber keine Planung auf Dauer"
            ],
            [
              "Nachgeholte Investition",
              "Anfragen zu Projekten, die lange verschoben waren",
              "Schnelle Angebote, Referenzen, Hilfe beim Entscheiden"
            ],
            [
              "Wechsel des Lieferanten",
              "Anfrage von einem Betrieb, der bisher woanders kaufte",
              "Einen Grund, warum du verlässlicher bist als der bisherige"
            ]
          ],
          "unterschrift": "Beispiele zur Veranschaulichung, keine Erhebung"
        },
        {
          "typ": "absatz",
          "text": "Wenn sich Lieferzeiten verlängern, wie es die Bank Austria für Oktober meldet, wird Liefertreue schnell selbst zum Kaufgrund. Das kann erklären, warum plötzlich neue Betriebe anfragen. Warum Kunden umgekehrt zur Konkurrenz gehen, beschreibt der Beitrag [Warum kaufen Kunden bei der Konkurrenz?](/wissen/warum-kaufen-kunden-bei-der-konkurrenz)"
        },
        {
          "typ": "vierfeld",
          "titel": "Wo steht welcher Kunde im Aufschwung?",
          "achseLinks": "Bedarf bleibt auf Dauer",
          "achseUnten": "Kunde kauft schon wieder",
          "felder": [
            {
              "kopf": "Kommt noch",
              "text": "Der Bedarf ist da, die Bestellung noch nicht. Kontakt halten, Angebot bereit haben."
            },
            {
              "kopf": "Kauft wieder, aus Bedarf",
              "text": "Hier lohnt es sich, Zeit und Kapazität einzuplanen.",
              "akzent": true
            },
            {
              "kopf": "Wartet ab",
              "text": "Kein Bedarf in Sicht, etwa am Bau. Nicht drängen, aber erreichbar bleiben."
            },
            {
              "kopf": "Kauft auf Vorrat",
              "text": "Mehr Aufträge, aber vielleicht nur vorübergehend. Nicht als Trend verbuchen."
            }
          ],
          "fazit": "Ordne deine größten Kunden in die vier Felder ein. Wo du unsicher bist, frag nach.",
          "unterschrift": "Eigene Darstellung von andi fragt. zur Veranschaulichung, keine Daten."
        },
        {
          "typ": "absatz",
          "text": "Den Kaufgrund kennt am Ende nur der Kunde. Dein Vertrieb vermutet ihn, oft richtig, manchmal nicht. Laut dem internationalen Studienanbieter Gartner verbringen B2B-Käufer nur rund 17 % ihrer Kaufzeit im Gespräch mit möglichen Anbietern, und bei komplexen Käufen entscheiden typischerweise 6 bis 10 Personen mit. Vieles passiert also, ohne dass dein Verkäufer dabei ist."
        }
      ]
    },
    {
      "id": "fehler",
      "toc": "Typische Fehler im Aufschwung",
      "frage": "Warum bringt mehr Druck im Vertrieb jetzt wenig?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Wenn die Aufträge wieder kommen, ist der Reflex verständlich: mehr anrufen, mehr Angebote, mehr Rabatt. Diese vier Fehler sind dabei typisch:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "gruppe",
              "titel": "Alle gleich behandeln",
              "text": "Wer jeden Kunden gleich oft anruft, verzettelt sich und reagiert zu spät bei denen, die schon bestellen."
            },
            {
              "symbol": "archiv",
              "titel": "Vorsorge für Wachstum halten",
              "text": "Wer Lagerkäufe als Trend liest, plant Personal und Kapazität für Aufträge, die wieder wegfallen können."
            },
            {
              "symbol": "geld",
              "titel": "Mit Rabatten nachhelfen",
              "text": "Laut Bank Austria stiegen die Einkaufspreise der Industrie im Oktober deutlich schneller als die Verkaufspreise. Ein Rabatt drückt die Marge dann zusätzlich und ist später schwer zurückzunehmen."
            },
            {
              "symbol": "handschlag",
              "titel": "Nur auf Neukunden schauen",
              "text": "Wenn Kunden wieder kaufen, greifen sie aber eher zu Anbietern, die sie kennen. Bestandskunden und frühere Kunden sind deshalb deine erste Adresse."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Für Handwerk und Gewerbe kommt dazu: Der Wettbewerb um jeden Auftrag bleibt hart. Laut KMU Forschung Austria könnten im dritten Quartal 2026 in den investitionsgüternahen Branchen, etwa Bau, Tischler, Metalltechnik oder Elektro, 45 % der Betriebe sofort zusätzliche Aufträge ausführen. Nur 20 % aller Gewerbe- und Handwerksbetriebe nannten ihre Geschäftslage gut. Wer jetzt Aufträge will, muss sagen können, warum gerade er."
        },
        {
          "typ": "absatz",
          "text": "Wo Angebote auf dem Weg zum Auftrag hängen bleiben, beschreibt der Beitrag [Abschlussquote erhöhen: Was Verkäufer und Kunden unterschiedlich sehen](/wissen/abschlussquote-erhoehen)."
        }
      ]
    },
    {
      "id": "selbst",
      "toc": "Vertrieb neu aufstellen in 5 Schritten",
      "frage": "Wie stellst du deinen Vertrieb im Aufschwung neu auf?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Du brauchst dafür kein neues CRM und keine Kampagne. Diese fünf Schritte gehst du selbst."
        },
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Sortier deine Kunden nach Nachfrage.",
              "text": "Export, Investitionen, Lager, Bau oder Konsum: Ordne jeden größeren Kunden einer Gruppe zu, nicht nach Umsatz. Wo du es nicht weißt, hast du deine erste Frage."
            },
            {
              "fett": "Schau auf die offenen Angebote.",
              "text": "Welche Angebote der letzten zwölf Monate sind weder gewonnen noch verloren? Verschobene Projekte können jetzt wieder aufgehen."
            },
            {
              "fett": "Ruf zuerst die an, die schon bestellen.",
              "text": "Frag nicht nur nach dem nächsten Auftrag, sondern warum sie wieder mehr kaufen und wie lange sie damit rechnen."
            },
            {
              "fett": "Frag deine Verkäufer.",
              "text": "Wen halten sie für kaufbereit, und warum? Schreib die Antworten auf, bevor du mit Kunden sprichst. Dann siehst du später, wo Bauchgefühl und Wirklichkeit auseinandergehen."
            },
            {
              "fett": "Schärf dein Angebot.",
              "text": "Wenn du weißt, warum Kunden kaufen, schreib genau das in Angebot, Website und Gespräch. Liefertreue, Tempo oder Beratung, je nachdem, was zählt."
            }
          ]
        },
        {
          "typ": "weg",
          "titel": "Vom Bauchgefühl zur Kundenliste",
          "schritte": [
            {
              "etikett": "Sortieren",
              "text": "Kunden nach Nachfrage ordnen",
              "notiz": "Export, Investitionen, Lager, Bau oder Konsum",
              "art": "hauch"
            },
            {
              "etikett": "Fragen",
              "text": "Verkäufer und Kunden hören",
              "notiz": "Wer kauft wieder, warum, und wie lange noch?",
              "art": "hauch"
            },
            {
              "etikett": "Schärfen",
              "text": "Angebot und Ansprache anpassen",
              "notiz": "Mit den Gründen, die deine Kunden nennen",
              "art": "dunkel"
            }
          ],
          "fazit": "Erst wissen, wer warum kauft. Dann gezielt verkaufen.",
          "unterschrift": "Eigene Empfehlung von andi fragt."
        },
        {
          "typ": "tipp",
          "text": "Frag Kunden nicht mitten im Verkaufsgespräch, warum sie kaufen. Dann klingt die Frage nach Vorbereitung für das nächste Angebot. Offener wird die Antwort oft, wenn jemand fragt, der nichts verkaufen will."
        }
      ]
    },
    {
      "id": "andi",
      "toc": "Wie andi fragt. hilft",
      "frage": "Wie zeigt ein Vertriebs-Interview, wer wieder kauft und warum?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Ein Vertriebs-Interview mit andi fragt. fragt beide Seiten: deine Verkäufer und deine Kunden. Zuerst klären wir mit dir, was du wissen musst, etwa welche Kundengruppen wieder kaufen, aus welchem Grund und wo Angebote hängen. Erst dann entstehen die Fragen."
        },
        {
          "typ": "absatz",
          "text": "Verkäufer und Kunden antworten am Handy oder am Computer, in rund 15 bis 30 Minuten. Die einzelnen Antworten lesen Menschen bei Rittler & Co in Graz, du bekommst Zusammenfassungen. Es gibt keine Auswertung je Verkäufer, Gruppen unter sechs Personen fassen wir zusammen, Freitexte ebenso. Ganz ausschließen lässt sich ein Erkennen nicht, etwa wenn jemand einen Auftrag genau beschreibt. Deshalb sagen wir vorher, wer was sieht."
        },
        {
          "typ": "absatz",
          "text": "**andi fragt. ist eine Methode der Rittler & Co GmbH aus Graz: Sie findet zuerst die richtigen Fragen für ein Unternehmen und holt dann ehrliche Antworten von Team, Kunden und Vertrieb.** Der Ablauf hat vier Schritte."
        },
        {
          "typ": "ablauf",
          "schritte": [
            {
              "verb": "fragt",
              "text": "Im Zielgespräch klären wir, welche Kunden und welche Verkäufer wir fragen und was du wissen willst."
            },
            {
              "verb": "weiß",
              "text": "Wir legen die Sicht deines Vertriebs neben die deiner Kunden: wer wieder kauft, warum, und wo Angebote hängen."
            },
            {
              "verb": "macht",
              "text": "Du bekommst einen Befund nach Kundengruppen mit den wichtigsten Ansatzpunkten für Vertrieb und Angebot."
            },
            {
              "verb": "zeigt",
              "text": "Wir stellen dir das Ergebnis vor. Aus denselben Antworten entstehen Verkaufsargumente und Sätze für deine Positionierung."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Wie das Vertriebs-Interview abläuft, steht auf der Seite [Vertriebs-Interview mit andi fragt.](/vertrieb). Wenn du vor allem deine Kunden fragen willst, passt das [Kunden-Interview](/kunden)."
        },
        {
          "typ": "karten",
          "stil": "ergebnis",
          "karten": [
            {
              "symbol": "dokument",
              "titel": "Ein Bild nach Kundengruppen",
              "text": "Wer wieder kauft, aus welchem Grund und wer noch abwartet, in den Worten deiner Kunden."
            },
            {
              "symbol": "ziel",
              "titel": "Klare Ansatzpunkte für den Vertrieb",
              "text": "Wo Angebote hängen, wen dein Team zuerst ansprechen sollte und womit."
            },
            {
              "symbol": "sprechblase",
              "titel": "Argumente für Angebot und Auftritt",
              "text": "Die Gründe, warum Kunden bei dir kaufen, als Grundlage für Website, Angebot und Messe."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Das ist die Brücke zum Marketing: Der Grund, den deine Kunden für den Kauf bei dir nennen, ist genau das Argument für Angebot, Website und Messestand. Was daraus an Aufträgen wird, hängt davon ab, was du umsetzt. Ein Interview, zweifacher Nutzen."
        },
        {
          "typ": "schnittmenge",
          "titel": "Dieselben Antworten, zweifacher Nutzen",
          "links": [
            "Wer kauft",
            "und warum"
          ],
          "rechts": [
            "Argumente",
            "und Auftritt"
          ],
          "mitte": "Interview",
          "beschreibung": "Zwei Kreise überschneiden sich. Links: wer kauft und warum, für den Vertrieb. Rechts: Argumente und Auftritt, für das Marketing. In der Mitte das Interview.",
          "fazit": "Was Kunden als Kaufgrund nennen, steuert deinen Vertrieb und gehört zugleich in dein Marketing.",
          "unterschrift": "Eigene Darstellung von andi fragt."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen zum Vertrieb im Aufschwung",
  "faq": [
    {
      "q": "Wie kann ich den Vertrieb im B2B ankurbeln?",
      "a": "Finde zuerst heraus, welche Kunden wieder kaufen und warum. Dann sprichst du diese Gruppen gezielt an, fasst offene Angebote nach und richtest dein Angebot auf den echten Kaufgrund aus."
    },
    {
      "q": "Wie gewinne ich Neukunden im B2B, wenn die Konjunktur anzieht?",
      "a": "Fang bei Branchen mit Rückenwind an, laut WIFO vor allem bei Betrieben mit Export und Investitionen. Frag vorher deine besten Bestandskunden, warum sie bei dir kaufen, und sprich mit diesen Gründen ähnliche Betriebe an."
    },
    {
      "q": "Woran erkenne ich, ob ein Kunde nur auf Vorrat bestellt?",
      "a": "Hinweise sind einmalig große Bestellungen, viele Fragen nach Lieferzeiten und der Wunsch nach festen Zusagen. Am sichersten ist, du fragst ihn. Laut Bank Austria bauten Industriebetriebe im Oktober 2026 vorsorglich Lager auf, weil Lieferzeiten länger wurden."
    },
    {
      "q": "Was gehört in eine Vertriebsstrategie für den Aufschwung?",
      "a": "Welche Kundengruppen du zuerst ansprichst, mit welchem Argument, wer wofür zuständig ist und woran du merkst, ob es wirkt. Grundlage sind die Gründe deiner Kunden, nicht Vermutungen im Team."
    },
    {
      "q": "Warum Verkäufer und Kunden fragen statt nur eine Kundenbefragung?",
      "a": "Eine Kundenbefragung zeigt dir, was Kunden denken. Erst neben der Sicht deines Vertriebs siehst du, wo Bild und Wirklichkeit auseinandergehen, etwa wenn dein Team einen Kunden für verloren hält, der nur abwartet."
    },
    {
      "q": "Was kostet ein Vertriebs-Interview mit andi fragt.?",
      "a": "Das Erstgespräch ist kostenlos. Ein Interview-Modul hat einen Fixpreis nach der Zahl der Personen, die wir fragen, von 2.900 Euro netto für Kleinbetriebe bis 7.400 Euro netto für 51 bis 100 Personen. Jedes weitere Modul kostet deutlich weniger. Alle Stufen stehen auf der [Preisseite](/preise)."
    }
  ],
  "quellen": [
    {
      "titel": "Industrie trägt die Erholung, Energiepreise dämpfen die Kaufkraft. Prognose für 2026 und 2027 (14.10.2026)",
      "url": "https://www.wifo.ac.at/wp-content/uploads/upload-3331/p_2026_10_14_1.pdf",
      "herkunft": "WIFO, Presseaussendung"
    },
    {
      "titel": "Konjunkturerholung bei weiterhin hoher Inflation. Herbst-Prognose 2026 bis 2027 (14.10.2026)",
      "url": "https://irihs.ihs.ac.at/id/eprint/7526/",
      "herkunft": "Institut für Höhere Studien (IHS)"
    },
    {
      "titel": "Leichte Erholung bei hoher Inflation. WIFO/IHS: Prognosen im Überblick 3/2026 (14.10.2026)",
      "url": "https://www.wko.at/oe/news/konjunkturprognose-wifo-ihs-3-2026.pdf",
      "herkunft": "WKO, Abteilung für Wirtschafts- und Standortpolitik"
    },
    {
      "titel": "UniCredit Bank Austria EinkaufsManagerIndex, Oktober 2026",
      "url": "https://www.bankaustria.at/files/emi_102026.pdf",
      "herkunft": "UniCredit Bank Austria"
    },
    {
      "titel": "Industrie setzt Erholung mit höherem Tempo fort (27.08.2026)",
      "url": "https://www.leadersnet.at/news/103108,industrie-setzt-erholung-mit-hoeherem-tempo-fort.html",
      "herkunft": "leadersnet, zum Einkaufsmanagerindex August 2026"
    },
    {
      "titel": "Industriekonjunktur: Es bleibt durchschnittlich (21.07.2026)",
      "url": "https://steiermark.iv.at/news/detail/industriekonjunktur-es-bleibt-durchschnittlich/",
      "herkunft": "Industriellenvereinigung Steiermark"
    },
    {
      "titel": "Der steirische Arbeitsmarkt: Oktober 2026 (02.11.2026)",
      "url": "https://www.ams.at/regionen/steiermark/news/2026/11/steirischer-arbeitsmarkt-oktober-2026",
      "herkunft": "AMS Steiermark"
    },
    {
      "titel": "Konjunkturbeobachtung Gewerbe und Handwerk, 3. Quartal 2026",
      "url": "https://www.wko.at/oe/gewerbe-handwerk/konjunkturbericht-gewerbe-handwerk-03-2026.pdf",
      "herkunft": "KMU Forschung Austria im Auftrag der WKÖ"
    },
    {
      "titel": "The B2B Buying Journey",
      "url": "https://www.gartner.com/en/sales/insights/b2b-buying-journey",
      "herkunft": "Gartner, Anbieter von Studien und Beratung für den Vertrieb"
    },
    {
      "titel": "Advertising effectiveness and the 95-5 rule (Mai 2021)",
      "url": "https://marketingscience.info/news-and-insights/advertising-effectiveness-and-the-95-5-rule-most-b2b-buyers-are-not-in-the-market-right-now",
      "herkunft": "John Dawes, Ehrenberg-Bass Institute"
    }
  ],
  "seitenleisteFrage": "Wer kauft bei dir zuerst wieder?",
  "abschlussTitel": "Wer kauft bei dir zuerst wieder?",
  "passend": [
    "abschlussquote-erhoehen",
    "warum-kaufen-kunden-bei-der-konkurrenz",
    "preiserhoehung-kunden-mitteilen"
  ]
};

export default beitrag;

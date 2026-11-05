// Beitrag Nr. 22 im Wissensbereich: /wissen/preiserhoehung-kunden-mitteilen
// Inhalte aus n13.py und grafik_n13.py (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 05.11.2026.
// Status entwurf. Belege im Projekt unter analyse/.
const beitrag = {
  "slug": "preiserhoehung-kunden-mitteilen",
  "nr": 22,
  "status": "entwurf",
  "geprueft": null,
  "erschienen": null,
  "aktualisiert": null,
  "leitartikel": false,
  "modul": "kunden",
  "etikett": "Kunden",
  "themen": [
    "Kunden",
    "Vertrieb"
  ],
  "seitentitel": "Preiserhöhung Kunden mitteilen und begründen | andi fragt.",
  "beschreibung": "Preiserhöhung Kunden mitteilen, ohne sie zu verlieren: Was Studien zu fairen Preisen zeigen, wie du im B2B begründest und warum du zuerst fragen solltest.",
  "teaser": "Warum Kunden eine Preiserhöhung fair oder unfair finden, wie du sie im B2B begründest und warum du vorher fragen solltest, wofür sie wirklich zahlen.",
  "kurztitel": "Preiserhöhung Kunden mitteilen",
  "titel": "Preiserhöhung Kunden mitteilen:",
  "titelAkzent": "Frag zuerst, wofür sie zahlen",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Titelgrafik: Drei Felder untereinander. Kosten: Energie plus 16,5 Prozent. Wert, pink hervorgehoben: Wofür Kunden zahlen. Argument: Was sie bei dir hält.",
    "unterschrift": "Kosten erklären die Erhöhung. Was den Kunden hält, ist das, wofür er bei dir zahlt.",
    "platzhalter": "Platzhalter Titelbild: Gespräch zwischen Unternehmer und Stammkunde in Werkstatt oder Produktion, 1600 x 900 px"
  },
  "titelgrafik": true,
  "kurzAntwort": "Teil eine Preiserhöhung zuerst deinen wichtigsten Kunden persönlich mit, dann schriftlich, mit Datum und einem Grund, den der Kunde prüfen kann. Studien zeigen: Kunden finden eine Erhöhung fairer, wenn sie den Grund nachvollziehen können und zufrieden mit dir sind. Kosten allein überzeugen aber nur begrenzt. Frag deshalb vorher, wofür deine Kunden wirklich zahlen, und argumentiere auch damit.",
  "wichtigstes": [
    {
      "fett": "Der Kostendruck ist echt.",
      "text": "Energie war im Oktober 2026 laut Schnellschätzung von Statistik Austria um 16,5 % teurer als ein Jahr davor. Die Erzeugerpreise lagen im September um 6,0 % über dem Vorjahr.",
      "akzent": false
    },
    {
      "fett": "Der Grund entscheidet über fair oder unfair.",
      "text": "Höhere Kosten weiterzugeben gilt in Studien meist als fair. Eine Notlage auszunutzen gilt als unfair, mehr verdienen zu wollen kommt am schlechtesten an.",
      "akzent": false
    },
    {
      "fett": "Zufriedene Kunden verzeihen mehr.",
      "text": "In Experimenten mit Studierenden schadete eine Preiserhöhung der Wiederkaufabsicht umso weniger, je zufriedener sie waren.",
      "akzent": false
    },
    {
      "fett": "Frag zuerst, wofür sie zahlen.",
      "text": "Mit andi fragt. erfährst du vorher, was Kunden an dir halten. Daraus werden auch Verkaufsargumente.",
      "akzent": true
    }
  ],
  "kennzahlen": [
    {
      "wert": "16,5",
      "einheit": " %",
      "text": "teurer war Energie im Oktober 2026 als ein Jahr davor, laut erster Schätzung.",
      "quelle": "Statistik Austria, Schnellschätzung 04.11.2026"
    },
    {
      "wert": "6,0",
      "einheit": " %",
      "text": "höher lagen die Erzeugerpreise im produzierenden Bereich im September 2026 als im Vorjahr.",
      "quelle": "Statistik Austria, 30.10.2026"
    },
    {
      "wert": "82",
      "einheit": " %",
      "text": "der befragten Konsumenten in Kanada fanden es unfair, Schneeschaufeln nach einem Schneesturm teurer zu machen.",
      "quelle": "Kahneman, Knetsch, Thaler 1986, Telefonbefragung"
    }
  ],
  "abschnitte": [
    {
      "id": "warum",
      "toc": "Warum jetzt so viele Preise steigen",
      "frage": "Warum müssen gerade jetzt so viele Betriebe ihre Preise erhöhen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Weil vor allem Energie wieder deutlich teurer geworden ist. Laut Schnellschätzung von Statistik Austria lag die Inflation im Oktober 2026 bei 3,6 %. Energie war um 16,5 % teurer als ein Jahr davor, obwohl seit 1. Oktober eine erweiterte Spritpreisbremse gilt. Im September waren laut den endgültigen Zahlen Treibstoffe um 34,8 % und Heizöl um 63,1 % teurer als im Vorjahr."
        },
        {
          "typ": "absatz",
          "text": "Was Hersteller verlangen, zeigt der Erzeugerpreisindex: Im September 2026 lag er um 6,0 % über dem Vorjahr. Energie war um 11,4 % teurer, Vorleistungsgüter wie Metalle, Halbzeug und Kunststoffe um 7,4 %. Diese Werte und die Oktoberzahlen sind vorläufig. Für Wertanpassungen in Verträgen darf die Schnellschätzung laut Statistik Austria nicht verwendet werden."
        },
        {
          "typ": "balken",
          "titel": "Wie stark die Preise im Jahresvergleich gestiegen sind",
          "dick": true,
          "zeilen": [
            {
              "label": "Verbraucherpreise gesamt, Oktober 2026",
              "wert": "3,6 %",
              "anteil": 22
            },
            {
              "label": "Energie, Oktober 2026",
              "wert": "16,5 %",
              "anteil": 100,
              "akzent": true
            },
            {
              "label": "Erzeugerpreise produzierender Bereich, September 2026",
              "wert": "6,0 %",
              "anteil": 36
            },
            {
              "label": "Vorleistungsgüter, September 2026",
              "wert": "7,4 %",
              "anteil": 45
            }
          ],
          "fazit": "Energie zieht die Kosten nach oben, und deine Lieferanten geben das weiter. Die Frage ist, wie du es weitergibst.",
          "unterschrift": "Statistik Austria: Schnellschätzung Oktober 2026 vom 04.11.2026 (endgültige Werte am 18.11.2026) und Erzeugerpreisindex September 2026 vom 30.10.2026, vorläufig. Veränderung zum Vorjahresmonat."
        },
        {
          "typ": "absatz",
          "text": "Schnell vorbei ist das nicht: Auch für 2027 erwarten WIFO und IHS noch 2,6 % und 2,8 % Inflation (Prognose vom 14. Oktober 2026)."
        },
        {
          "typ": "absatz",
          "text": "Die Frage ist deshalb oft nicht, ob du die Preise erhöhst, sondern wie. Und da entscheidet weniger die Zahl als das, was dein Kunde in ihr sieht."
        }
      ]
    },
    {
      "id": "fair",
      "toc": "Wann Kunden eine Erhöhung fair finden",
      "frage": "Wann empfinden Kunden eine Preiserhöhung als fair?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Wenn sie den Grund nachvollziehen können und nicht das Gefühl haben, ausgenutzt zu werden. Daniel Kahneman, Jack Knetsch und Richard Thaler ließen 1984 und 1985 zufällig ausgewählte Erwachsene in Toronto und Vancouver am Telefon Preisänderungen beurteilen, also Konsumenten, nicht Einkäufer (American Economic Review, 1986)."
        },
        {
          "typ": "absatz",
          "text": "Ein Baumarkt erhöht am Morgen nach einem Schneesturm den Preis für Schneeschaufeln von 15 auf 20 Dollar: 82 % fanden das unfair. Ein Händler zahlt im Einkauf 30 Cent mehr für Salat und verlangt 30 Cent mehr: 79 % fanden das akzeptabel. Ein Händler macht Erdnussbutter teurer, die er schon auf Lager hat, weil der Großhandelspreis gestiegen ist: 79 % fanden das unfair."
        },
        {
          "typ": "balken",
          "titel": "Wie viele Konsumenten eine Preiserhöhung unfair fanden",
          "dick": true,
          "zeilen": [
            {
              "label": "Schneeschaufel teurer am Morgen nach dem Schneesturm",
              "wert": "82 %",
              "anteil": 82,
              "akzent": true
            },
            {
              "label": "Erdnussbutter auf Lager teurer, weil der Großhandelspreis stieg",
              "wert": "79 %",
              "anteil": 79
            },
            {
              "label": "Salat um 30 Cent teurer, weil der Einkauf 30 Cent teurer wurde",
              "wert": "21 %",
              "anteil": 21
            }
          ],
          "fazit": "Wer höhere Kosten weitergibt, gilt meist als fair. Wer eine Notlage ausnutzt oder billig eingekaufte Ware teurer macht, nicht.",
          "unterschrift": "Kahneman, Knetsch und Thaler, American Economic Review 1986. Telefonbefragung zufällig ausgewählter Erwachsener in Toronto und Vancouver 1984 und 1985, je Frage 101 bis 147 Personen, Anteil unfair oder sehr unfair. Konsumenten, keine Einkäufer."
        },
        {
          "typ": "absatz",
          "text": "Höhere Kosten weiterzugeben, gilt also als fair. Eine Notlage auszunutzen oder Ware teurer zu machen, die schon billiger eingekauft ist, nicht. Spätere Studien mit Konsumenten haben drei weitere Punkte gezeigt:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "frage",
              "titel": "Das vermutete Motiv zählt",
              "text": "Vermuten Kunden ein schlechtes Motiv hinter der Erhöhung, finden sie dieselbe Erhöhung unfairer. Und wer sie unfair findet, will dort seltener einkaufen (Campbell, Journal of Marketing Research, 1999)."
            },
            {
              "symbol": "stern",
              "titel": "Der Ruf zählt",
              "text": "Welches Motiv Kunden vermuten, hängt auch vom Ruf ab. Wer einen guten Ruf hat, bekommt eher einen Vertrauensvorschuss (ebenda)."
            },
            {
              "symbol": "geld",
              "titel": "Kosten werden unterschätzt",
              "text": "Konsumenten halten Preise oft für deutlich höher als fair, weil sie Inflation und Kosten des Anbieters unterschätzen. Kosten zu erklären half nur mäßig (Bolton, Warlop, Alba, 2003)."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Bei Einkäufern in Firmen bestätigt sich die Grundregel weitgehend, wie der nächste Abschnitt zeigt."
        }
      ]
    },
    {
      "id": "begruenden",
      "toc": "Wie du die Erhöhung begründest",
      "frage": "Wie begründest du eine Preiserhöhung im B2B?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Mit einem Grund, den dein Kunde prüfen kann, und mit dem, was er an dir hat. Forscher der OST Ostschweizer Fachhochschule und eines Schweizer Industriezulieferers haben dazu 222 Einkäufer aus verschiedenen Branchen im deutschsprachigen Raum online gefragt (veröffentlicht vom Institut für Marketing der Universität St. Gallen, 2021)."
        },
        {
          "typ": "liste",
          "stil": "rand",
          "punkte": [
            {
              "fett": "Rohstoffe überzeugen mehr als Inflation.",
              "text": "Unter den Kostengründen fanden gestiegene Rohstoffpreise die meiste Zustimmung, Herstellkosten und vor allem ein Inflationsausgleich deutlich weniger. Die Forscher vermuten: Bei beiden bleibt offen, ob der Grund von außen kommt oder hausgemacht ist."
            },
            {
              "fett": "Eigener Vorteil ist der schlechteste Grund.",
              "text": "Am schlechtesten schnitten Motive ab, bei denen der Lieferant selbst profitiert, etwa weil er mehr verdienen will. Auch der Hinweis, dass andere Anbieter mehr verlangen, kam schlechter an als Kostengründe."
            },
            {
              "fett": "Der Nutzen hilft.",
              "text": "Relativ hohe Zustimmung fand auch das einzige Motiv, das beim Kunden ansetzt: dass das Produkt besser ist als die Alternativen."
            },
            {
              "fett": "Vertrauen ersetzt keine Erklärung.",
              "text": "Eine vertrauensvolle Beziehung half. Aber auch bei gutem Vertrauen fanden die Einkäufer die Erhöhung fairer, wenn der Grund transparent erklärt war."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Dazu passen drei Experimente mit Studierenden in Deutschland (Homburg, Hoyer, Koschate, 2005): Je zufriedener sie mit einem gedachten Restaurant waren, desto weniger schadete eine Preiserhöhung ihrer Absicht, wiederzukommen, und desto fairer fanden sie die Erhöhung. Für Einkäufer ist das nicht geprüft."
        },
        {
          "typ": "vierfeld",
          "titel": "Wo steht dein Kunde, wenn die Preiserhöhung kommt?",
          "achseLinks": "Kunde weiß, was er an dir hat",
          "achseUnten": "Grund der Erhöhung ist nachvollziehbar",
          "felder": [
            {
              "kopf": "Treu, aber verärgert",
              "text": "Der Kunde schätzt dich, versteht die Erhöhung aber nicht."
            },
            {
              "kopf": "Erhöhung, die hält",
              "text": "Der Kunde kennt deinen Wert und versteht den Grund.",
              "akzent": true
            },
            {
              "kopf": "Höchstes Risiko",
              "text": "Der Kunde sieht nur den höheren Preis."
            },
            {
              "kopf": "Verstanden, aber austauschbar",
              "text": "Der Kunde versteht die Kosten und vergleicht trotzdem."
            }
          ],
          "fazit": "Kosten erklären bringt dich nach rechts. Nach oben kommst du nur, wenn du weißt, wofür dein Kunde zahlt.",
          "unterschrift": "Eigene Darstellung von andi fragt., angelehnt an Homburg, Hoyer und Koschate (2005) und die St. Galler Studie (2021), keine Daten."
        },
        {
          "typ": "begriff",
          "text": "Preisfairness ist das Urteil deines Kunden, ob ein Preis oder eine Preisänderung angemessen ist. Es hängt nicht nur von der Höhe ab, sondern davon, warum du erhöhst, wie gut er dich kennt und was er dafür bekommt."
        }
      ]
    },
    {
      "id": "fragen",
      "toc": "Warum du zuerst fragen solltest",
      "frage": "Warum solltest du Kunden vor einer Preiserhöhung fragen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Weil du sonst rätst, was dein Kunde an dir schätzt. James Anderson, James Narus und Wouter van Rossum nennen das in der Harvard Business Review (2006) Wertvermutung: Lieferanten nehmen an, dass jeder Vorteil gegenüber dem Mitbewerb für den Kunden wertvoll ist, und betonen dann Unterschiede, die ihm wenig bringen."
        },
        {
          "typ": "absatz",
          "text": "Bei einer Preiserhöhung ist das teuer. Zum Beispiel: Du schreibst, dass du in eine neue Maschine investiert hast. Dein Kunde bleibt aber, weil dein Techniker bei einer Störung am selben Tag da ist. Das kommt im Brief gar nicht vor."
        },
        {
          "typ": "absatz",
          "text": "Vor einer Preiserhöhung solltest du deshalb vier Dinge wissen:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "geld",
              "titel": "Wofür zahlen sie wirklich?",
              "text": "Was würde deinem Kunden fehlen, wenn es dich morgen nicht mehr gäbe?"
            },
            {
              "symbol": "handschlag",
              "titel": "Was hält sie bei dir?",
              "text": "Ist es die Qualität, die Verlässlichkeit, die kurze Reaktionszeit oder ein bestimmter Mensch in deinem Team?"
            },
            {
              "symbol": "waage",
              "titel": "Womit vergleichen sie dich?",
              "text": "Mit welchem Anbieter oder welcher Lösung, und wo sehen sie dich vorne oder hinten?"
            },
            {
              "symbol": "gruppe",
              "titel": "Wer entscheidet mit?",
              "text": "Im B2B lesen oft Einkauf, Technik und Geschäftsführung dieselbe Mitteilung, und jeder achtet auf etwas anderes."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Frag das nicht im selben Gespräch, in dem du die Erhöhung ankündigst. Dann antwortet dein Kunde taktisch, weil er verhandelt. Vorher gefragt, und ohne dass seine Antwort eins zu eins bei dir landet, fällt Ehrlichkeit leichter. Rechne damit, dass du auch hörst, wo du besser werden musst."
        },
        {
          "typ": "tipp",
          "text": "Kunden, die wegen des Preises kaufen, brauchen eine andere Begründung als Kunden, die wegen deiner Leistung bleiben."
        }
      ]
    },
    {
      "id": "ankuendigen",
      "toc": "Preiserhöhung ankündigen",
      "frage": "Wie kündigst du eine Preiserhöhung an, ohne Kunden zu verlieren?",
      "bloecke": [
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Prüf deine Verträge.",
              "text": "Festpreise, Rahmenverträge, Preisgleitklauseln: Davon hängt ab, ob und ab wann du erhöhen kannst."
            },
            {
              "fett": "Sprich zuerst mit den wichtigsten Kunden.",
              "text": "Sag es persönlich und schick die Bestätigung nach. Eine Rundmail fühlt sich anders an als ein Anruf."
            },
            {
              "fett": "Nenn einen Grund, den man prüfen kann.",
              "text": "Energie, Material oder Fracht, am besten mit öffentlichen Zahlen, etwa von Statistik Austria."
            },
            {
              "fett": "Sag, was bleibt.",
              "text": "Erinner an das, wofür dein Kunde bei dir ist. Nicht an das, was du für deine Stärke hältst."
            },
            {
              "fett": "Mach Datum und Übergang klar.",
              "text": "Ab wann gilt der neue Preis, und was passiert mit bestellten Aufträgen? Kläre das vorher."
            },
            {
              "fett": "Bereite deinen Vertrieb vor.",
              "text": "Alle brauchen dieselbe Begründung und dieselben Antworten auf Einwände. Sonst erzählt jeder eine andere Geschichte."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Ein Beispiel für den Kern deines Schreibens: Ab 1. Jänner 2027 erhöhen wir unsere Preise um 4 %. Grund sind unsere Kosten für Energie und Material, die laut Statistik Austria deutlich gestiegen sind. Was bleibt: Bei einer Störung ist unser Techniker weiter am selben Tag bei dir. Bereits bestellte Aufträge liefern wir zum bisherigen Preis. Das ist ein Beispiel zur Veranschaulichung, keine Vorlage für deine Zahl."
        },
        {
          "typ": "absatz",
          "text": "Ob du in einem laufenden Vertrag erhöhen darfst, hängt davon ab, was vereinbart ist. Preisgleit- oder Wertsicherungsklauseln müssen laut Wirtschaftskammer zwischen den Vertragsteilen vereinbart werden. Die vielen OGH-Urteile zu Indexklauseln seit 2023 betreffen meist Mietverträge mit Verbrauchern und stützen sich vor allem auf das Konsumentenschutzgesetz (etwa OGH 2 Ob 36/23t vom 21. März 2023 und 1 Ob 87/25p vom 10. März 2026). Dieses Gesetz gilt nur für Geschäfte zwischen Unternehmern und Verbrauchern (Paragraf 1 KSchG). Zwischen Firmen zählt vor allem, was vereinbart ist. Aber auch dort ist eine Klausel in Geschäftsbedingungen nichtig, die eine Seite gröblich benachteiligt (Paragraf 879 Absatz 3 ABGB). Das ist keine Rechtsberatung. Lass Klauseln von der Wirtschaftskammer oder einer Anwältin prüfen."
        }
      ]
    },
    {
      "id": "andi",
      "toc": "Wie ein Kunden-Interview hilft",
      "frage": "Wie hilft dir ein Kunden-Interview vor der Preiserhöhung?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Zuerst klären wir mit dir, was du wissen musst, dann entstehen die Fragen. Wir berechnen keine Preise, wir zeigen dir, wofür deine Kunden zahlen."
        },
        {
          "typ": "absatz",
          "text": "Deine Kunden antworten anonym am Handy oder am Computer, in rund 15 bis 30 Minuten. Die Antworten lesen Menschen bei Rittler & Co in Graz, du bekommst die Zusammenfassung. Gruppen unter sechs Personen und Freitexte fassen wir zusammen. Ganz ausschließen lässt sich ein Erkennen aber nicht, etwa bei sehr konkreten Projekten."
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
              "text": "Im Zielgespräch klären wir, welche Kunden du fragen willst und was du vor der Preiserhöhung wissen musst."
            },
            {
              "verb": "weiß",
              "text": "Wir werten die Antworten aus und zeigen, wofür deine Kunden zahlen, was sie bei dir hält und womit sie dich vergleichen."
            },
            {
              "verb": "macht",
              "text": "Du bekommst einen Befund mit Argumenten für deine Begründung, in den Worten deiner Kunden und nach Kundengruppen geordnet."
            },
            {
              "verb": "zeigt",
              "text": "Wir stellen dir das Ergebnis vor. Aus denselben Antworten entstehen Verkaufsargumente für Vertrieb, Website und Angebote."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Wie das Kunden-Interview abläuft, steht auf der Seite [Kunden-Interview mit andi fragt.](/kunden). Warum Kunden still gehen, zeigt der Beitrag [Warum kaufen Kunden bei der Konkurrenz?](/wissen/warum-kaufen-kunden-bei-der-konkurrenz), woran Angebote scheitern, der Beitrag [Abschlussquote erhöhen](/wissen/abschlussquote-erhoehen)."
        },
        {
          "typ": "karten",
          "stil": "ergebnis",
          "karten": [
            {
              "symbol": "dokument",
              "titel": "Ein Befund, wofür deine Kunden zahlen",
              "text": "Was Kunden an dir schätzen, was ihnen fehlen würde und womit sie dich vergleichen, nach Themen geordnet."
            },
            {
              "symbol": "sprechblase",
              "titel": "Argumente in den Worten deiner Kunden",
              "text": "Grundlage für Gespräch und Schreiben zur Preiserhöhung, gestützt auf das, was Kunden wirklich sagen."
            },
            {
              "symbol": "stern",
              "titel": "Verkaufsargumente für neue Kunden",
              "text": "Dieselben Antworten zeigen, womit du bei Neukunden punktest, für Vertrieb, Website und Angebote."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Das ist der Unterschied zum Musterbrief: Was deine Kunden über dich sagen, trägt die Begründung der Preiserhöhung und ist zugleich das, was neue Kunden über dich hören wollen. Ein Interview, zweifacher Nutzen."
        },
        {
          "typ": "schnittmenge",
          "titel": "Dieselben Antworten, zweifacher Nutzen",
          "links": [
            "Begründung",
            "der Erhöhung"
          ],
          "rechts": [
            "Argumente",
            "im Verkauf"
          ],
          "mitte": "Interview",
          "beschreibung": "Zwei Kreise überschneiden sich. Links die Begründung der Preiserhöhung, rechts Argumente im Verkauf, in der Mitte das Interview.",
          "fazit": "Was deine Kunden an dir halten, ist auch das, was neue Kunden über dich wissen wollen.",
          "unterschrift": "Eigene Darstellung von andi fragt."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen zur Preiserhöhung bei Kunden",
  "faq": [
    {
      "q": "Wie teile ich meinen Kunden eine Preiserhöhung mit?",
      "a": "Wichtige Kunden zuerst persönlich, danach schriftlich. Nenn den neuen Preis, das Datum, einen Grund, den der Kunde prüfen kann, und was für bestellte Aufträge gilt. Und sag, was ihm bei dir bleibt."
    },
    {
      "q": "Soll ich die Inflation als Grund für eine Preiserhöhung nennen?",
      "a": "Allein eher nicht. In einer Studie mit 222 Einkäufern aus dem deutschsprachigen Raum überzeugte ein Inflationsausgleich deutlich weniger als gestiegene Rohstoffpreise. Sag lieber konkret, welche Kosten gestiegen sind, und nenn öffentliche Zahlen dazu."
    },
    {
      "q": "Darf ich die Preise in einem laufenden Vertrag erhöhen?",
      "a": "Das hängt davon ab, was vereinbart ist, etwa eine Preisgleit- oder Wertsicherungsklausel. Die OGH-Urteile zu Indexklauseln seit 2023 betreffen vor allem Verbraucher und das Konsumentenschutzgesetz, das zwischen Unternehmern nicht gilt (Paragraf 1 KSchG). Gröblich benachteiligende Klauseln in Geschäftsbedingungen sind aber auch zwischen Firmen nichtig (Paragraf 879 ABGB). Das ist keine Rechtsberatung."
    },
    {
      "q": "Berechnet andi fragt. auch meine neuen Preise?",
      "a": "Nein. Wir berechnen keine Preise und sagen dir nicht, um wie viel du erhöhen sollst. Das Kunden-Interview zeigt dir, wofür deine Kunden zahlen und was sie bei dir hält."
    },
    {
      "q": "Was kostet ein Kunden-Interview mit andi fragt.?",
      "a": "Das Erstgespräch ist kostenlos. Ein Interview-Modul hat einen Fixpreis nach der Zahl der Personen, die wir fragen, von 2.900 Euro netto für Kleinbetriebe bis 7.400 Euro netto für 51 bis 100 Personen. Jedes weitere Modul kostet deutlich weniger. Alle Stufen stehen auf der [Preisseite](/preise)."
    }
  ],
  "quellen": [
    {
      "titel": "Inflation in Österreich im Oktober 2026 laut Schnellschätzung bei 3,6 % (04.11.2026)",
      "url": "https://www.statistik.at/fileadmin/announcement/2026/11/20261104VPIFlashEstimateOktober2026.pdf",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "Inflation in Österreich im September 2026 bei 3,6 % (16.10.2026)",
      "url": "https://www.statistik.at/fileadmin/announcement/2026/10/20261016VPISeptember2026.pdf",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "Erzeugerpreise im produzierenden Bereich im September 2026 um 6,0 % über Vorjahr (30.10.2026)",
      "url": "https://www.statistik.at/fileadmin/announcement/2026/10/20261030EPISeptember2026.pdf",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "Konjunkturprognose von WIFO und IHS 3/2026 (14.10.2026)",
      "url": "https://www.wko.at/oe/news/konjunkturprognose-wifo-ihs-3-2026.pdf",
      "herkunft": "WKO"
    },
    {
      "titel": "Fairness as a Constraint on Profit Seeking: Entitlements in the Market (1986)",
      "url": "https://eml.berkeley.edu/~saez/course131/Kahneman-FairnessConstraintProfit-1986.pdf",
      "herkunft": "Kahneman, Knetsch, Thaler, American Economic Review"
    },
    {
      "titel": "Perceptions of Price Unfairness: Antecedents and Consequences (1999)",
      "url": "https://doi.org/10.2307/3152092",
      "herkunft": "Campbell, Journal of Marketing Research"
    },
    {
      "titel": "Consumer Perceptions of Price (Un)Fairness (2003)",
      "url": "https://ideas.repec.org/a/oup/jconrs/v29y2003i4p474-91.html",
      "herkunft": "Bolton, Warlop, Alba, Journal of Consumer Research"
    },
    {
      "titel": "Customers' Reactions to Price Increases (2005)",
      "url": "https://studysites.uk.sagepub.com/clow/study/articles/PDFs/06_Homburg.pdf",
      "herkunft": "Homburg, Hoyer, Koschate, Journal of the Academy of Marketing Science"
    },
    {
      "titel": "Successfully Implement Price Increases for Industrial Goods (2021)",
      "url": "https://imc.unisg.ch/en/successfully-implement-price-increases-for-industrial-goods/",
      "herkunft": "Institut für Marketing und Customer Insight, Universität St. Gallen"
    },
    {
      "titel": "Customer Value Propositions in Business Markets (2006)",
      "url": "https://hbr.org/2006/03/customer-value-propositions-in-business-markets",
      "herkunft": "Harvard Business Review"
    },
    {
      "titel": "Preisgleit- oder Wertsicherungsklauseln in Dienstleistungs- oder Lieferverträgen",
      "url": "https://www.wko.at/gewerbe-handwerk/mechatroniker/preisgleit-wertsicherungsklauseln",
      "herkunft": "WKO"
    },
    {
      "titel": "Wertsicherung beim Bestandvertrag, OGH 1 Ob 87/25p (10.03.2026)",
      "url": "https://www.ogh.gv.at/entscheidungen/entscheidungen-ogh/wertsicherung-beim-bestandvertrag/",
      "herkunft": "Oberster Gerichtshof"
    },
    {
      "titel": "Klauselentscheidung des OGH zu Wertsicherungsklauseln, 2 Ob 36/23t (2023)",
      "url": "https://kpmg.com/at/de/media/newsletter/tax-news/2023/06/tn-12-klauselentscheidung-des-ogh.html",
      "herkunft": "KPMG Österreich"
    },
    {
      "titel": "Konsumentenschutzgesetz, Paragraf 1",
      "url": "https://www.jusline.at/gesetz/kschg/paragraf/1",
      "herkunft": "KSchG über JUSLINE"
    },
    {
      "titel": "Konsumentenschutzgesetz, Paragraf 6",
      "url": "https://gesetzefinden.at/bundesrecht/bundesgesetze/kschg/para-6",
      "herkunft": "KSchG über gesetzefinden.at"
    },
    {
      "titel": "Allgemeines bürgerliches Gesetzbuch, Paragraf 879",
      "url": "https://www.jusline.at/gesetz/abgb/paragraf/879",
      "herkunft": "ABGB über JUSLINE"
    }
  ],
  "seitenleisteFrage": "Wofür zahlen deine Kunden wirklich?",
  "abschlussTitel": "Wofür zahlen deine Kunden wirklich?",
  "passend": [
    "warum-kaufen-kunden-bei-der-konkurrenz",
    "abschlussquote-erhoehen",
    "vertrieb-ankurbeln"
  ]
};

export default beitrag;

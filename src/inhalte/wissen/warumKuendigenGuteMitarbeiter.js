// Beitrag Nr. 3 im Wissensbereich: /wissen/warum-kuendigen-gute-mitarbeiter
// Inhalte aus dem Prototyp WissenKuendigung.dc.html (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 31.10.2026.
// Aufbau und Bausteine: uebergabe/wissen-layout.md. status: "entwurf" bis zur Freigabe durch Alfons, dann "freigegeben"
// und erschienen setzen. Inline: **fett**, [Text](/pfad), [[Platzhalter]].
const beitrag = {
  "slug": "warum-kuendigen-gute-mitarbeiter",
  "nr": 3,
  "status": "freigegeben",
  "geprueft": "2026-10-31",
  "erschienen": "2026-11-01",
  "aktualisiert": null,
  "leitartikel": false,
  "modul": "team",
  "etikett": "Team",
  "themen": [
    "Team",
    "Positionierung"
  ],
  "seitentitel": "Warum kündigen gute Mitarbeiter? 5 Gründe | andi fragt.",
  "beschreibung": "Gute Leute kündigen selten aus heiterem Himmel. Warum sie gehen, warum sie es dir vorher nicht sagen und wie du es erfährst, solange du noch handeln kannst.",
  "teaser": "Gute Leute kündigen selten aus heiterem Himmel. Warum sie gehen und wie du es erfährst, solange du noch handeln kannst.",
  "kurztitel": "Warum gute Mitarbeiter kündigen",
  "titel": "Warum kündigen gute Mitarbeiter?",
  "titelAkzent": "Was sie dir vorher nicht sagen",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Mitarbeiterin in einer Werkstatt, nachdenklich am Arbeitsplatz",
    "unterschrift": "Die Entscheidung zu gehen fällt meist lange vor der Kündigung.",
    "platzhalter": "Platzhalter Titelbild: Mitarbeitende im Arbeitsalltag eines KMU, 1600 x 900 px"
  },
  "kurzAntwort": "Gute Mitarbeiter kündigen meist, weil sich über Monate Gründe ansammeln: fehlende Perspektive, Dauerdruck, zu wenig Mitsprache oder eine Führung, die nicht nachfragt. Gesagt wird das kaum, weil Ansprechen riskant wirkt. Wer die Gründe rechtzeitig erfahren will, muss so fragen, dass ehrliche Antworten keine Folgen haben.",
  "wichtigstes": [
    {
      "fett": "Viele Kündigungen wären vermeidbar.",
      "text": "In einer Gallup-Studie aus den USA sagten 42 % der Beschäftigten, die freiwillig gegangen waren, ihr Abgang hätte sich verhindern lassen.",
      "akzent": false
    },
    {
      "fett": "Oft hat niemand gefragt.",
      "text": "Bei 45 % aller freiwillig Gegangenen hatte in den drei Monaten davor keine Führungskraft von sich aus über Zufriedenheit oder Zukunft gesprochen.",
      "akzent": false
    },
    {
      "fett": "Im Austrittsgespräch kommt die Wahrheit zu spät.",
      "text": "Wer geht, nennt lieber das Gehalt als die Führung und will keine Brücken abbrechen.",
      "akzent": false
    },
    {
      "fett": "Ehrliche Gründe brauchen eine neutrale Stelle.",
      "text": "Mit andi fragt. erfährst du sie gebündelt und ohne Namen, solange du noch etwas ändern kannst.",
      "akzent": true
    }
  ],
  "kennzahlen": [
    {
      "wert": "42",
      "einheit": " %",
      "text": "der freiwillig Gegangenen sagen: Mein Abgang wäre vermeidbar gewesen.",
      "quelle": "Gallup 2024, USA"
    },
    {
      "wert": "45",
      "einheit": " %",
      "text": "wurden in den 3 Monaten davor von keiner Führungskraft auf Zufriedenheit oder Zukunft angesprochen.",
      "quelle": "Gallup 2024, USA"
    },
    {
      "wert": "9",
      "einheit": " %",
      "text": "der Beschäftigten in Österreich sind emotional an ihren Betrieb gebunden.",
      "quelle": "Gallup 2025, Österreich"
    }
  ],
  "abschnitte": [
    {
      "id": "gruende",
      "toc": "5 Gründe, warum gute Leute gehen",
      "frage": "Warum kündigen gute Mitarbeiter wirklich?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Den einen Grund gibt es selten. Diese fünf begegnen uns in Betrieben immer wieder, meist in Kombination:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "perspektive",
              "titel": "Keine Perspektive",
              "text": "Wer gut ist, will sich entwickeln. Sieht er keinen nächsten Schritt, sucht er ihn woanders."
            },
            {
              "symbol": "druck",
              "titel": "Dauerdruck",
              "text": "Wenn Stellen unbesetzt bleiben, tragen die Guten die Last. Laut WKO-Fachkräfteradar 2026 berichten rund 82 % der Betriebe mit Fachkräftemangel von höherer Arbeitsintensität."
            },
            {
              "symbol": "stumm",
              "titel": "Nicht gefragt werden",
              "text": "Wer bei Entscheidungen über die eigene Arbeit nicht mitreden darf, löst sich innerlich."
            },
            {
              "symbol": "fuehrung",
              "titel": "Eine Führung, die nicht nachfragt",
              "text": "Nicht böser Wille, sondern fehlende Gespräche: Probleme bleiben liegen, bis jemand geht."
            },
            {
              "symbol": "geld",
              "titel": "Geld",
              "anlass": "Oft nur der Anlass",
              "text": "Ein besseres Angebot gibt oft den letzten Ausschlag. Der eigentliche Grund liegt häufig früher."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Auch die Zahlen für Österreich zeigen dieses Muster. Laut Arbeitsklima Index der Arbeiterkammer Oberösterreich will rund ein Sechstel der Beschäftigten den Betrieb wechseln. Unter allen, die Beruf oder Betrieb wechseln wollen, berichten 36 % von Zeitdruck (Juli 2025). Wer mit seinen Möglichkeiten zur Mitbestimmung unzufrieden ist, denkt laut derselben Reihe fast dreimal so häufig an einen Jobwechsel (November 2024)."
        },
        {
          "typ": "absatz",
          "text": "Dazu kommt eine geringe Bindung: Nach Gallup waren 2025 in Österreich nur 9 % der Beschäftigten emotional engagiert, und 64 % hielten die Zeit für günstig, einen neuen Job zu finden. Für gute Leute ist ein Wechsel also kein Sprung ins Ungewisse."
        }
      ]
    },
    {
      "id": "schweigen",
      "toc": "Warum Mitarbeitende schweigen",
      "frage": "Warum sagen Mitarbeitende dem Chef nicht, dass sie unzufrieden sind?",
      "bloecke": [
        {
          "typ": "begriff",
          "text": "Innere Kündigung beschreibt den Zustand, in dem Mitarbeitende nur noch das Nötigste tun und sich vom Unternehmen gelöst haben, oft lange bevor sie tatsächlich kündigen."
        },
        {
          "typ": "absatz",
          "text": "Weil Ansprechen riskant wirkt. In einer kleinen Studie von Frances Milliken und Kolleginnen (2003) hatten 34 von 40 Befragten ein wichtiges Thema gegenüber ihrer Führung mindestens einmal verschwiegen, vor allem aus Angst, als negativ zu gelten, oder aus Sorge um die Beziehung."
        },
        {
          "typ": "figuren",
          "titel": "34 von 40 Befragten haben ein wichtiges Thema gegenüber ihrer Führung verschwiegen",
          "gesamt": 40,
          "markiert": 34,
          "spalten": 10,
          "beschreibung": "40 Figuren, davon 34 in Pink: 34 von 40 Befragten haben mindestens einmal geschwiegen, 6 nicht.",
          "legende": [
            {
              "farbe": "akzent",
              "text": "hat mindestens einmal geschwiegen"
            },
            {
              "farbe": "#c9c6c3",
              "text": "hat alles angesprochen"
            }
          ],
          "unterschrift": "Kleine Interviewstudie mit 40 Beschäftigten. Quelle: Milliken, Morrison und Hewlin, 2003."
        },
        {
          "typ": "absatz",
          "text": "Und wenn jemand geht, wird es nicht ehrlicher. In einer Studie, die David Allen 2008 für die SHRM Foundation zitiert, nannten Ausscheidende im Austrittsgespräch zu 38 % das Gehalt und nur zu 4 % die Führung. Eineinhalb Jahre später, mit Abstand befragt, waren es 12 % und 24 %. Wer geht, will ein gutes Zeugnis und keine Brücken abbrechen."
        },
        {
          "typ": "verlauf",
          "stil": "rahmen",
          "titel": "Was Ausscheidende als Grund nennen, je nachdem wann man fragt",
          "links": "Im Austrittsgespräch",
          "rechts": "Eineinhalb Jahre später",
          "max": 40,
          "linien": [
            {
              "name": "Gehalt",
              "von": 38,
              "bis": 12
            },
            {
              "name": "Führung",
              "von": 4,
              "bis": 24,
              "akzent": true
            }
          ],
          "beschreibung": "Im Austrittsgespräch nennen 38 Prozent das Gehalt und 4 Prozent die Führung. Eineinhalb Jahre später sind es 12 Prozent für das Gehalt und 24 Prozent für die Führung.",
          "unterschrift": "Genannter Hauptgrund für die Kündigung. Mit Abstand rückt die Führung nach vorne, das Gehalt nach hinten. Quelle: zitiert bei David G. Allen, Retaining Talent, SHRM Foundation 2008."
        }
      ]
    },
    {
      "id": "kosten",
      "toc": "Was eine Kündigung kostet",
      "frage": "Was kostet es, wenn gute Mitarbeiter gehen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Mehr, als die meisten rechnen. Gallup schätzt die Kosten einer Nachbesetzung vorsichtig auf das halbe bis doppelte Jahresgehalt (2019). Je nach Rolle sind es bei Führungskräften rund 200 %, bei technischen Fachkräften rund 80 % und in Positionen mit direktem Kundenkontakt rund 40 % des Jahresgehalts (2024). Die Zahlen stammen aus den USA, für Österreich sind uns keine vergleichbaren Erhebungen bekannt."
        },
        {
          "typ": "balken",
          "titel": "Was eine Nachbesetzung kostet, in Prozent des Jahresgehalts",
          "zeilen": [
            {
              "label": "Führungskräfte",
              "wert": "rund 200 %",
              "anteil": 100,
              "akzent": true
            },
            {
              "label": "Technische Fachkräfte",
              "wert": "rund 80 %",
              "anteil": 40
            },
            {
              "label": "Direkter Kundenkontakt",
              "wert": "rund 40 %",
              "anteil": 20
            }
          ],
          "rechner": {
            "label": "Rechne mit einem Jahresgehalt aus deinem Betrieb",
            "einheit": "Euro",
            "zusatz": "brutto im Jahr",
            "min": 25000,
            "max": 120000,
            "step": 1000,
            "start": 50000,
            "ergebnisse": [
              {
                "name": "Kundenkontakt",
                "faktor": 0.4
              },
              {
                "name": "Technische Fachkraft",
                "faktor": 0.8
              },
              {
                "name": "Führungskraft",
                "faktor": 2,
                "dunkel": true
              }
            ]
          },
          "unterschrift": "Grobe Schätzung mit den Faktoren von Gallup (2024), Werte aus den USA. Was es in deinem Betrieb wirklich kostet, hängt von Suche, Einarbeitung und Ausfallzeit ab."
        },
        {
          "typ": "absatz",
          "text": "Rechne es für deinen Betrieb selbst nach: Suche und Inserate, Einarbeitung, Mehrarbeit im Team, Fehler in der Übergangszeit und das Wissen, das mit der Person geht. Leichter wird die Nachbesetzung nicht. Laut WKO-Fachkräfteradar 2026 spüren 78 % der befragten Betriebe einen Fachkräftemangel, hochgerechnet sind rund 155.000 Stellen für Fachkräfte offen."
        },
        {
          "typ": "zitat",
          "text": "Jede Kündigung, die du verhinderst, ist die billigste Stelle, die du je besetzt."
        }
      ]
    },
    {
      "id": "selbst",
      "toc": "Was du selbst tun kannst",
      "frage": "Was kannst du selbst tun, damit gute Leute bleiben?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Vieles liegt in deiner Hand, und es beginnt mit Fragen, nicht mit Benefits. Entscheidend ist der Zeitpunkt."
        },
        {
          "typ": "zeitstrahl",
          "stil": "rahmen",
          "titel": "Wie aus Unzufriedenheit eine Kündigung wird",
          "legende": [
            {
              "farbe": "akzent",
              "form": "balken",
              "text": "Hier wirken Bleibegespräch und Team-Interview"
            },
            {
              "farbe": "dunkel",
              "form": "balken",
              "text": "Hier kommt das Austrittsgespräch"
            }
          ],
          "stufen": [
            {
              "titel": "Ärger bleibt unausgesprochen",
              "text": "Ansprechen wirkt riskant, also schweigt man.",
              "phase": "handeln"
            },
            {
              "titel": "Leise Signale",
              "text": "Weniger Vorschläge, kein Widerspruch, Rückzug.",
              "phase": "handeln"
            },
            {
              "titel": "Innere Kündigung",
              "text": "Nur noch das Nötigste, die Entscheidung reift.",
              "phase": "handeln"
            },
            {
              "titel": "Jobsuche",
              "text": "Ein besseres Angebot gibt den Ausschlag.",
              "phase": "spaet"
            },
            {
              "titel": "Kündigung",
              "text": "Genannt wird oft das Gehalt.",
              "phase": "ende"
            }
          ],
          "unterschrift": "Schematische Darstellung, vereinfacht. Nicht jede Kündigung folgt diesem Verlauf."
        },
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Führ Bleibegespräche, nicht nur Austrittsgespräche.",
              "text": "Frag deine besten Leute, was sie hält und was sie bremst, solange sie noch da sind."
            },
            {
              "fett": "Frag nach Perspektive, nicht nur nach Zufriedenheit.",
              "text": "Wo will jemand in zwei Jahren stehen, und sieht er diesen Weg bei dir?"
            },
            {
              "fett": "Gib Mitsprache bei der eigenen Arbeit.",
              "text": "Wer über Abläufe, Werkzeuge und Prioritäten mitreden darf, bleibt eher."
            },
            {
              "fett": "Achte auf leise Signale.",
              "text": "Weniger Vorschläge, kein Widerspruch mehr, Rückzug aus freiwilligen Aufgaben. Sicher ist keines davon, aber jedes ist einen Gesprächsanlass wert."
            },
            {
              "fett": "Reagier sichtbar auf das, was du hörst.",
              "text": "Wer einmal erlebt, dass Offenheit etwas bewirkt, spricht beim nächsten Mal früher."
            }
          ]
        },
        {
          "typ": "tipp",
          "text": "Zwei Fragen für dein nächstes Mitarbeitergespräch: Was müsste passieren, damit du in zwei Jahren noch gerne hier bist? Und: Was würde dich zum Gehen bringen?"
        }
      ]
    },
    {
      "id": "grenzen",
      "toc": "Wo das an Grenzen stößt",
      "frage": "Warum reicht das Mitarbeitergespräch allein nicht?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Gespräche sind wichtig. Bei den heiklen Themen stoßen sie an eine Grenze: Gegenüber sitzt die Person, die beurteilt, befördert und das Gehalt verhandelt."
        },
        {
          "typ": "liste",
          "stil": "rand",
          "punkte": [
            {
              "fett": "Die Hierarchie hört mit.",
              "text": "Kritik an der Führung sagt man der Führung selten ins Gesicht."
            },
            {
              "fett": "Im kleinen Betrieb kennt jeder jeden.",
              "text": "Gerade deshalb sagt dem Chef niemand alles. Ehrlichkeit braucht das Gefühl, nicht erkennbar zu sein."
            },
            {
              "fett": "Das Austrittsgespräch kommt zu spät.",
              "text": "Dann ist die Entscheidung gefallen, und die Antworten sind geschönt."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Anonymität hilft: Eine Auswertung von 61 Studien zeigte, dass Menschen, die allein und anonym am Computer antworten, kaum sozial erwünscht antworten (Richman und Kollegen, 1999). Unsere Einschätzung aus der Praxis: Glaubwürdig ist Anonymität vor allem dann, wenn nicht die eigene Firma die Antworten liest."
        },
        {
          "typ": "absatz",
          "text": "Eine Mitarbeiterbefragung zeigt gut, wie die Stimmung ist. Das Team-Interview setzt dort an, wo sie aufhört: bei den Gründen, warum gute Leute bleiben oder gehen würden."
        },
        {
          "typ": "tabelle",
          "kopf": [
            "Mitarbeiterbefragung",
            "Team-Interview mit andi fragt."
          ],
          "zeilen": [
            [
              "Stärke",
              "zeigt die Stimmung, gut vergleichbar über Jahre",
              "zeigt die Gründe hinter der Stimmung"
            ],
            [
              "Welche Fragen?",
              "ein bewährter Fragenkatalog",
              "zuerst die Fragen, die für deinen Betrieb zählen, dann das Interview"
            ],
            [
              "Was zählt?",
              "der Durchschnitt",
              "wo deine Einschätzung und die deines Teams auseinandergehen"
            ],
            [
              "Was kommt heraus?",
              "ein Stimmungsbild",
              "drei Prioritäten und Sätze für deine Arbeitgebermarke"
            ]
          ],
          "unterschrift": "Mitarbeiterbefragung und Team-Interview mit andi fragt. im Vergleich"
        }
      ]
    },
    {
      "id": "andi",
      "toc": "Wie andi fragt. hilft",
      "frage": "Wie hilft andi fragt., die Gründe vorher zu erfahren?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Im Zielgespräch zum Projektstart halten wir zuerst deine Einschätzung fest: Was glaubst du, warum Leute bleiben oder gehen? Danach fragen wir dein Team und legen beide Bilder nebeneinander. Wo sie am weitesten auseinanderliegen, liegt meist der wichtigste Hebel."
        },
        {
          "typ": "hantel",
          "titel": "So zeigen wir dir, wo deine Sicht und die deines Teams auseinandergehen",
          "legende": [
            {
              "farbe": "dunkel",
              "text": "Deine Einschätzung im Zielgespräch"
            },
            {
              "farbe": "akzent",
              "text": "Antworten deines Teams"
            }
          ],
          "skala": [
            "wenig zufrieden",
            "sehr zufrieden"
          ],
          "hebelText": "größter Hebel",
          "zeilen": [
            {
              "label": "Perspektive",
              "a": 76,
              "b": 32,
              "hebel": true
            },
            {
              "label": "Arbeitslast",
              "a": 62,
              "b": 44
            },
            {
              "label": "Mitsprache",
              "a": 70,
              "b": 48
            },
            {
              "label": "Führung",
              "a": 78,
              "b": 64
            },
            {
              "label": "Gehalt",
              "a": 56,
              "b": 52
            }
          ],
          "unterschrift": "Beispiel zur Veranschaulichung, keine echten Daten. In diesem Beispiel schätzt die Geschäftsführung die Perspektive im Betrieb deutlich besser ein als das Team: Dort setzt du zuerst an."
        },
        {
          "typ": "absatz",
          "text": "Du siehst nicht, wer was geantwortet hat. Eine Gruppe werten wir erst ab 6 Personen aus, kleinere Bereiche fassen wir zusammen. Die Antworten lesen nur wir bei Rittler & Co in Graz, du bekommst sie gebündelt."
        },
        {
          "typ": "zitat",
          "text": "Unangenehme Antworten sind die wertvollsten. Sonst erfährst du sie erst mit der Kündigung."
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
              "text": "Im Zielgespräch klären wir, was du über dein Team wissen musst. Daraus entsteht ein Interview, das jede und jeder während der Arbeitszeit am Handy oder Computer beantworten kann."
            },
            {
              "verb": "weiß",
              "text": "Wir lesen jede Antwort selbst und suchen nicht den Durchschnitt, sondern die Stellen, an denen deine Sicht und die deines Teams auseinandergehen."
            },
            {
              "verb": "macht",
              "text": "Daraus werden drei Prioritäten statt einer Liste mit 40 Baustellen, dazu Sätze für Stellenanzeigen in den Worten deines Teams."
            },
            {
              "verb": "zeigt",
              "text": "Wir präsentieren dir die Ergebnisse persönlich und helfen dir, sie dem Team zurückzumelden. Nach sechs Monaten zeigt ein kurzer Puls, was sich bewegt hat."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Alles zum Ablauf steht auf der Seite zum [anonymen Team-Interview](/team). Wie aus denselben Antworten deine Arbeitgebermarke entsteht, zeigt der Leitartikel [wie aus Mitarbeiterstimmen Marketing wird](/wissen/mitarbeiterbefragung-ergebnisse)."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen, wenn gute Mitarbeiter kündigen",
  "faq": [
    {
      "q": "Woran erkenne ich, dass ein guter Mitarbeiter kündigen will?",
      "a": "Sicher erkennt man es nie. Häufige Signale sind weniger Vorschläge, kein Widerspruch mehr in Besprechungen und Rückzug aus freiwilligen Aufgaben. Jedes davon ist ein Anlass für ein offenes Gespräch, kein Beweis."
    },
    {
      "q": "Bringen Austrittsgespräche etwas?",
      "a": "Sie zeigen Tendenzen, kommen aber zu spät und sind oft geschönt. Wer geht, nennt eher äußere Gründe wie das Gehalt als Kritik an der Führung. Wertvoller ist es, die Gründe zu erfahren, solange die Leute noch da sind."
    },
    {
      "q": "Muss der Betriebsrat einem anonymen Team-Interview zustimmen?",
      "a": "Der Oberste Gerichtshof hat 2004 entschieden (9 ObA 114/04m): Ein Fragebogen braucht nach Paragraf 96 Absatz 1 Ziffer 2 Arbeitsverfassungsgesetz keine Zustimmung des Betriebsrats, wenn der Arbeitgeber keinen Einblick in einzelne Antworten bekommt und nur zusammengefasste Ergebnisse sieht. So ist das Team-Interview aufgebaut. Die Informations- und Mitwirkungsrechte des Betriebsrats bleiben bestehen, deshalb binden wir ihn früh ein. Das ist keine Rechtsberatung, lass es im Einzelfall prüfen."
    },
    {
      "q": "Ab wie vielen Mitarbeitenden ist das sinnvoll?",
      "a": "Eine Gruppe werten wir erst ab 6 Personen aus, kleinere Bereiche fassen wir zusammen. In sehr kleinen Teams sagen wir dir offen, wenn sich manches trotzdem zuordnen ließe, und empfehlen dann eher zuerst das Kunden-Interview."
    },
    {
      "q": "Was kostet ein Team-Interview mit andi fragt.?",
      "a": "Es gibt Fixpreise nach Gruppengröße, zum Beispiel 5.400 Euro netto für 21 bis 50 Personen und 7.400 Euro netto für 51 bis 100 Personen. Alle Stufen stehen auf der Preisseite, das Erstgespräch vorab ist kostenlos."
    }
  ],
  "quellen": [
    {
      "titel": "Employee Turnover: Preventable, Yet Often Ignored (2024)",
      "url": "https://www.gallup.com/workplace/646538/employee-turnover-preventable-often-ignored.aspx",
      "herkunft": "Gallup"
    },
    {
      "titel": "This Fixable Problem Costs U.S. Businesses $1 Trillion (2019)",
      "url": "https://www.gallup.com/workplace/247391/fixable-problem-costs-businesses-trillion.aspx",
      "herkunft": "Gallup"
    },
    {
      "titel": "State of the Global Workplace 2026, Österreich",
      "url": "https://www.gallup.com/workplace/704498/state-global-workplace-austria-country-level-data.aspx",
      "herkunft": "Gallup"
    },
    {
      "titel": "Arbeitsklima Index, Pressekonferenz Juli 2025",
      "url": "https://ooe.arbeiterkammer.at/service/presse/PKU_2025-07-15_Arbeitsklima-Index_Jung-motiviert-und-wechsel.pdf",
      "herkunft": "Arbeiterkammer Oberösterreich"
    },
    {
      "titel": "Arbeitsklima Index zur Mitbestimmung, November 2024",
      "url": "https://www.vienna.at/studie-job-wechsel-wird-durch-zu-wenig-mitbestimmung-begunstigt/9056929",
      "herkunft": "APA, vienna.at"
    },
    {
      "titel": "Retaining Talent (2008)",
      "url": "https://wisp.gensler.com/wp-content/uploads/2020/03/Retaining-Talent.pdf",
      "herkunft": "David G. Allen, SHRM Foundation"
    },
    {
      "titel": "Fachkräfteradar 2026",
      "url": "https://www.wko.at/fachkraefte/arbeitskraefteradar",
      "herkunft": "Wirtschaftskammer Österreich"
    },
    {
      "titel": "OGH 9 ObA 114/04m vom 15.12.2004",
      "url": "https://www.jusline.at/entscheidung/288329.pdf",
      "herkunft": "JUSLINE"
    }
  ],
  "seitenleisteFrage": "Weißt du, was dein Team hält?",
  "abschlussTitel": "Was hält deine besten Leute?",
  "passend": [
    "alleinstellungsmerkmal-finden",
    "mitarbeiterbefragung-ergebnisse",
    "warum-kaufen-kunden-bei-der-konkurrenz"
  ],
  "titelgrafik": true
};

export default beitrag;

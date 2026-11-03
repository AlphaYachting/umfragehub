// Beitrag Nr. 0 im Wissensbereich: /wissen/mitarbeiterbefragung-ergebnisse
// Inhalte aus dem Prototyp WissenBeitrag.dc.html (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 31.10.2026.
// Aufbau und Bausteine: uebergabe/wissen-layout.md. status: "entwurf" bis zur Freigabe durch Alfons, dann "freigegeben"
// und erschienen setzen. Inline: **fett**, [Text](/pfad), [[Platzhalter]].
const beitrag = {
  "slug": "mitarbeiterbefragung-ergebnisse",
  "nr": 0,
  "status": "freigegeben",
  "geprueft": "2026-11-01",
  "erschienen": "2026-11-01",
  "aktualisiert": null,
  "leitartikel": true,
  "modul": "team",
  "etikett": "Leitartikel",
  "themen": [
    "Team",
    "Positionierung",
    "Kunden",
    "Vertrieb"
  ],
  "seitentitel": "Mitarbeiterbefragung: Ergebnisse, die wirken | andi fragt.",
  "beschreibung": "Warum Ergebnisse von Mitarbeiterbefragungen in der Schublade landen, was du dagegen tun kannst und wie aus den Antworten Positionierung und Marketing wird.",
  "teaser": "Warum so viele Befragungen ohne Folgen bleiben, was du selbst dagegen tun kannst und wie aus denselben Antworten Positionierung, Arbeitgebermarke und Verkaufsargumente werden.",
  "kurztitel": "Mitarbeiterbefragung: Ergebnisse und Marketing",
  "titel": "Mitarbeiterbefragung: Warum die Ergebnisse in der Schublade landen",
  "titelAkzent": "und wie daraus Marketing wird",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Team im Gespräch in der Kaffeepause",
    "unterschrift": "Was dein Team im Alltag erlebt, ist oft die ehrlichste Beschreibung deines Unternehmens.",
    "platzhalter": "Platzhalter Titelbild: 1600 x 900 px, zugleich Vorschaubild für LinkedIn"
  },
  "kurzAntwort": "Die Ergebnisse vieler Mitarbeiterbefragungen landen in der Schublade, weil sie als Bericht für die Personalabteilung enden: viele Durchschnittswerte, wenig Entscheidungen. Wirksam wird eine Befragung, wenn vorher feststeht, welche Fragen für genau dein Unternehmen zählen, und wenn die Antworten danach in zwei Richtungen arbeiten: für die Führung und für dein Marketing.",
  "wichtigstes": [
    {
      "fett": "Standardfragen liefern Standardantworten.",
      "text": "Entscheidend ist, vorher die richtigen Fragen für dein Unternehmen zu finden.",
      "akzent": false
    },
    {
      "fett": "Ehrlich antwortet nur, wer sich sicher fühlt.",
      "text": "Eine neutrale Stelle hilft mehr als jede Zusicherung des Chefs.",
      "akzent": false
    },
    {
      "fett": "Der Durchschnitt versteckt das Wichtigste.",
      "text": "Die wertvollsten Hinweise stecken in den Abweichungen und in den eigenen Worten.",
      "akzent": false
    },
    {
      "fett": "Was dein Team über die Firma sagt, ist oft deine beste Werbebotschaft.",
      "text": "Mit andi fragt. wird aus denselben Antworten beides: Maßnahmen für die Führung und Botschaften für Positionierung, Recruiting und Verkauf.",
      "akzent": true
    }
  ],
  "abschnitte": [
    {
      "id": "schublade",
      "toc": "Warum Ergebnisse in der Schublade landen",
      "frage": "Warum landen die Ergebnisse einer Mitarbeiterbefragung so oft in der Schublade?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Die meisten Unternehmen starten eine Mitarbeiterbefragung mit guter Absicht. Ein paar Wochen später liegt ein Bericht mit Balken und Prozentwerten auf dem Tisch, und dann passiert wenig. Die Gründe sind fast immer dieselben."
        },
        {
          "typ": "begriff",
          "text": "Eine Mitarbeiterbefragung ist eine meist anonyme, strukturierte Erhebung, mit der ein Unternehmen Meinungen, Zufriedenheit und Ideen seiner Mitarbeitenden einholt."
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "kopie",
              "titel": "Die Fragen kommen von der Stange",
              "text": "Ein Standardkatalog fragt nach allem ein bisschen und nach nichts genau. Was dein Unternehmen wirklich bremst, kommt darin oft gar nicht vor."
            },
            {
              "symbol": "schild",
              "titel": "Niemand traut der Anonymität",
              "text": "Wenn die eigene Firma fragt, antworten Mitarbeitende vorsichtig. Das Ergebnis ist freundlich, aber wenig ehrlich."
            },
            {
              "symbol": "gleich",
              "titel": "Der Durchschnitt glättet alles",
              "text": "Eine 3,8 von 5 sagt dir nicht, was zu tun ist. Spannend wird es dort, wo Gruppen deutlich voneinander abweichen."
            },
            {
              "symbol": "frage",
              "titel": "Der Bericht hat keinen Besitzer",
              "text": "Die Ergebnisse landen in der Personalabteilung, die Entscheidungen fallen woanders."
            },
            {
              "symbol": "archiv",
              "titel": "Die Antworten bleiben intern",
              "text": "Dass in den Aussagen deines Teams die Gründe stecken, warum Kunden bei dir kaufen, sieht kaum jemand."
            }
          ]
        },
        {
          "typ": "streuung",
          "titel": "Der Durchschnitt versteckt das Wichtigste",
          "wert": "3,8",
          "wertText": "von 5, Gesamtwert im Bericht",
          "schnitt": 70,
          "schnittText": "Schnitt 3,8",
          "skala": [
            "1",
            "5"
          ],
          "hebelText": "hier liegt es",
          "zeilen": [
            {
              "label": "Büro",
              "pos": 85
            },
            {
              "label": "Außendienst",
              "pos": 77.5
            },
            {
              "label": "Werkstatt",
              "pos": 47.5,
              "hebel": true
            }
          ],
          "fazit": "Im Gesamtwert sieht alles ordentlich aus. Der Handlungsbedarf in der Werkstatt verschwindet im Mittel.",
          "unterschrift": "Beispiel zur Veranschaulichung, keine echten Daten. Bereiche mit 2,9, 4,1 und 4,4 ergeben im Mittel 3,8."
        }
      ]
    },
    {
      "id": "selbst",
      "toc": "Was du selbst tun kannst",
      "frage": "Was kannst du selbst tun, damit deine Mitarbeiterbefragung wirkt?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Auch ohne Hilfe von außen kannst du viel richtig machen. Diese fünf Schritte haben sich bewährt."
        },
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Leg vorher fest, welche Entscheidung du treffen willst.",
              "text": "Formuliere zwei, drei Fragen, auf die du wirklich eine Antwort brauchst, und bau die Befragung um sie herum."
            },
            {
              "fett": "Halte sie kurz.",
              "text": "Lieber zehn gute Fragen als vierzig mittelmäßige. Wer müde wird, antwortet beliebig."
            },
            {
              "fett": "Lass Platz für eigene Worte.",
              "text": "Offene Fragen sind mühsamer auszuwerten, liefern aber genau die Sätze, mit denen du später arbeiten kannst."
            },
            {
              "fett": "Sag vorher, was mit den Ergebnissen passiert.",
              "text": "Nenne einen Termin, an dem du sie dem Team vorstellst, und halte ihn."
            },
            {
              "fett": "Leite aus jedem Ergebnis eine Handlung ab.",
              "text": "Drei umgesetzte Maßnahmen wirken stärker als dreißig Erkenntnisse."
            }
          ]
        },
        {
          "typ": "kreislauf",
          "stil": "rahmen",
          "titel": "Eine Befragung wirkt, wenn der Kreis sich schließt",
          "schritte": [
            "Entscheidung festlegen",
            "Kurz halten",
            "Platz für eigene Worte",
            "Ergebnisse vorstellen",
            "Handeln"
          ],
          "mitte": [
            "Erst wenn sich",
            "etwas tut, lohnt",
            "die nächste Runde"
          ],
          "beschreibung": "Ein Kreislauf mit fünf Stationen: Entscheidung festlegen, kurz halten, Platz für eigene Worte, Ergebnisse vorstellen, handeln. Danach beginnt die nächste Runde.",
          "unterschrift": "Die fünf Schritte von oben als Kreislauf. Schritt 5 schließt den Kreis: Ohne sichtbare Maßnahme antwortet beim nächsten Mal kaum jemand ehrlich."
        },
        {
          "typ": "tipp",
          "text": "Stell die Ergebnisse persönlich vor und sag dazu, was du nicht änderst und warum. Das schafft mehr Vertrauen als eine lange Liste von Versprechen."
        }
      ]
    },
    {
      "id": "grenzen",
      "toc": "Wo die übliche Befragung an Grenzen stößt",
      "frage": "Wo stößt die übliche Mitarbeiterbefragung an Grenzen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Eine gute Befragung beantwortet, wie zufrieden dein Team ist. Sie beantwortet selten, warum Kunden bei dir kaufen, was dich vom Mitbewerb unterscheidet und womit du gute Leute anziehst. Genau dort setzt andi fragt. an."
        },
        {
          "typ": "tabelle",
          "kopf": [
            "Übliche Mitarbeiterbefragung",
            "Interview mit andi fragt."
          ],
          "zeilen": [
            [
              "Wer fragt?",
              "die eigene Firma oder ein Online-Tool",
              "eine neutrale Stelle: Rittler & Co in Graz"
            ],
            [
              "Welche Fragen?",
              "ein Standardkatalog",
              "zuerst die richtigen Fragen für dein Unternehmen, dann das Interview"
            ],
            [
              "Wen?",
              "meist nur Mitarbeitende",
              "Geschäftsführung, Team, Kunden und Vertrieb"
            ],
            [
              "Wie ausgewertet?",
              "Durchschnittswerte und Diagramme",
              "Menschen lesen die Antworten und suchen die Abweichungen"
            ],
            [
              "Was kommt heraus?",
              "ein Bericht für die Personalabteilung",
              "Maßnahmen für die Führung und Botschaften für dein Marketing"
            ]
          ],
          "unterschrift": "Übliche Mitarbeiterbefragung und Interview mit andi fragt. im Vergleich"
        }
      ]
    },
    {
      "id": "marketing",
      "toc": "Wie aus Antworten Marketing wird",
      "frage": "Wie wird aus den Antworten deines Teams Marketing?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Die meisten Ansätze laufen von der Marke zu den Mitarbeitenden: Erst wird die Marke festgelegt, dann sollen alle sie vertreten. andi fragt. geht den umgekehrten Weg. Wir holen die Marke aus den Menschen, die täglich mit deinen Kunden arbeiten."
        },
        {
          "typ": "zitat",
          "text": "Eine Mitarbeiterbefragung landet in der Schublade. Ein Interview mit andi fragt. landet in deiner Werbung."
        },
        {
          "typ": "schaubild",
          "knopfUeblich": "So läuft es meistens",
          "knopfAndi": "So läuft es mit andi fragt.",
          "ueblich": [
            {
              "etikett": "Start",
              "text": "Fragebogen mit Standardfragen"
            },
            {
              "etikett": "Auswertung",
              "text": "Durchschnittswerte und Balken"
            },
            {
              "etikett": "Ergebnis",
              "text": "Bericht für die Personalabteilung"
            },
            {
              "etikett": "Und dann",
              "text": "Schublade",
              "durchgestrichen": true
            }
          ],
          "andi": {
            "gruppenTitel": "Wer antwortet",
            "gruppen": [
              "Geschäftsführung",
              "Team",
              "Kunden",
              "Vertrieb"
            ],
            "schritte": [
              {
                "verb": "fragt",
                "text": "Zuerst die richtigen Fragen für dein Unternehmen, dann anonyme Interviews"
              },
              {
                "verb": "weiß",
                "text": "Menschen lesen alle Antworten und suchen die Abweichungen"
              }
            ],
            "ausgaenge": [
              {
                "titel": "Für die Führung",
                "punkte": [
                  "Klare Prioritäten",
                  "Maßnahmen mit Termin"
                ]
              },
              {
                "titel": "Für dein Marketing",
                "punkte": [
                  "Positionierung",
                  "Arbeitgebermarke",
                  "Verkaufsargumente"
                ],
                "akzent": true
              }
            ]
          },
          "unterschrift": "Der übliche Weg endet im Bericht. Mit andi fragt. arbeiten dieselben Antworten für Führung und Marketing."
        },
        {
          "typ": "absatz",
          "text": "Konkret entstehen aus denselben Antworten drei Dinge, die sonst getrennt und teuer erarbeitet werden:"
        },
        {
          "typ": "karten",
          "stil": "ergebnis",
          "karten": [
            {
              "symbol": "ziel",
              "titel": "Positionierung",
              "text": "Der Grund, warum Kunden bei dir kaufen, in Worten, die sie wiedererkennen."
            },
            {
              "symbol": "gruppe",
              "titel": "Arbeitgebermarke",
              "text": "Recruiting-Botschaften, die stimmen, weil sie aus deinem Team kommen."
            },
            {
              "symbol": "handschlag",
              "titel": "Verkaufsargumente",
              "text": "Die Sätze, bei denen Kunden nicken, statt Floskeln aus dem Prospekt."
            }
          ]
        }
      ]
    },
    {
      "id": "ablauf",
      "toc": "So läuft ein Interview ab",
      "frage": "Wie läuft ein Interview mit andi fragt. ab?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "**andi fragt. ist eine Methode der Rittler & Co GmbH aus Graz: Sie findet zuerst die richtigen Fragen für ein Unternehmen und holt dann ehrliche Antworten von Team, Kunden und Vertrieb.** Der Ablauf hat vier Schritte."
        },
        {
          "typ": "ablauf",
          "schritte": [
            {
              "verb": "fragt",
              "text": "Im Zielgespräch klären wir, was du wissen musst. Daraus entwickeln wir für jede Gruppe ein eigenes, anonymes Interview, am Handy oder Computer."
            },
            {
              "verb": "weiß",
              "text": "Unsere Strategen lesen alle Antworten und verdichten sie mit der ANDI-Methode: Aufmerksamkeit, Nutzen, Differenzierung, Identität."
            },
            {
              "verb": "macht",
              "text": "Aus den Abweichungen werden klare Empfehlungen für Führung und Marketing."
            },
            {
              "verb": "zeigt",
              "text": "Wir präsentieren dir die Ergebnisse persönlich und legen die nächsten Schritte fest."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Mehr dazu auf den Seiten zum [anonymen Team-Interview](/team) und zur [Positionierung aus dem Unternehmen heraus](/positionierung)."
        }
      ]
    },
    {
      "id": "praxis",
      "toc": "Ein Beispiel",
      "frage": "Wie kann sich eine Werbebotschaft verändern?",
      "bloecke": [
        {
          "typ": "vorherNachher",
          "vorherTitel": "Werbebotschaft vorher",
          "vorher": "Qualität und Service seit 1987",
          "nachherTitel": "Nach dem Interview",
          "nachher": "Wir sind die, die am selben Tag zurückrufen.",
          "unterschrift": "So kann sich eine Werbebotschaft verändern, wenn sie aus den Antworten von Team und Kunden entsteht. Beispiel zur Veranschaulichung."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen zur Mitarbeiterbefragung",
  "faq": [
    {
      "q": "Wie oft sollte man eine Mitarbeiterbefragung machen?",
      "a": "Lieber seltener und mit Folgen als jedes Jahr ohne. Sinnvoll ist ein Rhythmus, bei dem zwischen zwei Runden sichtbar etwas passiert ist. Mit andi fragt. lässt sich derselbe Kern später wiederholen, damit du Veränderungen erkennst."
    },
    {
      "q": "Ab wie vielen Mitarbeitenden lohnt sich das?",
      "a": "Gerade in kleinen Betrieben, weil dort der Chef glaubt, alles zu wissen. Ausgewertet wird jede Gruppe bei andi fragt. erst ab 6 Personen, damit du nicht siehst, wer was geantwortet hat. Kleinere Bereiche fassen wir zusammen."
    },
    {
      "q": "Was ist der Unterschied zwischen einer Mitarbeiterbefragung und einem Interview mit andi fragt.?",
      "a": "Eine Mitarbeiterbefragung misst meist Zufriedenheit mit Standardfragen. Bei andi fragt. klären wir zuerst, welche Fragen für dein Unternehmen zählen, fragen dann auch Kunden und Vertrieb und machen aus den Antworten Maßnahmen für die Führung und Botschaften für dein Marketing."
    },
    {
      "q": "Wer sieht die Antworten?",
      "a": "Gelesen werden die Antworten nur vom Projektteam bei Rittler & Co in Graz. Du bekommst die Ergebnisse gebündelt und siehst nicht, wer was geantwortet hat."
    },
    {
      "q": "Was kostet ein Interview mit andi fragt.?",
      "a": "Ein Interview-Modul beginnt für Kleinbetriebe bei 2.900 Euro netto, als Fixpreis. Alle Stufen und einen Rechner findest du auf der [Preisseite](/preise). Das Erstgespräch ist kostenlos."
    }
  ],
  "quellen": [
    {
      "titel": "Die 8 häufigsten Fehler bei der Nachbereitung von Befragungen",
      "url": "https://www.personalwirtschaft.de/?p=177591",
      "herkunft": "Personalwirtschaft"
    },
    {
      "titel": "Markenführungsansätze mit Fokus auf Mitarbeiter",
      "url": "https://www.markenlexikon.com/texte/pha_schmidt_kilian_markenfuehrungsansaetze-mit-fokus-mitarbeiter_3_juli_2012.pdf",
      "herkunft": "markenlexikon.com"
    }
  ],
  "seitenleisteFrage": "Wie sieht das in deinem Unternehmen aus?",
  "abschlussTitel": "Was steckt in deinem Unternehmen?",
  "passend": [
    "warum-kuendigen-gute-mitarbeiter",
    "alleinstellungsmerkmal-finden",
    "warum-kaufen-kunden-bei-der-konkurrenz"
  ],
  "titelgrafik": true
};

export default beitrag;

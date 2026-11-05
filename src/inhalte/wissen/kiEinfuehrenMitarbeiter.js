// Beitrag Nr. 19 im Wissensbereich: /wissen/ki-einfuehren-mitarbeiter
// Inhalte aus n10.py und grafik_n10.py (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 05.11.2026.
// Status entwurf. Belege im Projekt unter analyse/.
const beitrag = {
  "slug": "ki-einfuehren-mitarbeiter",
  "nr": 19,
  "status": "entwurf",
  "geprueft": null,
  "erschienen": null,
  "aktualisiert": null,
  "leitartikel": false,
  "modul": "team",
  "etikett": "Team",
  "themen": [
    "Team"
  ],
  "seitentitel": "KI im Unternehmen einführen: Frag dein Team | andi fragt.",
  "beschreibung": "KI im Unternehmen einführen: Was Mitarbeiter in Österreich über KI denken, was die KI-Verordnung zur Schulung verlangt und warum du zuerst fragst.",
  "teaser": "Warum die Stimmung zu KI in Österreich so schlecht ist wie nirgends sonst, was die KI-Verordnung zur Schulung verlangt und warum du vor der Einführung dein Team fragst.",
  "kurztitel": "KI im Betrieb einführen",
  "titel": "KI im Betrieb einführen:",
  "titelAkzent": "Was dein Team wirklich darüber denkt",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Titelgrafik: Eine Karte zeigt 85 Prozent, die in Österreich negative Folgen von KI für den Arbeitsmarkt erwarten. Darunter vier Fragen vor der Einführung: Wer nutzt was, wovor Angst, pink hervorgehoben, welche Schulung und welche Ideen.",
    "unterschrift": "Bevor du KI einführst, frag, wer sie schon nutzt und wovor dein Team Angst hat.",
    "platzhalter": "Platzhalter Titelbild: Gespräch zwischen Geschäftsführer und Mitarbeiterin am Laptop in einem kleinen Betrieb, 1600 x 900 px"
  },
  "titelgrafik": true,
  "kurzAntwort": "Frag zuerst dein Team. Laut Allianz Pulse 2026 ist die Stimmung zu KI und Arbeitsplätzen in Österreich schlechter als in sieben anderen Ländern, nur 11 % der Erwerbstätigen wurden geschult. Die KI-Verordnung verlangt, dass du etwas für die KI-Kompetenz deiner Leute tust. Ein anonymes Interview zeigt dir vorher, wer was nutzt, wovor die Leute Angst haben und welche Schulung sie brauchen.",
  "wichtigstes": [
    {
      "fett": "Die Sorge ist groß.",
      "text": "85 % der Befragten in Österreich erwarten laut Allianz Pulse 2026 negative Folgen von KI für den Arbeitsmarkt. Dass der eigene Job ganz wegfällt, erwarten aber nur 6 %.",
      "akzent": false
    },
    {
      "fett": "KI ist oft schon da.",
      "text": "30 % der Unternehmen ab 10 Beschäftigten nutzten 2025 laut Statistik Austria KI, dazu kommt Nutzung ohne Freigabe.",
      "akzent": false
    },
    {
      "fett": "KI-Kompetenz ist Pflicht, ein Zertifikat nicht.",
      "text": "Seit 2. Februar 2025 verlangt die KI-Verordnung, dass du etwas für die KI-Kompetenz deiner Leute tust. Wie, schreibt sie nicht vor.",
      "akzent": false
    },
    {
      "fett": "Erst fragen, dann einführen.",
      "text": "Ein Interview mit andi fragt. zeigt dir die Sicht deines Teams. Aus denselben Antworten entstehen Botschaften für deine Arbeitgebermarke.",
      "akzent": true
    }
  ],
  "kennzahlen": [
    {
      "wert": "85",
      "einheit": " %",
      "text": "der Befragten in Österreich erwarten negative Folgen von KI für den Arbeitsmarkt, nur 4 % positive.",
      "quelle": "Allianz Pulse 2026, laut Leadersnet und Borncity"
    },
    {
      "wert": "11",
      "einheit": " %",
      "text": "der Erwerbstätigen in Österreich haben eine KI-Schulung bekommen. Im Schnitt der acht Länder sind es 17 %.",
      "quelle": "Allianz Pulse 2026, laut Leadersnet und Borncity"
    },
    {
      "wert": "27",
      "einheit": " %",
      "text": "der Betriebe, die KI nutzen oder testen, nennen Vorbehalte bei Mitarbeitenden als Hürde.",
      "quelle": "Market-Institut für die WKO, 2026"
    }
  ],
  "abschnitte": [
    {
      "id": "stimmung",
      "toc": "Wie dein Team über KI denkt",
      "frage": "Haben Mitarbeiter in Österreich Angst vor KI?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Viele schon, zumindest um den Arbeitsmarkt. Für den Allianz Pulse 2026 hat der Versicherungskonzern Allianz je rund 1.000 Erwachsene in acht Ländern befragt. Laut den Berichten von Leadersnet und Borncity erwarten in Österreich 85 % negative Folgen von KI für den Arbeitsmarkt und nur 4 % positive. Das ergibt einen Saldo von minus 81 Prozentpunkten, laut Allianz der schlechteste Wert aller acht Länder und rund 19 Punkte schlechter als 2025."
        },
        {
          "typ": "begriff",
          "text": "Ein Stimmungssaldo ist der Anteil positiver minus der Anteil negativer Antworten. Minus 81 heißt: Auf jede Person, die gute Folgen erwartet, kommen mehr als 20, die schlechte erwarten."
        },
        {
          "typ": "absatz",
          "text": "Spannend wird es beim eigenen Arbeitsplatz. Dass der eigene Job innerhalb von fünf Jahren ganz wegfällt, erwarten in Österreich nur 6 %. 18 % rechnen damit, dass KI wesentliche Teile ihrer Arbeit übernimmt, 31 % erwarten vor allem Unterstützung. Die Angst gilt also eher dem Arbeitsmarkt als dem eigenen Schreibtisch."
        },
        {
          "typ": "balken",
          "dick": true,
          "titel": "Was Befragte in Österreich für den eigenen Job erwarten",
          "zeilen": [
            {
              "label": "Mein Job fällt in fünf Jahren ganz weg",
              "wert": "6 %",
              "anteil": 6
            },
            {
              "label": "KI übernimmt wesentliche Teile meiner Arbeit",
              "wert": "18 %",
              "anteil": 18
            },
            {
              "label": "KI unterstützt mich vor allem",
              "wert": "31 %",
              "anteil": 31,
              "akzent": true
            }
          ],
          "fazit": "Die große Sorge gilt dem Arbeitsmarkt. Für den eigenen Job erwarten viel mehr Unterstützung als Wegfall.",
          "unterschrift": "Allianz Pulse 2026, Österreich, rund 1.000 Befragte, laut Leadersnet (15.10.2026) und Borncity (14.10.2026). Weitere Antworten nicht dargestellt."
        },
        {
          "typ": "absatz",
          "text": "Wer KI beruflich nutzt, sieht sie gelassener: Laut Leadersnet erwarten im Allianz Pulse 50 % dieser Beschäftigten Unterstützung durch KI, bei den Nichtnutzern 12 %."
        },
        {
          "typ": "absatz",
          "text": "Wie es in deinem Betrieb aussieht, sagen diese Zahlen nicht."
        }
      ]
    },
    {
      "id": "nutzung",
      "toc": "Wer schon KI nutzt",
      "frage": "Wie viele Unternehmen und Mitarbeiter nutzen KI schon?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Mehr, als viele glauben. Laut Statistik Austria nutzten 2025 30 % der Unternehmen ab 10 Beschäftigten mindestens eine KI-Technologie, 2024 waren es 20 %. Je größer der Betrieb, desto häufiger: Bei 10 bis 49 Beschäftigten waren es 26 %, ab 250 Beschäftigten 68 %. Auf ihrer Themenseite weist Statistik Austria für die Erhebung 2026 bereits 48 % aus, Details sind für Dezember angekündigt."
        },
        {
          "typ": "balken",
          "dick": true,
          "titel": "Unternehmen, die KI nutzen, nach Größe",
          "zeilen": [
            {
              "label": "10 bis 49 Beschäftigte",
              "wert": "26 %",
              "anteil": 26,
              "akzent": true
            },
            {
              "label": "50 bis 249 Beschäftigte",
              "wert": "45 %",
              "anteil": 45
            },
            {
              "label": "ab 250 Beschäftigte",
              "wert": "68 %",
              "anteil": 68
            },
            {
              "label": "alle Unternehmen ab 10 Beschäftigten",
              "wert": "30 %",
              "anteil": 30
            }
          ],
          "fazit": "Auch im kleinen Betrieb nutzt schon gut jedes vierte Unternehmen KI.",
          "unterschrift": "Statistik Austria, IKT-Einsatz in Unternehmen 2025, Befragung Februar bis Juli 2025, Unternehmen ab 10 Beschäftigten ohne Finanz- und Versicherungsbranche, Nutzung mindestens einer KI-Technologie."
        },
        {
          "typ": "absatz",
          "text": "Statistik Austria fragt die Unternehmen. Was Mitarbeitende auf eigene Faust verwenden, weiß die Geschäftsführung nicht immer. Laut Allianz Pulse nutzen in Österreich 43 % KI mindestens einmal pro Woche, in der Generation Z sogar 74 %. Laut einer Umfrage mit dem IT-Dienstleister Tieto Austria (September 2026) nutzen rund 17 % der Berufstätigen KI-Assistenten, ohne dass der Arbeitgeber davon weiß. Die Zahl stammt von einem Anbieter."
        },
        {
          "typ": "absatz",
          "text": "Was die Betriebe bremst, hat das Market-Institut für die Wirtschaftskammer gefragt (500 Unternehmen, Dezember 2025 bis Jänner 2026). 53 % nutzen oder testen KI, meist ChatGPT. Diese Betriebe nennen als Hindernisse bei der Einführung rechtliche Fragen (39 %), die Vertraulichkeit der eigenen Daten (37 %), Vorbehalte bei Mitarbeitenden (27 %) und fehlende Kompetenz der Mitarbeitenden (26 %). Zwei der vier größten Hürden betreffen also dein Team."
        }
      ]
    },
    {
      "id": "schulung",
      "toc": "Was die KI-Verordnung verlangt",
      "frage": "Muss ich meine Mitarbeiter in KI schulen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Du musst etwas für ihre KI-Kompetenz tun. Die KI-Verordnung der EU (2024/1689) verlangt das in Artikel 4 seit 2. Februar 2025 von allen, die KI-Systeme anbieten oder betreiben. Laut der KI-Servicestelle der RTR betrifft das auch Mitarbeitende, die im Betrieb KI nutzen."
        },
        {
          "typ": "absatz",
          "text": "Die Verordnung (EU) 2026/1744 vom 8. Juli 2026, der Digital-Omnibus zur KI, hat Artikel 4 abgeschwächt. Sie ist am 27. Juli 2026 in Kraft getreten. Jetzt gilt: Du ergreifst Maßnahmen, um die Entwicklung der KI-Kompetenz deines Personals und anderer Personen in deinem Auftrag zu unterstützen. Dabei berücksichtigst du Kenntnisse, Erfahrung, Ausbildung und wofür die KI eingesetzt wird. Ein bestimmtes Niveau an KI-Kompetenz musst du für niemanden garantieren."
        },
        {
          "typ": "aufbau",
          "titel": "Was Artikel 4 der KI-Verordnung verlangt und was nicht",
          "spalten": [
            {
              "titel": "Verlangt",
              "akzent": true,
              "teile": [
                {
                  "text": "Maßnahmen für die KI-Kompetenz",
                  "art": "akzent"
                },
                {
                  "text": "für dein Personal und andere Personen in deinem Auftrag",
                  "art": "hell"
                },
                {
                  "text": "abgestimmt auf Kenntnisse, Erfahrung und Einsatz",
                  "art": "hell"
                },
                {
                  "text": "laut RTR auch für alle, die KI im Betrieb nutzen",
                  "art": "hell"
                }
              ]
            },
            {
              "titel": "Nicht verlangt",
              "teile": [
                {
                  "text": "Ein garantiertes Niveau für jede Person",
                  "art": "dunkel"
                },
                {
                  "text": "ein anerkanntes Zertifikat, laut RTR gibt es derzeit keines",
                  "art": "grau"
                },
                {
                  "text": "eine bestimmte Form der Schulung",
                  "art": "grau"
                },
                {
                  "text": "eine gesetzlich vorgeschriebene Dokumentation",
                  "art": "grau"
                }
              ]
            }
          ],
          "fazit": "Du entscheidest, wie du deine Leute fit machst. Halt trotzdem fest, wer was gelernt hat.",
          "unterschrift": "Nach Artikel 4 der Verordnung (EU) 2024/1689 in der Fassung der Verordnung (EU) 2026/1744 und den FAQ der RTR KI-Servicestelle, sinngemäß. Keine Rechtsberatung."
        },
        {
          "typ": "absatz",
          "text": "Laut RTR ist keine Methode vorgeschrieben, interne Programme können reichen, offiziell anerkannte Zertifikate gibt es derzeit nicht. Strafen für Verstöße gegen Artikel 4 sieht die Verordnung selbst nicht vor. Ein Unternehmen kann laut RTR aber nach Paragraf 1313a ABGB haften, wenn es seine Leute unzureichend schult und dadurch ein Schaden entsteht. Die RTR empfiehlt eine schriftliche KI-Richtlinie und festzuhalten, welche Gruppen geschult wurden. Das ist keine Rechtsberatung."
        },
        {
          "typ": "absatz",
          "text": "Zwischen dem, was Betriebe Schulung nennen, und dem, was ankommt, kann eine Lücke liegen. Laut Statistik Austria bieten 83 % der Unternehmen, die KI nutzen, Weiterbildung dazu an, am häufigsten als Selbststudium (71 %) und Wissensweitergabe unter Kollegen (61 %). Im Allianz Pulse sagen dagegen 52 % der Befragten in Österreich, ihr Arbeitgeber biete keine KI-Schulung an. Nur 11 % der Erwerbstätigen haben eine bekommen, im Schnitt der acht Länder 17 %. Die Erhebungen fragen verschiedene Gruppen und sind nicht direkt vergleichbar. Sie zeigen aber, warum du fragen solltest."
        }
      ]
    },
    {
      "id": "betriebsrat",
      "toc": "KI und Betriebsrat",
      "frage": "Muss der Betriebsrat bei der Einführung von KI zustimmen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Wenn du einen Betriebsrat hast, oft ja. Das Arbeitsverfassungsgesetz hat keine eigenen Regeln für KI, die bestehenden gelten aber auch hier. Drei Stellen sind wichtig:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "sprechblase",
              "titel": "Auskunft",
              "text": "Laut dem Arbeitsrechtler Elias Felten (Universität Salzburg) berührt der Einsatz von KI-Werkzeugen die Interessen der Beschäftigten, der Betriebsrat hat daher Anspruch auf Auskunft (Paragraf 91)."
            },
            {
              "symbol": "unsichtbar",
              "titel": "Kontrolle",
              "text": "Technische Systeme zur Kontrolle der Beschäftigten, die die Menschenwürde berühren, brauchen die Zustimmung des Betriebsrats (Paragraf 96 Absatz 1 Ziffer 3). Laut Felten reicht es, dass ein System zur Kontrolle geeignet ist."
            },
            {
              "symbol": "dokument",
              "titel": "Daten",
              "text": "Systeme, die personenbezogene Daten der Beschäftigten automationsunterstützt verarbeiten und über allgemeine Angaben und fachliche Voraussetzungen hinausgehen, brauchen ebenfalls die Zustimmung, außer die Daten dienen nur Pflichten aus Gesetz, Kollektivvertrag oder Arbeitsvertrag (Paragraf 96a). Die Schlichtungsstelle kann sie ersetzen."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Ob ein Werkzeug darunter fällt, hängt davon ab, was es mit den Daten deiner Leute macht. Das lässt du im Einzelfall prüfen. In Betrieben ohne Betriebsrat gilt Paragraf 10 AVRAG: Kontrollmaßnahmen, die die Menschenwürde berühren, sind dann nur mit Zustimmung der einzelnen Beschäftigten zulässig."
        },
        {
          "typ": "absatz",
          "text": "Und das Interview vor der Einführung? Laut Oberstem Gerichtshof (2004) ist eine anonyme Analyse des Betriebsklimas grundsätzlich zustimmungsfrei, wenn du keine Antworten einzelnen Personen zuordnen kannst und nur zusammengefasste Ergebnisse siehst (9 ObA 114/04m). Die allgemeinen Mitwirkungsrechte des Betriebsrats bleiben unberührt, hol ihn also früh dazu. Das ist keine Rechtsberatung. Bei Fragen helfen dir die Wirtschaftskammer oder eine Anwältin für Arbeitsrecht."
        }
      ]
    },
    {
      "id": "selbst",
      "toc": "So nimmst du dein Team mit",
      "frage": "Wie führst du KI im Unternehmen ein, ohne dein Team zu verlieren?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Welches Werkzeug passt, klärst du mit Fachleuten für KI. Für die Menschen dahinter hilft diese Reihenfolge:"
        },
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Frag, was schon läuft.",
              "text": "Wer nutzt welches Werkzeug wofür? Frag so, dass niemand Ärger fürchten muss, sonst erfährst du nichts."
            },
            {
              "fett": "Sag, wofür KI da ist.",
              "text": "Sag offen, was du vorhast und was nicht. Wenn du keinen Personalabbau planst, sag das."
            },
            {
              "fett": "Schreib Regeln auf.",
              "text": "Leg fest, welche Werkzeuge erlaubt sind und welche Daten nicht hineingehören, etwa Kunden- oder Personaldaten. Besprich sie mit dem Team, statt sie nur auszuhängen."
            },
            {
              "fett": "Schul nach Tätigkeit.",
              "text": "Die Buchhaltung braucht etwas anderes als die Werkstatt. Halt fest, wer wann was gelernt hat."
            },
            {
              "fett": "Hol den Betriebsrat früh dazu.",
              "text": "Wenn es einen gibt: bevor die Werkzeuge laufen, nicht danach."
            },
            {
              "fett": "Frag nach ein paar Monaten wieder.",
              "text": "Was ist leichter geworden, wo fehlt noch Wissen? So siehst du, ob die Einführung ankommt."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Wo dein Team steht, siehst du erst, wenn du fragst. Grob lassen sich vier Lagen unterscheiden."
        },
        {
          "typ": "vierfeld",
          "titel": "Wo steht dein Team bei KI?",
          "achseLinks": "Nutzt KI schon",
          "achseUnten": "Fühlt sich vorbereitet",
          "felder": [
            {
              "kopf": "Auf eigene Faust",
              "text": "Viele nutzen KI, aber ohne Regeln und ohne Schulung."
            },
            {
              "kopf": "Sicher im Alltag",
              "text": "Das Team nutzt KI und weiß, was erlaubt ist.",
              "akzent": true
            },
            {
              "kopf": "Abwartend und besorgt",
              "text": "Kaum jemand nutzt KI, viele fürchten, was kommt."
            },
            {
              "kopf": "Geschult, aber ungenutzt",
              "text": "Es gab eine Schulung, im Alltag ändert sich nichts."
            }
          ],
          "fazit": "Links oben brauchst du Regeln, links unten Gespräche, rechts unten Aufgaben, bei denen KI wirklich hilft. Wo dein Team steht, zeigt dir erst seine Antwort.",
          "unterschrift": "Eigene Darstellung von andi fragt. zur Veranschaulichung, keine Daten."
        },
        {
          "typ": "tipp",
          "text": "Fang mit einer Aufgabe an, die alle nervt, etwa Protokolle oder Angebotstexte. Wenn KI dort spürbar hilft, überzeugt das mehr als jede Präsentation."
        }
      ]
    },
    {
      "id": "andi",
      "toc": "Wie andi fragt. hilft",
      "frage": "Wie findest du heraus, was dein Team über KI denkt?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Mit einem Interview, bevor du einführst. andi fragt. ist keine KI-Beratung. Wir empfehlen keine Werkzeuge, wir schulen nicht und wir prüfen nicht, ob du die KI-Verordnung erfüllst. Wir liefern die Sicht deines Teams, damit du und deine Fachleute für KI besser entscheiden könnt."
        },
        {
          "typ": "absatz",
          "text": "Zuerst klären wir mit dir, was du wissen musst, etwa welche Schulung sich dein Team wünscht und welche Ideen es hat. Dein Team antwortet anonym am Handy oder am Computer, in rund 15 bis 30 Minuten. Die Antworten lesen nur Menschen bei Rittler & Co in Graz, du bekommst die Zusammenfassung. Gruppen unter sechs Personen und Freitexte fassen wir zusammen. Ganz ausschließen lässt sich ein Erkennen nicht, etwa wenn jemand ein Werkzeug beschreibt, das nur er verwendet."
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
              "text": "Im Zielgespräch klären wir, was du vor der Einführung von KI wissen musst. Daraus entsteht ein Interview, das zu deinem Betrieb passt."
            },
            {
              "verb": "weiß",
              "text": "Wir werten die Antworten aus und zeigen, wer was schon nutzt, wo die Sorgen liegen und welches Wissen fehlt."
            },
            {
              "verb": "macht",
              "text": "Du bekommst einen Befund mit den Themen, die dein Team bewegt, als Grundlage für Regeln, Schulung und Gespräche."
            },
            {
              "verb": "zeigt",
              "text": "Wir stellen dir das Ergebnis vor. Aus denselben Antworten entstehen Botschaften für deine Arbeitgebermarke."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Wie das Team-Interview abläuft, steht auf der Seite [Team-Interview mit andi fragt.](/team). Was mit den Antworten sonst noch möglich ist, zeigt der Beitrag [Mitarbeiterbefragung: Was tun mit den Ergebnissen?](/wissen/mitarbeiterbefragung-ergebnisse)."
        },
        {
          "typ": "karten",
          "stil": "ergebnis",
          "karten": [
            {
              "symbol": "dokument",
              "titel": "Ein Bild, wer was schon nutzt",
              "text": "Welche Werkzeuge im Einsatz sind und wofür, ohne dass sich jemand outen muss."
            },
            {
              "symbol": "ziel",
              "titel": "Die Themen für deine Einführung",
              "text": "Wo Sorgen, Wissenslücken und Ideen liegen, als Grundlage für Regeln und Schulung."
            },
            {
              "symbol": "gruppe",
              "titel": "Botschaften für deine Arbeitgebermarke",
              "text": "Wie dein Team die Zusammenarbeit erlebt, zusammengefasst als Grundlage für Recruiting und Website."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Der zweite Nutzen: Du kannst zeigen, dass du dein Team gefragt hast, bevor du KI eingeführt hast. Wo die Sorge um Arbeitsplätze so groß ist wie in Österreich, zeigt das auch Bewerbern, wie du mit deinem Team umgehst. Ein Projekt, zweifacher Nutzen."
        },
        {
          "typ": "schnittmenge",
          "titel": "Dieselben Antworten, zweifacher Nutzen",
          "links": [
            "Grundlage",
            "für die KI"
          ],
          "rechts": [
            "Botschaften",
            "für Bewerber"
          ],
          "mitte": "Interview",
          "beschreibung": "Zwei Kreise überschneiden sich. Links die Grundlage für die Einführung von KI, rechts Botschaften für Bewerber, in der Mitte das Interview.",
          "fazit": "Was dein Team über KI und Zusammenarbeit sagt, hilft dir bei der Einführung. Und genau das wollen auch Bewerber über dich wissen.",
          "unterschrift": "Eigene Darstellung von andi fragt."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen zur Einführung von KI im Betrieb",
  "faq": [
    {
      "q": "Ist eine KI-Schulung für Mitarbeiter Pflicht?",
      "a": "Die KI-Verordnung der EU verlangt seit 2. Februar 2025, dass Betriebe, die KI einsetzen, etwas für die KI-Kompetenz ihres Personals tun. Seit der Änderung 2026 musst du kein bestimmtes Niveau garantieren. Eine Schulungsform oder ein Zertifikat ist nicht vorgeschrieben. Das ist keine Rechtsberatung."
    },
    {
      "q": "Muss der Betriebsrat der Einführung von ChatGPT oder Copilot zustimmen?",
      "a": "Das hängt davon ab, was das Werkzeug mit den Daten der Beschäftigten macht. Verarbeitet es personenbezogene Daten über allgemeine Angaben hinaus oder eignet es sich zur Kontrolle, die die Menschenwürde berührt, braucht es nach Paragraf 96a oder 96 Arbeitsverfassungsgesetz in der Regel die Zustimmung. Das ist im Einzelfall zu prüfen. Das ist keine Rechtsberatung."
    },
    {
      "q": "Was tun, wenn Mitarbeiter Angst vor KI haben?",
      "a": "Frag zuerst, wovor genau. Laut Allianz Pulse 2026 gilt die Sorge vor allem dem Arbeitsmarkt, nur 6 % erwarten, dass der eigene Job ganz wegfällt. Sag offen, was du vorhast, und lass die Leute KI an echten Aufgaben ausprobieren."
    },
    {
      "q": "Wie finde ich heraus, wer im Team schon KI nutzt?",
      "a": "Frag anonym und so, dass niemand Ärger fürchten muss. Laut einer Umfrage mit dem IT-Dienstleister Tieto Austria nutzen rund 17 % der Berufstätigen KI-Assistenten, ohne dass ihr Arbeitgeber davon weiß."
    },
    {
      "q": "Berät andi fragt. bei der Auswahl von KI-Werkzeugen?",
      "a": "Nein. andi fragt. ist keine KI-Beratung und bietet keine Schulung an. Wir liefern in einem anonymen Interview die Sicht deines Teams: wer was nutzt, wo die Sorgen liegen und welches Wissen fehlt."
    },
    {
      "q": "Was kostet ein Team-Interview mit andi fragt.?",
      "a": "Das Erstgespräch ist kostenlos. Ein Interview-Modul hat einen Fixpreis nach der Zahl der Personen, die wir fragen, von 2.900 Euro netto für Kleinbetriebe bis 7.400 Euro netto für 51 bis 100 Personen. Jedes weitere Modul kostet deutlich weniger. Alle Stufen stehen auf der [Preisseite](/preise)."
    }
  ],
  "quellen": [
    {
      "titel": "Allianz Pulse 2026 on AI: The Uneasy AI Revolution (14.10.2026)",
      "url": "https://www.allianz-trade.com/en_global/news-insights/economic-insights/Allianz-Pulse-2026-on-AI.html",
      "herkunft": "Allianz Research"
    },
    {
      "titel": "Österreichs Beschäftigte sind auf den KI-Wandel besonders schlecht vorbereitet (15.10.2026)",
      "url": "https://www.leadersnet.at/news/104702,oesterreichs-beschaeftigte-sind-auf-den-ki-wandel-besonders.html",
      "herkunft": "Leadersnet"
    },
    {
      "titel": "KI am Arbeitsplatz: Österreichs Stimmungssaldo fällt auf minus 81 Prozent (14.10.2026)",
      "url": "https://borncity.com/news/ki-am-arbeitsplatz-oesterreichs-stimmungssaldo-faellt-auf-minus-81-prozent/",
      "herkunft": "Borncity"
    },
    {
      "titel": "IKT-Einsatz in Unternehmen 2025",
      "url": "https://www.statistik.at/fileadmin/publications/IKT-Einsatz-in-Unternehmen-2025_barr_Web.pdf",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "Österreichs Unternehmen beim Einsatz von künstlicher Intelligenz im EU-Spitzenfeld (24.06.2026)",
      "url": "https://www.statistik.at/fileadmin/announcement/2026/06/20260624IKTU2025.pdf",
      "herkunft": "Statistik Austria, Pressemitteilung"
    },
    {
      "titel": "KI etabliert sich zunehmend in Österreichs Unternehmen (2026)",
      "url": "https://www.wko.at/oe/news/ki-etabliert-sich-zunehmend-in-oesterreichs-unternehmen",
      "herkunft": "WKO, Umfrage des Market-Instituts"
    },
    {
      "titel": "Jeder sechste Berufstätige nutzt Künstliche Intelligenz heimlich im Job (10.09.2026)",
      "url": "https://www.leadersnet.at/news/103522,jeder-sechste-berufstaetige-nutzt-kuenstliche-intelligenz.html",
      "herkunft": "Leadersnet, Umfrage für Tieto Austria"
    },
    {
      "titel": "Verordnung (EU) 2026/1744, Digital-Omnibus zur KI",
      "url": "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202601744",
      "herkunft": "Amtsblatt der EU"
    },
    {
      "titel": "KI-Verordnung, Artikel 4: KI-Kompetenz",
      "url": "https://ai-act-service-desk.ec.europa.eu/de/ai-act/article-4",
      "herkunft": "Europäische Kommission, AI Act Service Desk"
    },
    {
      "titel": "The Digital Omnibus on AI enters into force today (27.07.2026)",
      "url": "https://www.lewissilkin.com/insights/2026/07/27/the-digital-omnibus-on-ai-enters-into-force-today",
      "herkunft": "Lewis Silkin"
    },
    {
      "titel": "FAQ der KI-Servicestelle",
      "url": "https://www.rtr.at/rtr/service/ki-servicestelle/faq",
      "herkunft": "RTR"
    },
    {
      "titel": "Digital-Omnibus-Verordnung zur KI in Kraft getreten (03.08.2026)",
      "url": "https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858",
      "herkunft": "IHK Lüneburg-Wolfsburg"
    },
    {
      "titel": "Arbeitsverfassungsgesetz, Paragraf 96 und 96a",
      "url": "https://www.jusline.at/gesetz/arbvg/paragraf/96a",
      "herkunft": "ArbVG über JUSLINE"
    },
    {
      "titel": "Arbeitsvertragsrechts-Anpassungsgesetz, Paragraf 10",
      "url": "https://www.jusline.at/gesetz/avrag/paragraf/10",
      "herkunft": "AVRAG über JUSLINE"
    },
    {
      "titel": "Mitbestimmung von Betriebsräten bei der Einführung von KI-Tools (2024)",
      "url": "https://plus.ac.at/wp-content/uploads/2024/07/2024.06.26_KI_Mitbestimmung.pdf",
      "herkunft": "Elias Felten, Universität Salzburg"
    },
    {
      "titel": "OGH 9 ObA 114/04m (15.12.2004)",
      "url": "https://gesetzefinden.at/judikatur/ogh/jjt_20041215_ogh0002_009oba00114_04m0000_000",
      "herkunft": "Oberster Gerichtshof"
    }
  ],
  "seitenleisteFrage": "Was denkt dein Team über KI?",
  "abschlussTitel": "Was denkt dein Team über KI?",
  "passend": [
    "mitarbeiterbefragung-ergebnisse",
    "mitarbeiter-halten-ohne-gehaltserhoehung",
    "warum-kuendigen-gute-mitarbeiter"
  ]
};

export default beitrag;

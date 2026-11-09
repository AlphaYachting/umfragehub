// Beitrag Nr. 24 im Wissensbereich: /wissen/marketing-mit-ki-selbst-machen
// Inhalte aus n15.py und grafik_n15.py (Arbeitsfläche andi fragt. Produktseite), umgewandelt am 05.11.2026.
// Status entwurf. Belege im Projekt unter analyse/.
const beitrag = {
  "slug": "marketing-mit-ki-selbst-machen",
  "nr": 24,
  "status": "entwurf",
  "geprueft": null,
  "erschienen": null,
  "aktualisiert": null,
  "leitartikel": false,
  "modul": "kunden",
  "etikett": "Kunden",
  "themen": [
    "Kunden",
    "Positionierung"
  ],
  "seitentitel": "Marketing mit KI selber machen: Wer prüft es? | andi fragt.",
  "beschreibung": "Marketing mit KI selber machen: Was KI gut kann, wie du Fakten und Recht prüfst und warum nur deine Kunden sagen, ob deine Botschaft wirklich wirkt.",
  "teaser": "Viele Betriebe machen ihr Marketing jetzt selbst mit KI. Wie du Fakten, Recht und Wirkung prüfst und warum nur deine Kunden sagen, ob es stimmt.",
  "kurztitel": "Marketing mit KI selbst machen",
  "titel": "Marketing selbst mit KI:",
  "titelAkzent": "Wer prüft, ob es stimmt?",
  "titelbild": {
    "src": "/bilder/team.webp",
    "alt": "Titelgrafik: Drei Felder untereinander. Stimmt es: Fakten und Zahlen, mit Checkliste. Darf ich das: Recht und Kennzeichnung, mit Checkliste. Wirkt es, pink hervorgehoben: Botschaft und Kaufgrund, nur mit deinen Kunden.",
    "unterschrift": "KI schreibt schnell und plausibel. Ob es für deine Kunden stimmt, wissen nur deine Kunden.",
    "platzhalter": "Platzhalter Titelbild: Unternehmer am Schreibtisch mit Laptop und ausgedrucktem Text mit Markierungen, 1600 x 900 px"
  },
  "titelgrafik": true,
  "kurzAntwort": "Prüf KI-Texte im Marketing auf drei Ebenen. Stimmt es? Zahlen, Namen, Preise und Versprechen prüfst du an der Originalquelle. Darf ich das? Irreführung, Kennzeichnung, Bilder und Kundendaten prüfst du mit einer Checkliste. Wirkt es bei deinen Kunden? Das beantwortet keine Checkliste, nur deine Kunden selbst.",
  "wichtigstes": [
    {
      "fett": "KI ist im Betrieb angekommen.",
      "text": "Laut Statistik Austria nutzen 2026 schon 48 % der Unternehmen ab 10 Beschäftigten KI, 2025 waren es 30 %. Wer KI nutzt, setzt sie am häufigsten in Marketing oder Verkauf ein: 67,5 %.",
      "akzent": false
    },
    {
      "fett": "Fehler kommen durch.",
      "text": "In einer Studie der US-Agentur NP Digital sagen 36,5 % der befragten US-Marketer, dass falsche KI-Inhalte schon veröffentlicht wurden.",
      "akzent": false
    },
    {
      "fett": "Zwei Ebenen schaffst du mit Checkliste.",
      "text": "Ob Fakten stimmen und ob du etwas darfst, kannst du selbst prüfen. Ob eine Botschaft wirkt, sagen dir nur deine Kunden.",
      "akzent": false
    },
    {
      "fett": "Deine Kunden als Prüfstein.",
      "text": "Mit andi fragt. erfährst du in Interviews, warum Kunden bei dir kaufen. Daraus werden Botschaften, auch als Grundlage für dein KI-Werkzeug.",
      "akzent": true
    }
  ],
  "kennzahlen": [
    {
      "wert": "48",
      "einheit": " %",
      "text": "der Unternehmen ab 10 Beschäftigten in Österreich nutzen 2026 KI, 2025 waren es 30 %.",
      "quelle": "Statistik Austria, Themenseite IKT-Einsatz, 20.10.2026"
    },
    {
      "wert": "67,5",
      "einheit": " %",
      "text": "der KI-nutzenden Unternehmen setzen KI 2026 in Marketing oder Verkauf ein, öfter als in jedem anderen Bereich. 2025 waren es 45 %.",
      "quelle": "Statistik Austria, Themenseite IKT-Einsatz, 20.10.2026"
    },
    {
      "wert": "36,5",
      "einheit": " %",
      "text": "der befragten US-Marketer sagen, dass falsche KI-Inhalte schon veröffentlicht wurden.",
      "quelle": "NP Digital (Agentur), 565 Befragte, 03.02.2026"
    }
  ],
  "abschnitte": [
    {
      "id": "warum",
      "toc": "Warum so viele Marketing selbst machen",
      "frage": "Warum machen so viele Betriebe ihr Marketing jetzt selbst mit KI?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Weil KI-Werkzeuge in kurzer Zeit im Betrieb angekommen sind. Statistik Austria weist auf ihrer Themenseite zum IKT-Einsatz, aktualisiert am 20. Oktober 2026, die ersten Zahlen für 2026 aus: 48 % der österreichischen Unternehmen ab 10 Beschäftigten in den erfassten Branchen nutzen KI. Ein Jahr davor waren es 30 %. Gefragt wurde von Februar bis Juli 2026."
        },
        {
          "typ": "absatz",
          "text": "Auch wofür, steht dort. Von den Unternehmen, die KI nutzen, setzen sie 2026 genau 67,5 % in Marketing oder Verkauf ein, 2025 waren es 45 %. Das ist der häufigste Bereich, vor Management und Organisation mit 51,4 %, Produktions- oder Dienstleistungsprozessen mit 40,6 % und dem Finanz- und Rechnungswesen mit 24,3 %. Schon 2025 erzeugten 51 % der KI-nutzenden Unternehmen damit Texte, Sprache oder Programmcode."
        },
        {
          "typ": "balken",
          "titel": "Wofür Unternehmen in Österreich KI einsetzen",
          "dick": true,
          "zeilen": [
            {
              "label": "Marketing oder Verkauf",
              "wert": "67,5 %",
              "anteil": 68,
              "akzent": true
            },
            {
              "label": "Management und Organisation betriebswirtschaftlicher Prozesse",
              "wert": "51,4 %",
              "anteil": 51
            },
            {
              "label": "Produktions- oder Dienstleistungsprozesse",
              "wert": "40,6 %",
              "anteil": 41
            },
            {
              "label": "Finanz- und Rechnungswesen",
              "wert": "24,3 %",
              "anteil": 24
            }
          ],
          "fazit": "Wer in Österreich KI nutzt, nutzt sie am häufigsten für Marketing und Verkauf.",
          "unterschrift": "Statistik Austria, Themenseite IKT-Einsatz in Unternehmen, Grafik erstellt am 20.10.2026. Anteil an allen Unternehmen ab 10 Beschäftigten, die KI nutzen, Befragung Februar bis Juli 2026. Auswahl der Bereiche."
        },
        {
          "typ": "absatz",
          "text": "Eine Umfrage von MARKET für die Wirtschaftskammer (500 Betriebe, Dezember 2025 bis Jänner 2026) zeigt ein ähnliches Bild: Von den Betrieben, die KI nutzen oder testen, setzen 40 % sie in Marketing und Kundenbindung ein, 80 % von ihnen verwenden ChatGPT."
        },
        {
          "typ": "absatz",
          "text": "KI ist ein gutes Werkzeug. Die Frage ist eine andere: Wer prüft, ob das Ergebnis stimmt und zu deinem Unternehmen passt?"
        }
      ]
    },
    {
      "id": "kann",
      "toc": "Was KI im Marketing gut kann",
      "frage": "Was kann KI im Marketing gut, und wo stößt sie an Grenzen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "KI ist stark, wo es um Menge und Form geht. Sie schreibt in Sekunden einen ersten Entwurf, macht Varianten für Anzeigen, kürzt, übersetzt und fasst zusammen."
        },
        {
          "typ": "absatz",
          "text": "Schwach ist sie dort, wo es um dein Unternehmen geht. Ein Sprachmodell schreibt, was zu deiner Anfrage plausibel klingt. Ob jede Zahl stimmt, weiß es nicht sicher. Und was deine Kunden an dir schätzen, weiß es gar nicht, wenn du es ihm nicht sagst."
        },
        {
          "typ": "absatz",
          "text": "Wie oft dabei etwas schiefgeht, zeigt eine Studie der US-Agentur NP Digital, also eines Anbieters, vom Februar 2026 unter 565 Marketern in den USA, die mit KI arbeiten. 47,1 % stoßen mehrmals pro Woche auf Fehler der KI, 36,5 % sagen, dass falsche KI-Inhalte schon veröffentlicht wurden."
        },
        {
          "typ": "balken",
          "titel": "Was US-Marketer über Fehler der KI berichten",
          "dick": true,
          "zeilen": [
            {
              "label": "Stoßen mehrmals pro Woche auf Fehler der KI",
              "wert": "47,1 %",
              "anteil": 47
            },
            {
              "label": "Falsche KI-Inhalte wurden schon veröffentlicht",
              "wert": "36,5 %",
              "anteil": 37,
              "akzent": true
            }
          ],
          "fazit": "Fehler sind kein Ausnahmefall. Die Frage ist, ob sie vor der Veröffentlichung jemand findet.",
          "unterschrift": "NP Digital (Agentur, also Anbieterstudie), AI Hallucination and Accuracy, 03.02.2026. 565 Marketer in den USA, die KI nutzen."
        },
        {
          "typ": "begriff",
          "text": "Halluzination nennt man es, wenn ein KI-Werkzeug etwas Falsches als Tatsache formuliert, etwa eine erfundene Zahl oder eine Quelle, die es nicht gibt."
        },
        {
          "typ": "absatz",
          "text": "Die zweite Grenze betrifft die Wirkung. In einem Experiment von Anil Doshi und Oliver Hauser (Science Advances, 2024) schrieben 293 Personen kurze Geschichten, ein Teil mit Ideen einer KI. Diese Geschichten galten als kreativer, waren einander aber ähnlicher. Schreibt deine ganze Branche mit denselben Werkzeugen, klingen am Ende viele gleich. Mehr dazu im Beitrag [Warum KI-Texte gleich klingen](/wissen/ki-texte-klingen-gleich)."
        }
      ]
    },
    {
      "id": "ebenen",
      "toc": "Drei Ebenen der Prüfung",
      "frage": "Wie prüfst du KI-Texte im Marketing, bevor sie online gehen?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Prüf auf drei Ebenen. Jede hat ihre eigene Frage und ihr eigenes Werkzeug."
        },
        {
          "typ": "stufen",
          "titel": "Drei Ebenen der Prüfung für KI-Texte im Marketing",
          "stufen": [
            {
              "titel": "1 Stimmt es?",
              "text": "Zahlen, Namen, Preise, Versprechen. Prüfbar mit Checkliste und Originalquelle.",
              "breite": 56
            },
            {
              "titel": "2 Darf ich das?",
              "text": "Irreführung, Kennzeichnung, Bilder, Kundendaten. Prüfbar mit Checkliste, im Zweifel mit Fachleuten.",
              "breite": 74
            },
            {
              "titel": "3 Wirkt es bei meinen Kunden?",
              "text": "Botschaft und Kaufgrund. Prüfbar nur mit deinen Kunden.",
              "breite": 95,
              "akzent": true
            }
          ],
          "fazit": "Die ersten zwei Ebenen schaffst du mit Disziplin am Schreibtisch. Für die dritte musst du hinaus zu deinen Kunden.",
          "unterschrift": "Eigene Darstellung von andi fragt."
        },
        {
          "typ": "absatz",
          "text": "Selbstverständlich ist schon die erste Ebene nicht. Im AI Sentiment Index 2025 des Beratungsunternehmens EY sagten von über 1.000 Menschen in Deutschland nur 27 %, dass sie Ergebnisse von KI wie Texte oder Übersetzungen gegenprüfen. Gefragt wurden Menschen allgemein, keine Marketing-Fachleute. In einer Umfrage des Softwareanbieters Ahrefs vom September 2026 unter 301 Befragten aus dem Marketing, darunter Gründer und Inhaber, nutzen 93 % KI für Inhalte, 66 % vertrauen ihr nur nach Prüfung durch einen Menschen. Aus welchen Ländern sie kommen, nennt Ahrefs nicht. Wie du dabei Schritt für Schritt vorgehst, zeigt der Beitrag [KI-Texte überprüfen](/wissen/ki-texte-ueberpruefen)."
        },
        {
          "typ": "absatz",
          "text": "Zur zweiten Ebene: Nach Paragraf 2 Absatz 1 UWG ist eine Geschäftspraktik irreführend, wenn sie unrichtige Angaben enthält oder sonst geeignet ist, über Punkte wie die wesentlichen Merkmale des Produkts, den Preis oder die Eigenschaften des Unternehmers so zu täuschen, dass jemand eine geschäftliche Entscheidung trifft, die er sonst nicht getroffen hätte. Das Gesetz fragt nach der Angabe, nicht danach, wer sie geschrieben hat."
        },
        {
          "typ": "absatz",
          "text": "Seit 2. August 2026 gilt die KI-Verordnung allgemein, damit auch Artikel 50 mit den Transparenzpflichten. Wer als Unternehmen mit KI Bild-, Ton- oder Videoinhalte erzeugt, die ein Deepfake sind, muss das offenlegen (Artikel 50 Absatz 4 der Verordnung (EU) 2024/1689). Für Texte gilt das nur, wenn sie die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse informieren sollen und kein Mensch sie redaktionell geprüft und verantwortet hat. Im Zweifel frag die Wirtschaftskammer oder eine Anwältin. Das ist keine Rechtsberatung."
        }
      ]
    },
    {
      "id": "fuehrung",
      "toc": "Was die Führung anders sieht",
      "frage": "Warum sieht die Geschäftsführung ihr Marketing oft anders als die Kunden?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Weil sie ihr Unternehmen von innen kennt. Sie weiß, was investiert wurde und worauf das Team stolz ist. Was davon für Kunden zählt, ist eine andere Frage."
        },
        {
          "typ": "absatz",
          "text": "Die Unternehmensberatung Bain hat 2005 insgesamt 362 Unternehmen gefragt: 80 % glaubten, ihren Kunden ein überlegenes Erlebnis zu bieten. Laut den Kunden traf das nur auf 8 % zu. Die Zahl ist alt und von einem Berater, zeigt aber die Lücke zwischen Innen- und Außensicht."
        },
        {
          "typ": "absatz",
          "text": "Anderson, Narus und van Rossum beschreiben in der Harvard Business Review (2006), dass Manager oft alle Vorteile ihres Angebots auflisten, auch solche, die Kunden egal sind."
        },
        {
          "typ": "absatz",
          "text": "Mit KI wird diese Lücke nicht kleiner. Das Werkzeug macht aus deiner Sicht gut klingende Sätze. In der Ahrefs-Umfrage fanden 43 % der Gründer und Inhaber, ihre KI-Inhalte seien besser als von Menschen geschriebene. Bei Marketern auf Einstiegs- und mittlerer Ebene waren es 17 %. Typisch sind drei Lücken:"
        },
        {
          "typ": "karten",
          "karten": [
            {
              "symbol": "ziel",
              "titel": "Stärke statt Kaufgrund",
              "text": "Ein ausgedachtes Beispiel: Die Website betont den neuen Maschinenpark. Die Kunden bleiben, weil bei einer Störung noch am selben Tag jemand zurückruft."
            },
            {
              "symbol": "sprechblase",
              "titel": "Branchenwörter statt Kundenwörter",
              "text": "Die Führung schreibt von Lösungen und Qualität. Kunden beschreiben ihr Problem oft in ganz anderen Worten."
            },
            {
              "symbol": "gruppe",
              "titel": "Alle Kunden statt der richtigen",
              "text": "Der Text spricht jeden an. Die Kunden, die dir am meisten bringen, kaufen vielleicht aus einem ganz eigenen Grund."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "KI schreibt aus dem Durchschnitt dessen, was im Netz steht. Die Führung schreibt aus der Innensicht. Ob eine Botschaft für deine Kunden stimmt, wissen nur deine Kunden und die Leute, die täglich mit ihnen arbeiten."
        },
        {
          "typ": "vierfeld",
          "titel": "Woher kommt deine Botschaft, und ist sie belegt?",
          "achseLinks": "Quelle: von deinen Kunden",
          "achseUnten": "Geprüft: von plausibel bis belegt",
          "felder": [
            {
              "kopf": "Richtige Richtung, dünner Boden",
              "text": "Aus Kundengesprächen, aber nur aus der Erinnerung oder von einzelnen Kunden."
            },
            {
              "kopf": "Botschaft, die trägt",
              "text": "Belegt und in den Worten deiner Kunden.",
              "akzent": true
            },
            {
              "kopf": "Klingt gut, sagt nichts",
              "text": "Plausibel, aus dem Durchschnitt, passt auf jeden Mitbewerber."
            },
            {
              "kopf": "Stimmt, aber austauschbar",
              "text": "Fakten geprüft, aber die Aussage gilt für die ganze Branche."
            }
          ],
          "fazit": "Checklisten bringen dich nach rechts. Nach oben kommst du nur mit deinen Kunden.",
          "unterschrift": "Eigene Darstellung von andi fragt., keine Daten."
        }
      ]
    },
    {
      "id": "schritte",
      "toc": "Schritte für gutes KI-Marketing",
      "frage": "Marketing ohne Agentur mit KI: Welche Schritte sichern die Qualität?",
      "bloecke": [
        {
          "typ": "schritte",
          "punkte": [
            {
              "fett": "Gib der KI dein Wissen, nicht nur dein Thema.",
              "text": "Ohne Angaben zu Kunden und Angebot schreibt das Werkzeug Durchschnitt. Leg ein Blatt mit geprüften Fakten und echten Kundenaussagen an und gib es jedes Mal mit."
            },
            {
              "fett": "Markier jede Tatsache.",
              "text": "Markier im Entwurf alle Zahlen, Namen, Daten, Preise und Versprechen. Jede Markierung prüfst du an der Quelle, oder du streichst sie."
            },
            {
              "fett": "Leg eine Rechts-Checkliste an.",
              "text": "Stimmen Preise und Eigenschaften? Darfst du das Bild verwenden? Stecken Kundendaten drin? Im Zweifel fragst du vorher nach."
            },
            {
              "fett": "Lass einen zweiten Menschen lesen.",
              "text": "Am besten jemanden aus Vertrieb oder Service, der täglich mit Kunden spricht. Die Frage: Würde ein Kunde das so sagen?"
            },
            {
              "fett": "Prüf die Botschaft an deinen Kunden.",
              "text": "Frag Kunden, warum sie bei dir gekauft haben und was ihnen fehlen würde. Vergleich die Antworten mit dem, was auf deiner Website steht."
            }
          ]
        },
        {
          "typ": "tipp",
          "text": "Frag Kunden nicht, ob ihnen dein Text gefällt. Frag, warum sie gekauft haben."
        },
        {
          "typ": "absatz",
          "text": "Selbst fragen hat eine Grenze: Im direkten Gespräch sagen Kunden eher, was du hören willst. Eine Meta-Analyse im Journal of Applied Psychology (Richman und Kollegen, 1999) zeigt allgemein: Im persönlichen Interview beschönigen Menschen ihre Antworten stärker als allein und anonym am Computer."
        }
      ]
    },
    {
      "id": "andi",
      "toc": "Wie ein Kunden-Interview hilft",
      "frage": "Wie werden Kunden-Interviews zum Prüfstein für deine KI-Texte?",
      "bloecke": [
        {
          "typ": "absatz",
          "text": "Wir schreiben keine Texte und prüfen keine Fakten oder Rechtsfragen. Wir kümmern uns um die dritte Ebene: was deine Kunden an dir schätzen."
        },
        {
          "typ": "absatz",
          "text": "Deine Kunden antworten anonym am Handy oder am Computer, in rund 15 bis 30 Minuten. Die Antworten lesen Menschen bei Rittler & Co in Graz, du bekommst die Zusammenfassung. Gruppen unter sechs Personen und Freitexte fassen wir zusammen. Ganz ausschließen lässt sich ein Erkennen aber nicht."
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
              "text": "Im Zielgespräch klären wir, welche Kunden du fragen willst und welche Botschaften du prüfen möchtest."
            },
            {
              "verb": "weiß",
              "text": "Wir werten die Antworten aus und zeigen, warum Kunden bei dir kaufen, in ihren eigenen Worten und nach Kundengruppen geordnet."
            },
            {
              "verb": "macht",
              "text": "Du bekommst Botschaften mit Belegen, die du auf Website und in Angeboten nutzt und deinem KI-Werkzeug als Grundlage gibst."
            },
            {
              "verb": "zeigt",
              "text": "Wir stellen dir das Ergebnis vor und zeigen, ob und wo dein heutiges Marketing an deinen Kunden vorbeiredet."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Wie das Kunden-Interview abläuft, steht auf der Seite [Kunden-Interview mit andi fragt.](/kunden). Wie du deinen echten Unterschied zum Mitbewerb findest, zeigt der Beitrag [Alleinstellungsmerkmal finden](/wissen/alleinstellungsmerkmal-finden)."
        },
        {
          "typ": "karten",
          "stil": "ergebnis",
          "karten": [
            {
              "symbol": "ziel",
              "titel": "Die echten Kaufgründe deiner Kunden",
              "text": "Warum Kunden bei dir kaufen und bleiben, nach Kundengruppen geordnet."
            },
            {
              "symbol": "sprechblase",
              "titel": "Botschaften in Kundenworten",
              "text": "Sätze und Belege für Website, Angebote und als Grundlage für dein KI-Werkzeug."
            },
            {
              "symbol": "stern",
              "titel": "Klarheit, was du weglassen kannst",
              "text": "Du siehst, welche Stärken deine Kunden kaum interessieren, und sparst dir Texte dazu."
            }
          ]
        },
        {
          "typ": "absatz",
          "text": "Das ist die Brücke: Die KI schreibt weiter schnell. Aber sie schreibt dann mit dem, was deine Kunden sagen, statt mit dem Durchschnitt aus dem Netz. Die Antwort steckt in deinem Unternehmen."
        }
      ]
    }
  ],
  "faqTitel": "Häufige Fragen zu Marketing mit KI",
  "faq": [
    {
      "q": "Kann ich mein Marketing mit KI selber machen?",
      "a": "Ja. KI hilft bei Entwürfen, Varianten und Übersetzungen. Plane aber Zeit für die Prüfung ein: Fakten an der Quelle, Recht mit einer Checkliste, die Botschaft an deinen Kunden."
    },
    {
      "q": "Muss ich KI-Texte in der Werbung kennzeichnen?",
      "a": "Artikel 50 Absatz 4 der KI-Verordnung verlangt das bei Deepfakes in Bild, Ton oder Video. Für Texte nur, wenn sie über Angelegenheiten von öffentlichem Interesse informieren sollen und kein Mensch sie redaktionell verantwortet. Klär den Einzelfall. Das ist keine Rechtsberatung."
    },
    {
      "q": "Was passiert, wenn ein KI-Text in meiner Werbung falsch ist?",
      "a": "Unrichtige Angaben, etwa zu Eigenschaften oder Preis, können nach Paragraf 2 UWG irreführend sein, egal wer oder was sie geschrieben hat. Das ist keine Rechtsberatung."
    },
    {
      "q": "Wie finde ich heraus, ob meine Marketingbotschaft bei Kunden wirkt?",
      "a": "Frag sie, warum sie bei dir gekauft haben, was ihnen fehlen würde und womit sie dich vergleichen. Leg die Antworten neben deine Website. Offener antworten viele, wenn sie allein und anonym antworten können."
    },
    {
      "q": "Schreibt andi fragt. auch meine Marketingtexte?",
      "a": "Nein. Wir schreiben keine Texte und prüfen keine Fakten oder Rechtsfragen. Wir führen Interviews mit deinen Kunden, Menschen bei Rittler & Co werten sie aus, du bekommst Botschaften in ihren Worten. Die nutzt du selbst weiter, auch mit deinem KI-Werkzeug."
    },
    {
      "q": "Was kostet ein Kunden-Interview mit andi fragt.?",
      "a": "Das Erstgespräch ist kostenlos. Ein Interview-Modul hat einen Fixpreis nach der Zahl der Personen, die wir fragen, von 2.900 Euro netto für Kleinbetriebe bis 7.400 Euro netto für 51 bis 100 Personen. Jedes weitere Modul kostet deutlich weniger. Alle Stufen stehen auf der [Preisseite](/preise)."
    }
  ],
  "quellen": [
    {
      "titel": "IKT-Einsatz in Unternehmen, Themenseite mit Werten 2026 (aktualisiert 20.10.2026)",
      "url": "https://www.statistik.at/statistiken/forschung-innovation-digitalisierung/digitale-wirtschaft-und-gesellschaft/ikt-einsatz-in-unternehmen",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "IKT-Einsatz in Unternehmen 2025 (Publikation)",
      "url": "https://www.statistik.at/fileadmin/publications/IKT-Einsatz-in-Unternehmen-2025_barr_Web.pdf",
      "herkunft": "Statistik Austria"
    },
    {
      "titel": "KI und Robotik in Unternehmen, Umfrage von MARKET (Dezember 2025 bis Jänner 2026)",
      "url": "https://www.wko.at/oe/news/20260616-ki-robotik-unternehmen.pdf",
      "herkunft": "Wirtschaftskammer Österreich"
    },
    {
      "titel": "AI Hallucination and Accuracy: A Data-Backed Study (03.02.2026)",
      "url": "https://neilpatel.com/blog/ai-hallucination-data-study/",
      "herkunft": "NP Digital, Agentur"
    },
    {
      "titel": "AI Sentiment Index 2025 (02.05.2025)",
      "url": "https://www.ey.com/de_de/newsroom/2025/05/ey-ai-sentiment-index-2025",
      "herkunft": "EY, Pressemitteilung"
    },
    {
      "titel": "69% of Marketers Are Publishing More AI Content Than Last Year (30.09.2026)",
      "url": "https://ahrefs.com/blog/marketers-ai-content-creation",
      "herkunft": "Ahrefs, Softwareanbieter"
    },
    {
      "titel": "Generative AI enhances individual creativity but reduces the collective diversity of novel content (2024)",
      "url": "https://datadryad.org/dataset/doi:10.5061/dryad.qfttdz0pm",
      "herkunft": "Doshi, Hauser, Science Advances"
    },
    {
      "titel": "Closing the delivery gap (2005)",
      "url": "https://bain.com/insights/closing-the-delivery-gap-newsletter",
      "herkunft": "Bain & Company"
    },
    {
      "titel": "Customer Value Propositions in Business Markets (2006)",
      "url": "https://hbr.org/2006/03/customer-value-propositions-in-business-markets",
      "herkunft": "Harvard Business Review"
    },
    {
      "titel": "Bundesgesetz gegen den unlauteren Wettbewerb, Paragraf 2",
      "url": "https://ris.bka.gv.at/Dokumente/Bundesnormen/NOR40279748/NOR40279748.pdf",
      "herkunft": "RIS"
    },
    {
      "titel": "Meta-Analyse zu beschönigten Antworten in Interviews und Fragebögen (1999)",
      "url": "https://doi.org/10.1037/0021-9010.84.5.754",
      "herkunft": "Richman, Weisband, Kiesler, Drasgow, Journal of Applied Psychology"
    },
    {
      "titel": "Verordnung (EU) 2024/1689 (KI-Verordnung), Artikel 50 und 113",
      "url": "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32024R1689",
      "herkunft": "EUR-Lex"
    },
    {
      "titel": "Verordnung (EU) 2026/1744 (Digital-Omnibus zur KI)",
      "url": "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=OJ:L_202601744",
      "herkunft": "EUR-Lex"
    }
  ],
  "seitenleisteFrage": "Stimmt dein Marketing für deine Kunden?",
  "abschlussTitel": "Stimmt dein Marketing für deine Kunden?",
  "passend": [
    "ki-texte-ueberpruefen",
    "ki-texte-klingen-gleich",
    "alleinstellungsmerkmal-finden"
  ]
};

export default beitrag;

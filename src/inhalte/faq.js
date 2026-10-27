// FAQ der öffentlichen Seiten von andifragt.at (Stand 27.10.2026).
// Quelle: Dokument "FAQ-Texte andifragt.at". Aus diesen Daten entstehen der sichtbare
// Block und die strukturierten Daten (FAQPage), damit beide nie auseinanderlaufen.
//
// Regeln: immer Interview, nie Befragung. Keine Gedankenstriche, typografischen
// Anführungszeichen oder Mittelpunkte (Gilroy hat sie nicht).
// Text in [eckigen Klammern] ist ein offener Platzhalter: Er wird gestrichelt markiert
// angezeigt und nicht in die strukturierten Daten übernommen. Vor dem Veröffentlichen klären.
//
// Felder je Frage: q (Frage), kopf (erster Satz, fett), text (Rest), optional
// schritte (Ablauf mit Wortmarken), beispiel (Praxisbeispiel, Platzhalter), g (Gruppe für den Filter).

export const FAQ = {
  startseite: {
    etikett: "Häufige Fragen zu andi fragt.",
    titelA: "Gute Fragen verdienen",
    titelB: "ehrliche Antworten.",
    lead: "Was Geschäftsführer, Personal- und Vertriebsverantwortliche uns vor dem ersten Gespräch fragen. Und was Eingeladene wissen wollen, bevor sie antworten.",
    filter: true,
    fragen: [
      {
        g: "auftrag",
        q: "Was ist andi fragt.?",
        kopf: "andi fragt. holt das Wissen ans Licht, das in deinem Unternehmen längst da ist, aber selten bei der Geschäftsführung ankommt.",
        text: "Warum Kunden wirklich kaufen, warum gute Leute bleiben oder gehen, woran Abschlüsse hängen. Rittler & Co, Werbeagentur in Graz, findet zuerst heraus, welche Fragen dafür die richtigen sind, und stellt sie dann in anonymen Interviews an Führung, Team, Vertrieb und Kunden. Am Ende steht eine Grundlage für Entscheidungen, keine Datensammlung.",
      },
      {
        g: "auftrag",
        q: "Woher wisst ihr, welche Fragen bei uns die richtigen sind?",
        kopf: "Aus über 500 Markenprojekten.",
        text: "Dabei haben wir gelernt, dass sich Unternehmen fast immer an denselben Stellen verschätzen, nur bei jedem mit anderem Inhalt: beim Kaufgrund der Kunden, beim Grund, warum gute Leute gehen, beim Argument, an dem Abschlüsse hängen. Im Zielgespräch finden wir heraus, wo diese Stellen bei dir liegen, und richten die Fragen genau dorthin. Ein bewährter Kern bleibt gleich, damit die Ergebnisse vergleichbar sind.",
      },
      {
        g: "auftrag",
        q: "Kann ich das nicht selbst mit KI oder einem Formular machen?",
        kopf: "Die Fragen aufschreiben kannst du selbst, eine KI hilft dir dabei gern.",
        text: "Sie weiß aber nicht, welche Annahme in deinem Unternehmen falsch ist, und stellt deshalb die Fragen, die jeder stellt. Dazu kommt: Wenn der Chef selbst fragt, antworten Mitarbeitende und Kunden vorsichtig. Wir sind die neutrale Stelle, wissen, wo wir nachhaken, und lesen die Antworten mit Blick darauf, was daraus für Marke, Team und Vertrieb folgt.",
      },
      {
        g: "auftrag",
        q: "Wie läuft ein Projekt mit andi fragt. ab?",
        kopf: "Es beginnt mit der Einschätzung, nicht mit dem Fragebogen.",
        text: "",
        schritte: [
          { verb: "fragt", text: "Im Zielgespräch klären wir Lage, Ziele und Annahmen und entwickeln daraus für jede Gruppe ein eigenes Interview, das anonym beantwortet wird." },
          { verb: "weiß", text: "Wir verdichten alle Antworten mit der ANDI-Methode." },
          { verb: "macht", text: "Aus den Abweichungen werden klare Empfehlungen." },
          { verb: "zeigt", text: "Wir präsentieren dir die Ergebnisse persönlich und legen die nächsten Schritte fest." },
        ],
      },
      {
        g: "auftrag",
        q: "Wie viel Zeit muss ich selbst investieren?",
        kopf: "Rund [drei Stunden, verteilt über vier bis sechs Wochen].",
        text: "Das Zielgespräch, die Freigabe des Interviews und die Präsentation. Alles dazwischen, vom Entwickeln der Fragen bis zur Auswertung, erledigen wir. Für jede teilnehmende Person dauert ein Interview [10 bis 20 Minuten], ohne Termin und ohne Anreise.",
      },
      {
        g: "auftrag",
        q: "Was kostet ein Projekt mit andi fragt.?",
        kopf: "Weniger als eine einzige Fehlbesetzung oder ein Website-Relaunch in die falsche Richtung.",
        text: "Ein Team-Interview für einen Betrieb bis [50] Mitarbeitende beginnt bei [X Euro]. Enthalten sind Zielgespräch, Entwicklung des Interviews, Auswertung durch unsere Strategen und Präsentation bei dir. Mehr Gruppen, Kunden als zusätzliche Gruppe oder mehrere Standorte erhöhen den Aufwand. Den Fixpreis bekommst du nach dem Erstgespräch.",
      },
      {
        g: "auftrag",
        q: "Lohnt sich das auch für einen Betrieb mit 30 Leuten?",
        kopf: "Gerade dort.",
        text: "In kleinen Betrieben glaubt der Chef, alles zu wissen, weil er jeden kennt, und genau deshalb sagt ihm niemand alles. Damit jede Antwort anonym bleibt, braucht eine Gruppe mindestens [6] Interviews, 30 Leute werten wir also in wenigen Gruppen oder als Ganzes aus. Nach oben gibt es keine Grenze: Meist interviewen wir 5 bis 100 Personen, auf Wunsch bis zu deinen Kunden.",
      },
      {
        g: "auftrag",
        q: "Wer liest die Antworten, und wo liegen sie?",
        kopf: "Gelesen werden die Antworten nur vom Projektteam bei Rittler & Co in Graz.",
        text: "Du als Auftraggeber bekommst sie ausschließlich gebündelt. [Speicherort, Löschfrist und Rechtsgrundlage prüfen und ergänzen.]",
      },
      {
        g: "eingeladen",
        q: "Erfährt mein Chef, was ich antworte?",
        kopf: "Nein.",
        text: "Niemand sieht, wer was geantwortet hat. Ergebnisse gibt es nur gebündelt und erst, wenn genug Kolleginnen und Kollegen teilgenommen haben, kleine Bereiche fassen wir zusammen. Offene Antworten geben wir so wieder, dass niemand erkennbar ist. Genau deshalb kannst du ehrlich sein, auch wenn die Antwort unbequem ist.",
      },
      {
        g: "eingeladen",
        q: "Ich habe eine Einladung bekommen. Ist das seriös?",
        kopf: "Ja.",
        text: "Ein Unternehmen, für das du arbeitest oder dessen Kunde du bist, hat Rittler & Co, Werbeagentur in Graz, beauftragt, deine ehrliche Einschätzung einzuholen. Die Teilnahme ist freiwillig und kostenlos, dauert [10 bis 20 Minuten] und geht am Handy oder am Computer, unterbrechen inklusive. Öffne den Link aus deiner Einladung oder gib deinen Code gleich hier unten ein. Funktioniert er nicht, ruf uns an.",
      },
    ],
  },

  positionierung: {
    etikett: "Fragen zur Positionierung",
    titelA: "Klarheit, bevor",
    titelB: "du investierst.",
    lead: "Was Unternehmer wissen wollen, bevor sie ihre Positionierung neu aufstellen.",
    verweis: true,
    fragen: [
      {
        q: "Wie finden wir heraus, wofür uns Kunden wirklich bezahlen?",
        kopf: "Indem man die fragt, die es wissen, und zwar mit den richtigen Fragen.",
        text: "Für die Markenpositionierung mit andi fragt. prüfen wir im Zielgespräch zuerst dein Bild vom Unternehmen und entwickeln daraus Interviews für Geschäftsführung, Team und Stammkunden. Wo die drei Sichten auseinandergehen, liegt meist der Unterschied, den du heute verschenkst.",
        beispiel: "[Beispiel, zu ersetzen: Ein Fensterbauer warb seit Jahren mit Qualität. Im Interview nannten seine Kunden fast alle dasselbe: dass die Montage auf die Minute pünktlich war.]",
      },
      {
        q: "Reicht nicht ein Workshop mit der Geschäftsführung?",
        kopf: "Ein Workshop sammelt, was die Führung über sich denkt. Wir prüfen es.",
        text: "Team und Kunden antworten anonym auf Fragen, die gezielt dort ansetzen, wo sich Unternehmen erfahrungsgemäß falsch einschätzen. So entscheidest du über deine Positionierung auf Basis dessen, was draußen ankommt, und nicht dessen, was drinnen gut klingt. Die Diskussion gibt es trotzdem, in der Präsentation bei dir.",
      },
      {
        q: "Wir haben schon ein Leitbild. Brauchen wir das trotzdem?",
        kopf: "Ein Leitbild beschreibt, wer ihr sein wollt.",
        text: "Die Positionierung legt fest, wofür Kunden euch bezahlen und womit ihr euch vom Mitbewerb abhebt. Oft liegen beide auseinander, etwa wenn die Website von Tradition spricht und Kunden wegen Betreuung und Tempo kaufen. Das Interview macht diese Lücke sichtbar. Ein gutes Leitbild bleibt, es bekommt Beweise.",
      },
      {
        q: "Woran merke ich, dass wir eine neue Positionierung brauchen?",
        kopf: "An drei Signalen.",
        text: "Gespräche landen immer öfter beim Preis. Dein Team kann einem Neukunden nicht in zwei Sätzen sagen, warum er bei euch kaufen soll. Und deine Website würde mit anderem Logo auch zum Mitbewerb passen. Spätestens vor einer größeren Investition in den Auftritt, etwa Website, Messestand oder Übergabe an die nächste Generation, lohnt sich der Blick von außen.",
      },
      {
        q: "Was habe ich am Ende in der Hand?",
        kopf: "Eine Entscheidungsgrundlage, keinen Datenbericht.",
        text: "Ein Analyse-Handout mit allen Abweichungen, die Präsentation bei dir und Empfehlungen für die nächsten 90 Tage. Dazu deine Positionierung auf einer Seite mit Versprechen, drei Beweisen, Tonalität und dem, was ihr nicht mehr sagt. Sie steuert ab sofort Website, Angebot, Messestand und Stellenanzeige.",
      },
      {
        q: "Setzt ihr die Positionierung auch um?",
        kopf: "Ja.",
        text: "Hinter andi fragt. steht Rittler & Co, Werbeagentur in Graz. Das Interview ist der Kern des ANDI-Markenprüfstands, und auf Wunsch setzen wir die Positionierung gleich um, von der Kernbotschaft bis zur Website. Weil Analyse und Umsetzung aus einer Hand kommen, geht zwischen Erkenntnis und Auftritt nichts verloren. Du kannst die Ergebnisse aber genauso mit deinem eigenen Team umsetzen.",
      },
    ],
  },

  team: {
    etikett: "Fragen zum Team-Interview",
    titelA: "Was Chefs vorher",
    titelB: "wissen wollen.",
    lead: "Die Fragen, die uns Geschäftsführer und Personalverantwortliche vor einem Team-Interview stellen.",
    verweis: true,
    fragen: [
      {
        // Suchbegriff-Fassung (offen): Warum ein Team-Interview statt einer klassischen Mitarbeiterbefragung?
        q: "Warum ein Team-Interview statt eines Zufriedenheitsfragebogens?",
        kopf: "Weil Zufriedenheit nicht erklärt, warum gute Leute gehen.",
        text: "Ein Fragebogen misst Stimmung, mit denselben Fragen für jeden Betrieb. Das Team-Interview setzt dort an, wo sich Chefs erfahrungsgemäß verschätzen: was Leute wirklich hält, was sie bremst und wofür Geld ausgegeben wird, das niemand vermisst. Dazu legen wir deine Einschätzung neben die deines Teams.",
        beispiel: "[Beispiel, zu ersetzen: Ein Geschäftsführer schätzte, dass sich 80 % gut informiert fühlen. Im Team waren es 48 %.]",
      },
      {
        q: "Was, wenn mein Team Dinge sagt, die ich nicht hören will?",
        kopf: "Dann hat sich das Interview schon gelohnt.",
        text: "Unangenehme Antworten sind die wertvollsten, weil du sonst erst davon erfährst, wenn ein guter Mitarbeiter kündigt. Wir besprechen die Ergebnisse zuerst mit dir, ordnen sie ein und zeigen, was wirklich Gewicht hat und was Einzelstimmen sind. Was du danach dem Team sagst, entscheidest du, und wir helfen dir, die richtigen Worte zu finden.",
      },
      {
        q: "Wir haben schon einmal gefragt, und nichts ist passiert. Warum diesmal?",
        kopf: "Weil wir das Danach von Anfang an mitplanen.",
        text: "Ein Interview ohne Folgen ist der häufigste Grund, warum beim nächsten Mal niemand mehr ehrlich antwortet. Im Zielgespräch legen wir fest, was du mit den Ergebnissen tun willst und was du dem Team zurückmeldest. Du bekommst drei Prioritäten statt einer Liste mit 40 Baustellen, und nach sechs Monaten zeigt ein kurzer Puls, ob sich etwas bewegt hat.",
      },
      {
        q: "Ab wie vielen Mitarbeitenden bleibt das Team-Interview anonym?",
        kopf: "Eine Gruppe wird erst gezeigt, wenn mindestens [6] Interviews da sind.",
        text: "Kleinere Bereiche fassen wir zusammen, ein Team mit acht Leuten werten wir also als eine Gruppe aus. Vorher siehst du nur, wie viele schon teilgenommen haben, keine Antworten und keine Tendenz.",
      },
      {
        q: "Wie bekomme ich mein Team dazu, mitzumachen?",
        kopf: "Am meisten wirkt, wenn du vorab selbst sagst, warum du fragst und dass du die Ergebnisse teilst.",
        text: "Den Rest übernehmen wir: eine Einladung, die den Zweck erklärt, eine klare Zusage zur Anonymität und [eine Erinnerung]. Die Fragen sind ohne Fachsprache formuliert und funktionieren vom Lehrling bis zur Geschäftsführung, auch am Handy in der Pause.",
      },
      {
        q: "Muss der Betriebsrat zustimmen?",
        kopf: "Gibt es bei euch einen Betriebsrat, binden wir ihn vor dem Start ein und zeigen ihm Fragen und Ablauf.",
        text: "Ob eine Zustimmung nötig ist, hängt davon ab, welche Fragen gestellt werden und ob Antworten einzelnen Personen zugeordnet werden können. Weil das Team-Interview anonym und gebündelt ausgewertet wird, ist der Betriebsrat meist ein Verbündeter statt eine Hürde. [Rechtlich prüfen lassen.]",
      },
      {
        q: "Hilft uns das, gute Leute zu finden?",
        kopf: "Ja, und zwar mit den Worten deines eigenen Teams.",
        text: "Aus den Antworten wird klar, warum man wirklich bei euch arbeitet, und daraus entstehen Sätze für Stellenanzeigen, die echt klingen. Die ziehen Bewerberinnen und Bewerber an, die zu euch passen, statt nur die, die irgendeinen Job suchen. Gleichzeitig erfährst du, was gute Leute bremst, bevor sie gehen.",
      },
      {
        q: "Was bekomme ich nach dem Team-Interview?",
        kopf: "Keine Stimmungskurve, sondern Prioritäten.",
        text: "Wo du und dein Team am weitesten auseinanderliegen, wo du Leute verlierst und wo du Geld ausgibst, das nichts bewirkt. Dazu konkrete Maßnahmen und Sätze für deine Arbeitgebermarke. Alles persönlich bei dir präsentiert, nach sechs Monaten folgt ein kurzer Puls, danach reicht für die meisten Betriebe [ein Interview pro Jahr].",
      },
    ],
  },

  kunden: {
    etikett: "Fragen zum Kunden-Interview",
    titelA: "Bevor du deine",
    titelB: "Kunden fragst.",
    lead: "Was Unternehmer wissen wollen, bevor sie ihre eigenen Kunden zu einem Interview einladen.",
    verweis: true,
    fragen: [
      {
        // Suchbegriff-Fassung (offen): Was erfahre ich im Kunden-Interview, was mir eine Kundenbefragung nicht sagt?
        q: "Was erfahre ich im Kunden-Interview, was mir keine Zufriedenheitsnote sagt?",
        kopf: "Das Warum.",
        text: "Eine Note zeigt, wie zufrieden Kunden sind, aber nicht, warum sie bei dir kaufen, warum sie gehen und was sie woanders kaufen, obwohl sie es lieber bei dir hätten. Welche dieser Fragen für dich gerade zählt, legen wir im Zielgespräch fest. Unsere Strategen lesen jede Antwort und machen daraus Argumente und Maßnahmen.",
        beispiel: "[Praxisbeispiel einsetzen: was ein Auftraggeber über seine Kunden vermutete und was das Interview zeigte.]",
      },
      {
        q: "Nerven wir unsere Kunden damit nicht?",
        kopf: "In der Regel nicht, denn gefragt zu werden empfinden Kunden als Wertschätzung.",
        text: "Die Einladung kommt mit deinem Namen, das Interview führen wir als neutrale Stelle, und es dauert [10 bis 15 Minuten]. Ein Kunde, der einmal sagen durfte, was ihn stört, bleibt eher als einer, den niemand gefragt hat.",
      },
      {
        q: "Welche Kunden sollen wir fragen?",
        kopf: "Das hängt von der Entscheidung ab, die ansteht, und genau das klären wir vorab.",
        text: "Für Kaufgründe fragen wir Stammkunden und neue Kunden, für Abwanderung ehemalige, für Wachstum jene, die heute nur einen Teil bei dir kaufen. Diese Gruppen werten wir getrennt aus. Je Gruppe brauchen wir mindestens [6] Antworten, aussagekräftig wird es ab [10 bis 15].",
      },
      {
        q: "Funktioniert das auch, wenn wir nur Firmenkunden haben?",
        kopf: "Gerade dann.",
        text: "Im B2B hängen viele Kunden an wenigen Ansprechpartnern, jeder Kunde ist viel wert, und Unzufriedenheit zeigt sich erst, wenn Bestellungen ausbleiben. Wir interviewen auf Wunsch mehrere Personen beim selben Kunden, etwa Einkauf, Technik und Geschäftsführung, weil sie oft aus ganz unterschiedlichen Gründen bei dir kaufen.",
      },
      {
        q: "Erfahre ich, welcher Kunde was gesagt hat?",
        kopf: "Nein.",
        text: "Du erfährst, was gesagt wurde, nicht wer es gesagt hat. Genau deshalb sprechen Kunden offen: Sie sitzen nicht dir gegenüber, sondern uns. Bei wenigen, großen Kunden fassen wir Antworten so zusammen, dass niemand erkennbar ist.",
      },
      {
        q: "Was fange ich mit den Antworten meiner Kunden an?",
        kopf: "Du verkaufst mit ihnen.",
        text: "Die echten Kaufgründe in den Worten deiner Kunden kommen direkt auf Website, ins Angebot und ins Verkaufsgespräch. Dazu siehst du, wo Kunden unzufrieden sind, bevor sie es zeigen, und wo Umsatz bei anderen landet. Ist auch dein Team interviewt, legen wir Selbstbild und Kundenbild nebeneinander, dort liegen die größten Chancen.",
      },
    ],
  },

  vertrieb: {
    etikett: "Fragen zum Vertriebs-Interview",
    titelA: "Was Vertriebsleiter",
    titelB: "zuerst fragen.",
    lead: "Bevor du in die nächste Vertriebsidee investierst: die Antworten auf die Fragen, die wir am häufigsten hören.",
    verweis: true,
    fragen: [
      {
        q: "Warum gehen unsere Angebote wirklich verloren?",
        kopf: "Selten aus dem Grund, den der Vertrieb vermutet.",
        text: "Verkäufer nennen meistens den Preis, Kunden oft etwas anderes: einen unklaren Nutzen, zu spätes Nachfassen oder keinen fixen Ansprechpartner. Im Beispiel auf dieser Seite nennen 58 % des Vertriebs den Preis, aber nur 19 % der Kunden (Beispielwerte). Zu teuer heißt oft: Ich sehe den Unterschied nicht.",
        beispiel: "[Praxisbeispiel einsetzen: ein Verkaufsargument, das sich in einem echten Projekt als wirkungslos herausgestellt hat.]",
      },
      {
        q: "Was zeigt das Vertriebs-Interview, was mein CRM nicht zeigt?",
        kopf: "Das CRM zeigt, dass ein Angebot verloren ging, aber nicht, warum.",
        text: "Im Zielgespräch halten wir deine Thesen fest und richten die Fragen dorthin, wo Abschlüsse erfahrungsgemäß hängen: beim Argument, das nicht zieht, beim Nachfassen und beim Umsatz, der bei Bestandskunden woanders landet. Dann fragen wir beide Seiten, Vertrieb und Kunden. Fachleute nennen das Win-Loss-Analyse, wir ergänzen sie um die Innensicht deines Vertriebs.",
      },
      {
        q: "Fühlt sich mein Vertrieb dabei nicht kontrolliert?",
        kopf: "Nein, weil es um den Weg zum Abschluss geht und nicht um die Quote einzelner Verkäufer.",
        text: "Die Antworten sind anonym, es gibt keine Auswertung je Person. Ideen aus dem Team werden von allen bewertet, nach Kundennutzen und nicht nach Hierarchie. Dein Vertrieb zieht beim Umsetzen mit, weil er gefragt wurde.",
      },
      {
        q: "Wir wollen den Vertrieb neu aufstellen. Wann sollten wir fragen?",
        kopf: "Bevor du Geld ausgibst: für ein neues CRM, eine neue Struktur, eine neue Vertriebsleitung oder eine Kampagne.",
        text: "Dann investierst du in geprüfte Annahmen statt in Vermutungen. Deutliche Signale sind sinkende Abschlussquoten, mehr Preisdiskussionen oder Bestandskunden, die einen Teil woanders kaufen. Die, die täglich verkaufen, wissen meist längst, woran es hängt. Sie hat nur noch niemand richtig gefragt.",
      },
      {
        q: "Wie realistisch ist der Umsatzrechner?",
        kopf: "Der Rechner ist ein Rechenbeispiel mit deinen Annahmen, keine Zusage.",
        text: "Er zeigt, was ein einzelner Hebel wert ist: Steigt die Abschlussquote um fünf Punkte, gewinnst du von jedem zwanzigsten Angebot eines mehr. Welche Hebel bei dir am meisten bringen, zeigen erst die Interviews.",
      },
      {
        q: "Was hat mein Vertrieb danach konkret anders?",
        kopf: "Er weiß, welche Sätze überzeugen und welche er streichen kann.",
        text: "Dazu, was Kunden mit ihren Einwänden wirklich meinen und wo bei Bestandskunden das schnellste Wachstum liegt. Daraus entstehen deine drei stärksten Hebel und ein Plan für 90 Tage, gemeinsam mit dem Vertriebsteam erarbeitet. Nach sechs Monaten zeigt ein kurzer Puls, was umgesetzt ist und ob sich die Abschlussquote bewegt hat.",
      },
    ],
  },

  ueberUns: {
    etikett: "Fragen zu Rittler & Co und der ANDI-Methode",
    titelA: "Wer fragt,",
    titelB: "und warum so.",
    lead: "Wer hinter andi fragt. steht, wie die Methode arbeitet und warum eine Werbeagentur die richtigen Fragen stellt.",
    verweis: true,
    fragen: [
      {
        q: "Wer steht hinter andi fragt.?",
        kopf: "Die Rittler & Co GmbH, Werbeagentur in der Peter-Rosegger-Straße 27, 8053 Graz.",
        text: "In [über 20 Jahren] und mehr als 500 Markenprojekten haben wir immer wieder erlebt, dass die besten Antworten schon im Unternehmen stecken und nur niemand die richtigen Fragen stellt. andi fragt. macht aus dieser Erfahrung ein Verfahren.",
      },
      {
        q: "Was ist die ANDI-Methode?",
        kopf: "Das Vorgehen, mit dem Rittler & Co aus Antworten Entscheidungen macht.",
        text: "Es beginnt vor dem ersten Interview, mit der Einschätzung der Lage und der Annahmen, die geprüft werden müssen. Ausgewertet wird jede Antwort in vier Schritten [optional: Aufmerksamkeit, Nutzen, Differenzierung, Identität]. Gesucht wird nicht der Durchschnitt, sondern die Abweichung, weil sie zeigt, wo eine Entscheidung anders ausfallen muss.",
      },
      {
        q: "Wertet eine Software oder eine KI die Antworten aus?",
        kopf: "Nein, die Schlüsse ziehen Menschen.",
        text: "Technik hilft beim Sammeln und Ordnen, gelesen und eingeordnet wird jede Antwort von unseren Strategen. Eine Software zählt, wie oft etwas gesagt wird. Wir erkennen den einen Satz, der deine Positionierung trägt, auch wenn er nur dreimal vorkommt.",
      },
      {
        q: "Warum eine Werbeagentur und kein Marktforschungsinstitut?",
        kopf: "Ein Marktforschungsinstitut beantwortet die Fragen, die man ihm stellt.",
        text: "Wir setzen einen Schritt früher an und klären mit dir, welche Fragen dein Unternehmen weiterbringen. Danach liefern wir, was aus den Antworten folgt: die Botschaft, die Stellenanzeige, das Verkaufsargument. Weil Rittler & Co seit Jahren Marken baut, setzen wir das auf Wunsch gleich um.",
      },
      {
        q: "Arbeitet ihr nur in Graz und der Steiermark?",
        kopf: "Nein.",
        text: "Unser Sitz ist Graz, die Interviews laufen online, daher arbeiten wir mit Unternehmen in ganz [Österreich und im deutschsprachigen Raum]. Zielgespräch und Präsentation führen wir persönlich, [vor Ort oder online].",
      },
    ],
  },

  kontakt: {
    etikett: "Bevor du anrufst",
    titelA: "Was du vorab",
    titelB: "wissen solltest.",
    lead: "Wie das Erstgespräch abläuft, wann du ein Angebot bekommst und was du tun kannst, wenn dein Interview-Link nicht funktioniert.",
    verweis: true,
    ohneKontaktkarte: true,
    fragen: [
      {
        q: "Was passiert im Erstgespräch?",
        kopf: "Im Erstgespräch hören wir zu und schätzen deine Lage ein.",
        text: "Welche Entscheidung steht an, was weißt du schon, was vermutest du nur? Danach sagen wir dir offen, ob ein Interview Sinn ergibt und welches Modul passt. Die eigentlichen Fragen entwickeln wir im Zielgespräch, wenn du beauftragt hast. Das Erstgespräch ist kostenlos und unverbindlich, dauert 30 Minuten und läuft per Video oder Telefon.",
      },
      {
        q: "Was soll ich zum Erstgespräch vorbereiten?",
        kopf: "Nur die Entscheidung, die dich gerade beschäftigt.",
        text: "Hilfreich, aber nicht nötig sind die ungefähre Zahl der Mitarbeitenden je Bereich, welche Kundengruppen es gibt und was du über die Ursachen schon vermutest. Den Rest erarbeiten wir gemeinsam.",
      },
      {
        q: "Ich weiß nicht, welches Modul passt. Was nun?",
        kopf: "Das ist Teil unserer Einschätzung im Erstgespräch.",
        text: "Oft passt mehr als ein Modul, etwa Team und Positionierung, weil Mitarbeitende viel über Kunden wissen. Wenn du noch gar nicht weißt, wo du stehst, ist der ANDI-Markenprüfstand von Rittler & Co die richtige Standortbestimmung.",
      },
      {
        q: "Wie schnell bekomme ich ein Angebot?",
        kopf: "Nach dem Erstgespräch bekommst du dein Angebot [innerhalb von drei Werktagen].",
        text: "Es nennt die Fragestellung, die Gruppen, die Zahl der Personen, den Zeitplan und den Preis.",
      },
      {
        q: "Wie schnell können wir starten?",
        kopf: "Nach dem Zielgespräch entwickeln wir das Interview und legen es dir zur Freigabe vor.",
        text: "Sobald du freigegeben hast, laden wir [innerhalb einer Woche] ein. Die Einladung formulieren wir mit dir, den Zeitraum richten wir nach deinem Kalender, etwa damit Interviews nicht in die Urlaubszeit fallen.",
      },
      {
        q: "Mein Interview-Link funktioniert nicht. Was tun?",
        kopf: "Öffne am besten den Link direkt aus deiner Einladung oder gib deinen Interview-Code auf der Startseite ein.",
        text: "Klappt das nicht, ruf uns an. Wir schicken dir einen neuen Link, deine Antworten bleiben dabei anonym.",
      },
    ],
  },

  preise: {
    etikett: "Fragen zum Preis",
    titelA: "Kurz",
    titelB: "beantwortet.",
    lead: "Was Geschäftsführer, Personal- und Vertriebsverantwortliche vor dem ersten Gespräch über Preis und Aufwand wissen wollen.",
    fragen: [
      {
        q: "Was kostet das Erstgespräch?",
        kopf: "Nichts.",
        text: "Es dauert 30 Minuten, per Video oder Telefon. Wir hören zu, schätzen deine Lage ein und sagen dir ehrlich, welches Modul passt.",
      },
      {
        q: "Ist das Erstgespräch ein Verkaufsgespräch?",
        kopf: "Nein. Es geht um deine Lage, nicht um unser Produkt.",
        text: "Passt keines unserer Module, sagen wir dir das, und oft auch, was du stattdessen tun kannst.",
      },
      {
        q: "Warum ist jedes weitere Modul so viel günstiger?",
        kopf: "Weil die meiste Arbeit am Anfang steckt.",
        text: "Dein Unternehmen verstehen, deine Lage einschätzen, die richtigen Fragen finden: Darauf baut jedes weitere Modul auf. Diesen Vorteil geben wir dir weiter. Und ab zwei Modulen zeigen wir dir ohne Aufpreis, wo dein Team die Lage anders sieht als deine Kunden. Genau dort liegen meist die wertvollsten Erkenntnisse.",
      },
      {
        q: "Kann ich ein Modul später dazunehmen?",
        kopf: "Ja. Innerhalb von sechs Monaten nach deinem Basismodul gilt der Preis für weitere Module.",
        text: "Danach beginnen wir mit einem neuen Zielgespräch, dann ist es wieder ein Basismodul.",
      },
      {
        q: "Wir sind nur fünf Leute. Bleibt das Team-Interview anonym?",
        kopf: "Bei kleinen Teams fassen wir alle Antworten zusammen, ohne Aufteilung nach Gruppen, und geben Aussagen nur sinngemäß wieder.",
        text: "Ehrlich gesagt: Bei drei oder vier Personen lässt sich manches trotzdem zuordnen. Dann empfehlen wir zuerst das Kunden-Interview. Deine Kunden wissen oft mehr, als du glaubst.",
      },
      {
        q: "Wie viel Zeit kostet das mich und mein Team?",
        kopf: "Dich etwa zwei Stunden: Zielgespräch, Freigabe des Interviews und die Präsentation.",
        text: "Dein Team [rund 15 Minuten pro Person], am Handy oder am Computer, wann es passt.",
      },
      {
        q: "Kann ich nur den Einstieg buchen?",
        kopf: "Ja.",
        text: "Du bekommst den Spiegel deiner Annahmen und entscheidest danach in Ruhe. Startest du innerhalb von 8 Wochen ein Interview, rechnen wir die 950 € voll an.",
      },
      {
        q: "Rechnet ihr nach Stunden ab?",
        kopf: "Nein. Jedes Modul hat einen Fixpreis.",
        text: "Was im Angebot steht, zahlst du.",
      },
      {
        q: "Was, wenn mehr Menschen teilnehmen als geplant?",
        kopf: "Solange ihr in der gewählten Gruppengröße bleibt, ändert sich nichts.",
        text: "Wird die Gruppe größer, sagen wir es dir vorher, nicht erst auf der Rechnung.",
      },
    ],
  },
};

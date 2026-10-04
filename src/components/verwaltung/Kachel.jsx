// Eine Kennzahl für die Kennzahlleiste: kachel("Wellen", 3, "1 live")
export function kachel(label, wert, hinweis, ton) {
  return { label, wert, hinweis: hinweis || undefined, ton };
}

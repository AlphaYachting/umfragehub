import React from "react";

// Kennzahl-Kachel — überall in der Verwaltung dieselbe
export function kachel(label, wert, zusatz) {
  return (
    <div className="v-kachel" key={label}>
      <div className="v-kachel-label">{label}</div>
      <div className="v-kachel-wert">{wert}</div>
      {zusatz ? <div className="v-kachel-zusatz">{zusatz}</div> : null}
    </div>
  );
}

// English insights under /en/insights (17.11.2026): one file per released German post,
// same structure as the German content files (see ../index.js and uebergabe/wissen-layout.md).
// Each file carries "de" = the German slug; the pair must also be listed in BEITRAG_SLUGS
// in src/lib/sprache.js (language switch and hreflang).
//
// New English post: add the content file here, import it into BEITRAEGE_EN, add a thin page in
// src/pages/en/wissen/ and a route in src/App.jsx, set title and description in Base44 SEO.

import { istVorschau } from "@/inhalte/wissen";

import employeeSurveyResults from "./employeeSurveyResults";
import whyGoodEmployeesQuit from "./whyGoodEmployeesQuit";
import findYourUsp from "./findYourUsp";
import whyCustomersBuyFromCompetitors from "./whyCustomersBuyFromCompetitors";
import increaseCloseRate from "./increaseCloseRate";
import businessSuccessionMarketing from "./businessSuccessionMarketing";
import familyBusinessSuccessionBrand from "./familyBusinessSuccessionBrand";
import businessHandoverInformingCustomers from "./businessHandoverInformingCustomers";
import retainingEmployeesAfterTakeover from "./retainingEmployeesAfterTakeover";
import first100DaysAfterTakeover from "./first100DaysAfterTakeover";
import preparingBusinessHandover from "./preparingBusinessHandover";
import partnersDisagreeOnMarketing from "./partnersDisagreeOnMarketing";
import employeeSurveyIso9001 from "./employeeSurveyIso9001";
import employeeSurveyIso45001 from "./employeeSurveyIso45001";
import checkingAiGeneratedCopy from "./checkingAiGeneratedCopy";
import whyAiCopySoundsTheSame from "./whyAiCopySoundsTheSame";
import diyMarketingWithAi from "./diyMarketingWithAi";

export const BEITRAEGE_EN = [
  employeeSurveyResults,
  whyGoodEmployeesQuit,
  findYourUsp,
  whyCustomersBuyFromCompetitors,
  increaseCloseRate,
  businessSuccessionMarketing,
  familyBusinessSuccessionBrand,
  businessHandoverInformingCustomers,
  retainingEmployeesAfterTakeover,
  first100DaysAfterTakeover,
  preparingBusinessHandover,
  partnersDisagreeOnMarketing,
  employeeSurveyIso9001,
  employeeSurveyIso45001,
  checkingAiGeneratedCopy,
  whyAiCopySoundsTheSame,
  diyMarketingWithAi,
];

export const MODUL_NAMEN_EN = { team: "Team", positionierung: "Positioning", kunden: "Customers", vertrieb: "Sales" };
export const MODUL_PFAD_EN = { team: "/en/team", positionierung: "/en/positioning", kunden: "/en/customers", vertrieb: "/en/sales" };
export const NACHFOLGE_EN = "Succession";

export function istNachfolgeEn(b) {
  return b.etikett === NACHFOLGE_EN;
}
export function bereichNameEn(b) {
  return istNachfolgeEn(b) ? NACHFOLGE_EN : MODUL_NAMEN_EN[b.modul];
}

export function istSichtbarEn(b) {
  return b.status === "freigegeben" || istVorschau();
}
export function sichtbareBeitraegeEn() {
  return BEITRAEGE_EN.filter(istSichtbarEn);
}
export function beitragNachSlugEn(slug) {
  return BEITRAEGE_EN.find((b) => b.slug === slug) || null;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function datumLangEn(iso) {
  if (!iso) return "";
  const [j, m, t] = iso.split("-").map(Number);
  return `${t} ${MONTHS[m - 1]} ${j}`;
}

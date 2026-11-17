// Feinschliff nach muttersprachlicher Kaltlesung (17.11.2026). Einmalig ausgeführt.
import fs from "node:fs";

const P = "src/pages/en/";
const FAQ = "src/inhalte/faq.en.js";
const OE = "src/components/oeffentlich/Oeffentlich.jsx";
const EG = "src/components/oeffentlich/Erstgespraech.jsx";
const ZA = "src/components/oeffentlich/Zaehler.jsx";

// [Datei, alt (String oder RegExp), neu]
const R = [
  // Startseite
  [P + "Startseite.jsx", "More success than you think.", "Worth more than you think."],
  [P + "Startseite.jsx", "Your customers can contribute more to your success", "Your customers can do more for your business"],
  [P + "Startseite.jsx", "Clarity and essence", "Clarity and focus"],
  [P + "UeberUns.jsx", "Clarity and essence", "Clarity and focus"],
  [P + "Startseite.jsx", "The essence becomes clear messages", "The key findings become clear messages"],
  [P + "UeberUns.jsx", "The essence becomes messages", "The key findings become messages"],
  [P + "Startseite.jsx", "We don't look for the average, we look for the deviations.", "We don't look for the average. We look for where answers diverge."],
  [P + "Startseite.jsx", "answer the interviews online", "complete the interviews online"],
  [P + "Startseite.jsx", "Your own effort: about two hours.", "Your own time: about two hours."],
  [P + "Startseite.jsx", "It just rarely gets said out loud inside the company.", "It just rarely gets said out loud."],
  [P + "Startseite.jsx", "Knowledge instead of gut feeling.", "Evidence, not gut feeling."],
  [P + "Startseite.jsx", "Besides quick ratings there are open questions.", "As well as quick ratings, there are open questions."],
  // Positionierung
  [P + "Positionierung.jsx", "How we weight them remains our craft.", "How we weight them is where our craft comes in."],
  [P + "Positionierung.jsx", "Analysis handout with every gap we found", "Written analysis of every gap we found"],
  [P + "Positionierung.jsx", "Insight becomes a brand presence.", "From insight to brand presence."],
  [P + "Positionierung.jsx", "Which problems and wishes of your customers you address, and where your brand creates instant relevance.", "Which customer problems and needs you address, and where your brand is instantly relevant."],
  [P + "Positionierung.jsx", "Enquiries from customers who suit you.", "Enquiries from customers who are right for you."],
  // Team
  [P + "Team.jsx", "the analysis handout and a", "the written analysis and a"],
  [P + "Team.jsx", "have often already left in their heads.", "have often already checked out mentally."],
  [P + "Team.jsx", "Strong gut feeling. Whether it holds for your own team, only the real answers will show.", "Good instincts. Only the real answers will show whether that holds for your own team."],
  [P + "Team.jsx", "Important vs. experienced", "What matters vs. what they get"],
  [P + "Team.jsx", 'titel: "When it tips"', 'titel: "When the mood turns"'],
  [P + "Team.jsx", 'titel: "What really attracts"', 'titel: "What really attracts people"'],
  [P + "Team.jsx", "Module 02 Team: employee satisfaction", "Module 02: Employee satisfaction"],
  [P + "Team.jsx", "Your team knows what keeps it, what holds it back", "Your team knows what keeps them, what holds them back"],
  [P + "Team.jsx", "That's no criticism.", "That's not a criticism."],
  [P + "Team.jsx", "at which stage enthusiasm fades and what is missing then.", "when enthusiasm fades and what is missing at that point."],
  [P + "Team.jsx", "how well you deliver it", "how well you deliver on it"],
  [P + "Team.jsx", "Good that it's true.", "Good thing it's true."],
  [P + "Team.jsx", /Company party/g, "Staff party"],
  [P + "Team.jsx", /company party/g, "staff party"],
  [P + "Team.jsx", '"International work"', '"International outlook"'],
  [P + "Team.jsx", "more working to rule.", "more doing the bare minimum."],
  [P + "Team.jsx", "The online profile gets updated.", "The LinkedIn profile gets updated."],
  [P + "Team.jsx", "what has really moved?", "what has really changed?"],
  [P + "Team.jsx", "Applications that fit", "Applicants who fit"],
  [P + "Team.jsx", "Here your word counts, even on day one.", "Your word counts here, even on day one."],
  [P + "Team.jsx", "Between the first frustration and the resignation there are usually months.", "There are usually months between the first frustration and the resignation."],
  // Zähler
  [ZA, "the shared picture of the ${bereich.toLowerCase()} team. Never a single answer", "the overall picture for the ${bereich.toLowerCase()} team. Never an individual answer"],
  [ZA, "One interview more", "One more interview"],
  // Kunden
  [P + "Kunden.jsx", "Handout and presentation", "Written analysis and presentation"],
  [P + "Kunden.jsx", "Module 03 Customers: customer satisfaction", "Module 03: Customer satisfaction"],
  [P + "Kunden.jsx", "Often it's the recommendation, not the ad.", "Often it's word of mouth, not the ad."],
  [P + "Kunden.jsx", "Ad budget where your customers actually come from.", "Ad spend that goes where your customers come from."],
  [P + "Kunden.jsx", "and when not?", "and when didn't you?"],
  [P + "Kunden.jsx", "Needs your customers cover elsewhere today", "Needs your customers currently meet elsewhere"],
  // Vertrieb
  [P + "Vertrieb.jsx", "Answers to the no", "Answering objections"],
  [P + "Vertrieb.jsx", "buy part of their needs elsewhere today", "buy some of what they need elsewhere"],
  [P + "Vertrieb.jsx", "buy part of their<br />needs elsewhere", "buy some of what they<br />need elsewhere"],
  [P + "Vertrieb.jsx", "Module 04: Improve sales", "Module 04: Sales performance"],
  [P + "Vertrieb.jsx", "Set your rough figures.", "Enter your rough figures."],
  [P + "Vertrieb.jsx", "3% less discount", "3% lower discounts"],
  [P + "Vertrieb.jsx", "Your fastest growth.", "Your fastest route to growth."],
  [P + "Vertrieb.jsx", "Signals before the purchase", "Buying signals"],
  [P + "Vertrieb.jsx", "Interviews in sales", "Sales team interviews"],
  [P + "Vertrieb.jsx", "On this reason the two sides are close.", "On this one, the two sides are close."],
  [P + "Vertrieb.jsx", "because it is about the path to the deal, not about their quota.", "because it is about how deals are won, not about their quota."],
  [P + "Vertrieb.jsx", "Dedicated contact to the front, 30 years in business to the back.", "Lead with the dedicated contact, not the 30 years in business."],
  [P + "Vertrieb.jsx", "Order 1,000 euros smaller", "Order value 1,000 euros lower"],
  [P + "Vertrieb.jsx", "Order 1,000 euros larger", "Order value 1,000 euros higher"],
  [P + "Vertrieb.jsx", 'urteil: "Doesn\'t matter"', 'urteil: "Makes no difference"'],
  // Über uns, Kontakt, Preise, Insights, Formular, Team-Daten
  [P + "UeberUns.jsx", "with their brand, positioning and presence.", "with their brand, positioning and public image."],
  [OE, /Interview Design and Campaign(?!s)/g, "Interview Design and Campaigns"],
  [P + "Kontakt.jsx", "Visits by appointment, so that someone has time for you.", "Visits by appointment only, so we can give you our full attention."],
  [EG, /We already have requests from you\./g, "We've already received a request from you."],
  [P + "Preise.jsx", /We already have requests from you\./g, "We've already received a request from you."],
  [EG, "On the call we clarify goal, groups and effort.", "On the call we agree the goal, the groups and the effort involved."],
  [EG, "A first step for now", "Start small for now"],
  [P + "Preise.jsx", "Above 100 people we plan by department.", "For more than 100 people we plan by department."],
  [P + "Preise.jsx", "3. Follow up, if you like", "3. Follow-up, if you like"],
  [P + "Preise.jsx", "We get back to you within 24 hours and use your details only for that.", "We'll get back to you within 24 hours and only use your details for that."],
  [P + "Preise.jsx", "which questions carry a decision.", "which questions really drive a decision."],
  [P + "Insights.jsx", "From reading to acting", "From reading to action"],
  // FAQ
  [FAQ, "only with different content each time", "though the specifics differ each time"],
  [FAQ, "employees and customers answer carefully.", "employees and customers answer cautiously."],
  [FAQ, "Less than a single wrong hire or a website relaunch that heads in the wrong direction.", "Less than a single bad hire or a website relaunch that misses the mark."],
  [FAQ, "More groups, customers as an additional group or several locations add to the effort.", "Adding groups, customers as an extra group or several locations increases the scope."],
  [FAQ, "A good mission statement stays; it simply gets evidence.", "A good mission statement stays; it simply gains evidence to back it up."],
  [FAQ, "Conversations keep ending up on price.", "Sales conversations keep coming back to price."],
  [FAQ, "Because analysis and implementation come from one source,", "Because analysis and implementation come from the same team,"],
  [FAQ, "You can just as well implement", "You can equally implement"],
  [FAQ, "and where money goes that nobody would miss.", "and where money goes on things nobody would miss."],
  [FAQ, "An interview without consequences is", "An interview that leads nowhere is"],
  [FAQ, "it becomes truly meaningful from 10 to 15.", "results become truly meaningful from 10 to 15."],
  [FAQ, "With a few large customers, we summarise answers so that nobody can be identified.", "If you have only a few large customers, we summarise answers so they don't point to anyone."],
  [FAQ, "By the time you plan a larger investment", "Whenever you plan a larger investment"],
  [FAQ, "An analysis handout with every gap we found", "A written analysis of every gap we found"],
  [FAQ, /(q: "Will my boss find out what I said\?",\s*kopf: )"No\."/, '$1"Your boss won\'t see who said what."'],
  [FAQ, "Do you only work in Graz and Styria?", "Do you only work in and around Graz?"],
  [FAQ, "In B2B, many customers depend on a handful of contacts,", "In B2B, a customer relationship often rests on a handful of contacts,"],
];

// Begriffe quer über alle Bildseiten
const ALLE = ["Startseite", "Positionierung", "Team", "Kunden", "Vertrieb", "UeberUns", "Kontakt", "Preise", "Insights"].map((n) => P + n + ".jsx").concat([FAQ, OE, EG]);
for (const f of ALLE) {
  R.push([f, /market research institute/g, "market research agency", true]);
  R.push([f, /goal-setting meeting/g, "kick-off meeting", true]);
  R.push([f, /\ba free first call\b/g, "a free intro call", true]);
  R.push([f, /\ba first call\b/g, "an intro call", true]);
  R.push([f, /(?<!very |From the )\bfirst call\b/g, "intro call", true]);
  R.push([f, /\bFirst call\b/g, "Intro call", true]);
}

const cache = {};
const fehlt = [];
let n = 0;
for (const [f, alt, neu, optional] of R) {
  cache[f] ??= fs.readFileSync(f, "utf8");
  const s = cache[f];
  const treffer = typeof alt === "string" ? s.split(alt).length - 1 : (s.match(new RegExp(alt.source, alt.flags.includes("g") ? alt.flags : alt.flags + "g")) || []).length;
  if (treffer === 0) { if (!optional) fehlt.push(`${f}: ${alt}`); continue; }
  cache[f] = typeof alt === "string" ? s.split(alt).join(neu) : s.replace(alt, neu);
  n += treffer;
}
for (const [f, s] of Object.entries(cache)) fs.writeFileSync(f, s);
console.log(`Ersetzungen: ${n}`);
console.log(fehlt.length ? "NICHT GEFUNDEN:\n" + fehlt.join("\n") : "Alle Stellen gefunden.");

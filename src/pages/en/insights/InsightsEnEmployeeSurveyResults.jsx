import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/employeeSurveyResults";

// /en/insights/employee-survey-results: English version of /wissen/mitarbeiterbefragung-ergebnisse. Own page so Base44 can set title and description.
export default function InsightsEnEmployeeSurveyResults() {
  return <BeitragSeite beitrag={beitrag} />;
}

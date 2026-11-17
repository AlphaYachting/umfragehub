import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/employeeSurveyIso45001";

// /en/insights/employee-survey-iso-45001: English version of /wissen/mitarbeiterbefragung-iso-45001. Own page so Base44 can set title and description.
export default function InsightsEnEmployeeSurveyIso45001() {
  return <BeitragSeite beitrag={beitrag} />;
}

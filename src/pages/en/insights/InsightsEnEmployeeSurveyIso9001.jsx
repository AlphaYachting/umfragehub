import React from "react";
import BeitragSeite from "@/components/oeffentlich/wissen/BeitragSeite";
import beitrag from "@/inhalte/wissen/en/employeeSurveyIso9001";

// /en/insights/employee-survey-iso-9001: English version of /wissen/mitarbeiterbefragung-iso-9001. Own page so Base44 can set title and description.
export default function InsightsEnEmployeeSurveyIso9001() {
  return <BeitragSeite beitrag={beitrag} />;
}

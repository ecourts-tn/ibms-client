import { createContext, useContext, useMemo, useState } from "react";
const CaseNumberContext = createContext();

export const CaseNumberProvider = ({ children }) => {
  const [caseNumber, setCaseNumber] = useState(null);

  const value = useMemo(
    () => ({caseNumber, setCaseNumber}),
    [caseNumber]
  );
  return <CaseNumberContext.Provider value={value}>{children}</CaseNumberContext.Provider>;
};

export const useCaseNumber = () => {
  return useContext(CaseNumberContext);
};
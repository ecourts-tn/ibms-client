import React, { createContext, useState } from 'react';

export const PetitionContext = createContext();

export const PetitionProvider = ({ children }) => {
  const [petition, setPetition] = useState({});
  const [petitioners, setPetitioners] = useState([]);
  const [respondents, setRespondents] = useState([]);
  const [grounds, setGrounds] = useState([]);

  return (
    <PetitionContext.Provider value={{ petition, setPetition, petitioners, setPetitioners, respondents, setRespondents, grounds, setGrounds }}>
      {children}
    </PetitionContext.Provider>
  );
};

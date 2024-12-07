import React, { useState, createContext, useMemo, useEffect } from 'react';

// Create the context
export const JudgeContext = createContext();

// Helper function to get initial judge value from sessionStorage
const getInitialJudge = () => {
    const savedJudge = sessionStorage.getItem('judge');
    return savedJudge ? JSON.parse(savedJudge) : {}; // Default to an empty object
};

// Create the provider component
export const JudgeProvider = ({ children }) => {
    const [judge, setJudge] = useState(getInitialJudge);

    // Sync state with sessionStorage whenever it changes
    useEffect(() => {
        sessionStorage.setItem('judge', JSON.stringify(judge));
    }, [judge]);

    // Memoize the context value to optimize re-renders
    const contextValue = useMemo(() => ({ judge, setJudge }), [judge]);

    return (
        <JudgeContext.Provider value={contextValue}>
            {children}
        </JudgeContext.Provider>
    );
};

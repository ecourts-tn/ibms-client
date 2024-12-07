import React, { useState, useEffect, createContext, useMemo } from 'react';
import api from 'api';

export const CaseTypeContext = createContext();

export const CaseTypeProvider = ({ children }) => {
    const [casetypes, setCaseTypes] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchCaseTypes = async () => {
            try {
                const response = await api.get('base/case-type/');
                if (response.status === 200) {
                    setCaseTypes(response.data);
                }
            } catch (error) {
                console.error('Error fetching case types:', error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        fetchCaseTypes();
    }, []);


    const contextValue = useMemo(() => ({ casetypes, setCaseTypes, loading }), [casetypes, loading]);

    return (
        <CaseTypeContext.Provider value={contextValue}>
            {children}
        </CaseTypeContext.Provider>
    );
};

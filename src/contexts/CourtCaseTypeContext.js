import React, { useState, useEffect, createContext, useMemo } from 'react';
import api from 'api';

export const CourtCaseTypeContext = createContext();

export const CourtCaseTypeProvider = ({ children }) => {
    const [ccasetypes, setCaseTypes] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchCaseTypes = async () => {
            try {
                const response = await api.get('base/court-case-type/');
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


    const contextValue = useMemo(() => ({ ccasetypes, setCaseTypes, loading }), [ccasetypes, loading]);

    return (
        <CourtCaseTypeContext.Provider value={contextValue}>
            {children}
        </CourtCaseTypeContext.Provider>
    );
};

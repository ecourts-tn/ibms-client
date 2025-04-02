import React, {useState, useEffect, createContext, useMemo} from 'react'
import api from 'api'

export const MasterContext = createContext()

export const MasterProvider = ({children}) => {
    const [masters, setMasters] = useState({
        bailtypes: [],
        states: [],
        districts: [],
        taluks: [],
        judiciaries: [],
        seats: [],
        casetypes: [],
        ccasetypes: [],
        complainttypes: [],
        policeDistricts: [],
        documents: [],
        designations: [],
        groups: [],
        nationalities: [],
        genders: [],
        relations: [],
        proofs: [],
        prisons: [],
        countries:[],
        employments:[],
        propertytypes:[],
        departments:[],
        jdesignations:[]
    });

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await api.get("base/masters/")
                if(response.status === 200){
                    setMasters({
                        bailtypes: response.data.bail_type,
                        states: response.data.state,
                        districts: response.data.district,
                        taluks: response.data.taluk,
                        judiciaries: response.data.judiciary,
                        seats: response.data.seat,
                        casetypes: response.data.case_type,
                        ccasetypes: response.data.court_case_type,
                        complainttypes: response.data.complaint_type,
                        policeDistricts: response.data.police_district,
                        documents: response.data.document,
                        designations: response.data.designation,
                        groups: response.data.group,
                        nationalities: response.data.nationality,
                        genders: response.data.gender,
                        relations: response.data.relation,
                        proofs: response.data.proof,
                        prisons: response.data.prison,
                        countries: response.data.countries,
                        employments: response.data.employment,
                        propertytypes: response.data.property_type,
                        departments: response.data.department,
                        jdesignations: response.data.jdesignation
                    });
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchData();
    },[])

    const contextValue = useMemo(() => ({masters, setMasters}), [masters]);

    return (
        <MasterContext.Provider value={contextValue}>
            {children}
        </MasterContext.Provider>
    )
}
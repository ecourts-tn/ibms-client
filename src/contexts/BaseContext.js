import React, {createContext, useState, useEffect} from 'react'
import api from '../api'
import { useLocation } from 'react-router-dom'

const BaseContext = createContext()

const BaseProvider = ({children}) => {

    const location = useLocation()

    const[states, setStates] = useState([])
    const[districts, setDistricts] = useState([])
    const[taluks, setTaluks] = useState([])
    const[establishments, setEstablishments] = useState([])
    const[courts, setCourts]  = useState([])
    const[courttypes, setCourttypes] = useState([])
    const[benchtypes, setBenchtypes] = useState([])
    const[bailtypes, setBailtypes] = useState([])
    const[complainttypes, setComplainttypes] = useState([])
    const[policeStations, setPoliceStations] = useState([])
    const[prisons, setPrisons] = useState([])
    const[relations, setRelations] = useState([])
    const[proofs, setProofs] = useState([])
    const[countries, setCountries] = useState([])
    const[efile_no, setEfileNo] = useState(null)
    const[fir, setFir] = useState({})
    const[accused, setAccused] = useState([])

    useEffect(() => {
        const fetchStates = async() => {
            try{
                const response = await api.get("base/state/")
                if(response.status === 200){
                    setStates(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchStates();
    },[])

    useEffect(() => {
        const fetchDistricts = async() => {
            try{
                const response = await api.get("base/district/")
                if(response.status === 200){
                    setDistricts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchDistricts();
    },[])

    useEffect(() => {
        const fetchTaluks = async() => {
            try{
                const response = await api.get("base/taluk/")
                if(response.status === 200){
                    setTaluks(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchTaluks();
    },[])

    useEffect(() => {
        const fetchEstablishments = async() => {
            try{
                const response = await api.get("base/establishment/")
                if(response.status === 200){
                    setEstablishments(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchEstablishments();
    },[])

    useEffect(() => {
        const fetchCourts = async() => {
            try{
                const response = await api.get("base/court/")
                if(response.status === 200){
                    setCourts(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCourts();
    },[])

    useEffect(() => {
        const fetchCourttypes = async() => {
            try{
                const response = await api.get("base/court-type/")
                if(response.status === 200){
                    setCourttypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCourttypes();
    },[])

    useEffect(() => {
        const fetchBenchtypes = async() => {
            try{
                const response = await api.get("base/bench-type/")
                if(response.status === 200){
                    setBenchtypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchBenchtypes();
    },[])

    useEffect(() => {
        const fetchBailtypes = async() => {
            try{
                const response = await api.get("base/bail-type/")
                if(response.status === 200){
                    setBailtypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchBailtypes();
    },[])

    useEffect(() => {
        const fetchComplainttypes = async() => {
            try{
                const response = await api.get("base/complaint-type/")
                if(response.status === 200){
                    setComplainttypes(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchComplainttypes();
    },[])

    useEffect(() => {
        const fetchPoliceStations = async() => {
            try{
                const response = await api.get("base/police-station/")
                if(response.status === 200){
                    setPoliceStations(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPoliceStations();
    },[])

    useEffect(() => {
        const fetchPrisons = async() => {
            try{
                const response = await api.get("base/prison/")
                if(response.status === 200){
                    setPrisons(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchPrisons();
    },[])

    useEffect(() => {
        const fetchRelations = async() => {
            try{
                const response = await api.get("base/relation/")
                if(response.status === 200){
                    setRelations(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchRelations();
    },[])

    useEffect(() => {
        const fetchProofs = async() => {
            try{
                const response = await api.get("base/proof/")
                if(response.status === 200){
                    setProofs(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchProofs();
    },[])

    useEffect(() => {
        const fetchCountries = async() => {
            try{
                const response = await api.get("base/country/")
                if(response.status === 200){
                    setCountries(response.data)
                }
            }catch(error){
                console.error(error)
            }
        }
        fetchCountries();
    },[])

    return(
        <BaseContext.Provider
            value={{
                states,
                districts,
                taluks,
                establishments,
                courts,
                courttypes,
                benchtypes,
                complainttypes,
                bailtypes,
                policeStations,
                prisons,
                relations,
                proofs,
                countries,
                efile_no,
                setEfileNo,
                fir,
                setFir,
                accused,
                setAccused
            }}
        >
            {children}
        </BaseContext.Provider>
    )

}

export {BaseContext, BaseProvider}
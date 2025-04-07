import { LanguageContext } from "contexts/LanguageContex";
import { useContext } from "react";

export const useLocalizedNames = () => {
  const { language } = useContext(LanguageContext);

const getStateName = (state) => {
    if (!state) return '';
    return language === 'ta' ? state.state_lname || '' : state.state_name || '';
};

const getDistrictName = (district) => {
    if (!district) return '';
    return language === 'ta' ? district.district_lname || '' : district.district_name || '';
};

const getEstablishmentName = (establishment) => {
    if (!establishment) return '';
    return language === 'ta' ? establishment.establishment_lname || '' : establishment.establishment_name || '';
}

const getCourttName = (court) => {
    if (!court) return '';
    return language === 'ta' ? court.court_lname || '' : court.court_name || '';
}

const getJudiciaryName = (judiciary) => {
    if (!judiciary) return '';
    return language === 'ta' ? judiciary.judiciary_lname || '' : judiciary.judiciary_name || '';
}

const getFilingNumber = (number, year) => {
    if(!number && !year){
        return (
            <span className="badge badge-warning">
                Not verified
            </span>
        )
    }
    return `${number}/${year}`
}

const getRegistrationNumber = (type, number, year) => {
    if(!type && !number && !year){
        return (
            <span className="badge badge-danger">
                Not registered
            </span>
        )
    }
    return `${type.type_name}/${number}/${year}`
}

  
return {
    getStateName,
    getDistrictName,
    getEstablishmentName,
    getCourttName,
    getJudiciaryName,
    getFilingNumber,
    getRegistrationNumber
  };
};

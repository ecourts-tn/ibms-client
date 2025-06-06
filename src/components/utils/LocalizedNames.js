export const getStateName = (state, language) => {
    console.log("Current language in useLocalizedNames:", language);
    if (!state) return '';
    return language === 'ta' ? state.state_lname || '' : state.state_name || '';
  };


export  const getDistrictName = (district, language) => {
    console.log("Current language in useLocalizedNames:", language);
    if (!district) return '';
    return language === 'ta' ? district.district_lname || '' : district.district_name || '';
  };



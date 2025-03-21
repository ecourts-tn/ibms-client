import React, { createContext, useState, useMemo } from "react";
import { EstablishmentProvider } from "contexts/EstablishmentContext";
import { CourtProvider } from "contexts/CourtContext";
import { PoliceStationProvider } from "contexts/PoliceStationContext";
import { BaseProvider } from "contexts/BaseContext";
import { LanguageProvider } from "contexts/LanguageContex";
import { JudgeProvider } from "contexts/JudgeContext";
import { StepProvider } from "contexts/StepContext";
import { AgencyProvider } from "./AgencyContext";
import { MasterProvider } from "./MasterContext";

export const AppContext = createContext()

export const AppProvider = ({children}) => {

    const [efileNo, seteFileNo] = useState(null)
    

    const contextValue = useMemo(()=>({efileNo}), [efileNo])
    
    return(
        <AppContext.Provider value={contextValue}>
            <StepProvider>
                <LanguageProvider>
                    <BaseProvider>
                        <EstablishmentProvider>
                            <CourtProvider>          
                                <PoliceStationProvider>
                                    <JudgeProvider>
                                            <AgencyProvider>
                                                <MasterProvider>
                                                    {children}
                                                </MasterProvider>
                                            </AgencyProvider>                                    
                                    </JudgeProvider>                                                     
                                </PoliceStationProvider>
                            </CourtProvider>
                        </EstablishmentProvider>
                    </BaseProvider>
                </LanguageProvider>
            </StepProvider>
        </AppContext.Provider>
    )
}
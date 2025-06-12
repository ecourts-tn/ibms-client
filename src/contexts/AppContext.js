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

    return(
        <AppContext.Provider value={{}}>
            <LanguageProvider>
                <BaseProvider>
                    <StepProvider>
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
                    </StepProvider>
                </BaseProvider>
            </LanguageProvider>
        </AppContext.Provider>
    )
}
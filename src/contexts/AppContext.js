import React from "react";
import { StateProvider } from "./StateContext";
import { DistrictProvider } from "./DistrictContext";
import { TalukProvider } from "./TalukContext";
import { EstablishmentProvider } from "./EstablishmentContext";
import { CourtProvider } from "./CourtContext";
import { CourtTypeProvider } from "./CourtTypeContext";
import { BenchTypeProvider } from "./BenchTypeContext";
import { BailTypeProvider } from "./BailTypeContext";
import { ComplaintTypeProvider } from "./ComplaintTypeContext";


export const AppProvider = ({children}) => {
    return(
        <StateProvider>
            <DistrictProvider>
                <TalukProvider>
                    <EstablishmentProvider>
                        <CourtProvider>
                            <CourtTypeProvider>
                                <BenchTypeProvider>
                                    <BailTypeProvider>
                                        <ComplaintTypeProvider>
                                            {children}
                                        </ComplaintTypeProvider>
                                    </BailTypeProvider>
                                </BenchTypeProvider>
                            </CourtTypeProvider>
                        </CourtProvider>
                    </EstablishmentProvider>
                </TalukProvider>
            </DistrictProvider>
        </StateProvider>
    )
}
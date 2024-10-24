import React from "react";
import { StateProvider } from "contexts/StateContext";
import { DistrictProvider } from "contexts/DistrictContext";
import { TalukProvider } from "contexts/TalukContext";
import { EstablishmentProvider } from "contexts/EstablishmentContext";
import { CourtProvider } from "contexts/CourtContext";
import { CourtTypeProvider } from "contexts/CourtTypeContext";
import { BenchTypeProvider } from "contexts/BenchTypeContext";
import { BailTypeProvider } from "contexts/BailTypeContext";
import { ComplaintTypeProvider } from "contexts/ComplaintTypeContext";
import { PoliceDistrictProvider } from "contexts/PoliceDistrictContext";
import { PoliceStationProvider } from "contexts/PoliceStationContext";
import { PrisonProvider } from "contexts/PrisonContext";
import { ProofProvider } from "contexts/ProofContext"
import { RelationProvider } from "contexts/RelationContext";
import { CountryProvider } from "contexts/CountryContext";
import { BaseProvider } from "contexts/BaseContext";
import { LanguageProvider } from "contexts/LanguageContex";
import { GenderProvider } from "contexts/GenderContext";
import { NationalityProvider } from "contexts/NationalityContext";
import { DesignationProvider } from "contexts/DesignationContext";
import { UserTypeProvider } from "contexts/UserTypeContext";

export const AppProvider = ({children}) => {
    return(
        <LanguageProvider>
            <BaseProvider>
                <StateProvider>
                    <DistrictProvider>
                        <TalukProvider>
                            <EstablishmentProvider>
                                <CourtProvider>
                                    <CourtTypeProvider>
                                        <BenchTypeProvider>
                                            <BailTypeProvider>
                                                <ComplaintTypeProvider>
                                                    <PoliceDistrictProvider>
                                                        <PoliceStationProvider>
                                                            <PrisonProvider>
                                                                <ProofProvider>
                                                                    <RelationProvider>
                                                                        <CountryProvider>
                                                                            <GenderProvider>
                                                                                <NationalityProvider>
                                                                                    <DesignationProvider>
                                                                                        <UserTypeProvider>
                                                                                            {children}
                                                                                        </UserTypeProvider>
                                                                                    </DesignationProvider>
                                                                                </NationalityProvider>
                                                                            </GenderProvider>
                                                                        </CountryProvider>
                                                                    </RelationProvider>
                                                                </ProofProvider>
                                                            </PrisonProvider>
                                                        </PoliceStationProvider>
                                                    </PoliceDistrictProvider>
                                                </ComplaintTypeProvider>
                                            </BailTypeProvider>
                                        </BenchTypeProvider>
                                    </CourtTypeProvider>
                                </CourtProvider>
                            </EstablishmentProvider>
                        </TalukProvider>
                    </DistrictProvider>
                </StateProvider>
            </BaseProvider>
        </LanguageProvider>
    )
}
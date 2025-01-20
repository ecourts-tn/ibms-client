import React from "react";
import { StateProvider } from "contexts/StateContext";
import { DistrictProvider } from "contexts/DistrictContext";
import { TalukProvider } from "contexts/TalukContext";
import { EstablishmentProvider } from "contexts/EstablishmentContext";
import { CourtProvider } from "contexts/CourtContext";
import { JudiciaryProvider } from "contexts/JudiciaryContext";
import { SeatProvider } from "contexts/SeatContext";
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
import { DocumentProvider } from "contexts/DocumentContext";
import { CaseTypeProvider } from "contexts/CaseTypeContext";
import { JudgeProvider } from "contexts/JudgeContext";

export const AppProvider = ({children}) => {
    return(
        <UserTypeProvider>
            <LanguageProvider>
                <BaseProvider>
                    <StateProvider>
                        <DistrictProvider>
                            <TalukProvider>
                                <EstablishmentProvider>
                                    <CourtProvider>
                                        <JudiciaryProvider>
                                            <SeatProvider>
                                                <CaseTypeProvider>
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
                                                                                                <DocumentProvider>
                                                                                                    <JudgeProvider>
                                                                                                        {children}
                                                                                                    </JudgeProvider>
                                                                                                </DocumentProvider>
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
                                                </CaseTypeProvider>
                                            </SeatProvider>
                                        </JudiciaryProvider>
                                    </CourtProvider>
                                </EstablishmentProvider>
                            </TalukProvider>
                        </DistrictProvider>
                    </StateProvider>
                </BaseProvider>
            </LanguageProvider>
        </UserTypeProvider>
    )
}
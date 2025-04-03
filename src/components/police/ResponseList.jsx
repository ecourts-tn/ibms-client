import React from 'react'

const ResponseList = ({response}) => {
    return (
        <div className="card card-outline card-danger">
            <div className="card-header">
                <strong>Response</strong>
            </div>
            <div className="card-body">
                { response.map((r, index) => (
                <table className="table table-bordered table-striped table-sm">
                    <tbody>
                        <tr>
                            <td>Offences</td>
                            <td>{r.offences}</td>
                            <td>Date of Arrest</td>
                            <td>{ r.date_of_arrest }</td>
                        </tr>
                        <tr>
                            <td>Name of the accused/suspected person(s)</td>
                            <td>{r.accused_name}</td>
                            <td>Specific Allegations /Overt Acts against the Petitioner(s)</td>
                            <td>{ r.specific_allegations}</td>
                        </tr>
                        <tr>
                            <td>Materials & Circumstances against the Petitioner</td>
                            <td>{ r.materials_used}</td>
                            <td>Injured discharged</td>
                            <td>{r.discharged}</td>
                        </tr>
                        <tr>
                            <td>Hospital Name</td>
                            <td>{r.hospital_name}</td>
                            <td>Condition of Victim</td>
                            <td>{r.victim_condition}</td>
                        </tr>
                        <tr>
                            <td>Particulars of Injury</td>
                            <td>{r.injury_particulars}</td>
                            <td>Stage of Investigation / Trial</td>
                            <td>{r.investigation_stage}</td>
                        </tr>
                        <tr>
                        </tr>
                        <tr>
                            <td>CNR Number</td>
                            <td>{r.cnr_number}</td>
                            <td>Court</td>
                            <td>{r.court}</td>
                        </tr>
                        <tr>
                            <td>Stage of the Case</td>
                            <td>{r.case_stage}</td>
                            <td>Next Hearing Date</td>
                            <td>{ r.next_hearing }</td>
                        </tr>
                        <tr>
                            <td>No. Of. Witness</td>
                            <td>{ r.no_of_witness }</td>
                            <td>Antecedents/Previous Cases against the Petitioner(s)</td>
                            <td>{ r.previous_case }</td>
                        </tr>
                        <tr>
                            <td>Details of Previous Bail Applications</td>
                            <td>{ r.previous_bail}</td>
                            <td>Status of other accused</td>
                            <td>{ r.other_accused_status }</td>
                        </tr>
                        <tr>
                            <td>Why Bail/AB Should Not be Granted</td>
                            <td>{ r.reason_not_given }</td>
                            <td>Any other Information</td>
                            <td>{ r.other_information }</td>
                        </tr>
                        <tr>
                            <td>Court Details: FIR/ Committal/Trial/ Appellate</td>
                            <td colSpan={3}>{ r.court_details }</td>
                        </tr>
                    </tbody>
                </table>
                ))}
            </div>
        </div>
    )
}

export default ResponseList
import React from 'react'

const PoliceResponse = ({response}) => {

    if (!response) {
        return (
            <div className="alert alert-warning">
                <strong>Response not yet filed by concerned Police Station</strong>
            </div>
        )
    }
    return (
        <table className="table table-bordered table-striped table-sm mt-2">
            <tbody>
                <tr>
                    <td>Offences</td>
                    <td>{response.offences}</td>
                </tr>
                <tr>
                    <td>Date of Arrest</td>
                    <td>{ response.date_of_arrest }</td>
                </tr>
                <tr>
                    <td>Name of the accused/suspected person(s)</td>
                    <td>{response.accused_name}</td>
                </tr>
                <tr>
                    <td>Specific Allegations /Overt Acts against the Petitioner(s)</td>
                    <td>{ response.specific_allegations}</td>
                </tr>
                <tr>
                    <td>Materials & Circumstances against the Petitioner</td>
                    <td>{ response.materials_used}</td>
                </tr>
                <tr>
                    <td>Injured discharged</td>
                    <td>{response.discharged}</td>
                </tr>
                <tr>
                    <td>Hospital Name</td>
                    <td>{response.hospital_name}</td>
                </tr>
                <tr>
                    <td>Condition of Victim</td>
                    <td>{response.victim_condition}</td>
                </tr>
                <tr>
                    <td>Particulars of Injury</td>
                    <td>{response.injury_particulars}</td>
                </tr>
                <tr>
                    <td>Stage of Investigation / Trial</td>
                    <td>{response.investigation_stage}</td>
                </tr>
                <tr>
                    <td>CNR Number</td>
                    <td>{response.cnr_number}</td>
                </tr>
                <tr>
                    <td>Court</td>
                    <td>{response.court}</td>
                </tr>
                <tr>
                    <td>Stage of the Case</td>
                    <td>{response.case_stage}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default PoliceResponse
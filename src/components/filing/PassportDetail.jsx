import React, {useState} from 'react'

const PassportDetail = ({ passportDetails, setPassportDetails }) => {

    // const [passportDetails, setPassportDetails] = useState([
    //         { nationality: '', passportType: '', passportAuthority: '', issuedDate: '', expiryDate: '' }
    //     ]);

    const handlePassportInputChange = (index, field, value) => {
        const updatedPassportDetails = [...passportDetails];
        updatedPassportDetails[index][field] = value;
        setPassportDetails(updatedPassportDetails);
    };

    return (
        <React.Fragment>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr className='bg-navy'>
                        <td colSpan={5}><strong>Passport Details</strong></td>
                    </tr>
                    <tr>
                        <th>Nationality</th>
                        <th>Passport Type</th>
                        <th>Passport Authority</th>
                        <th>Issued Date</th>
                        <th>Expiry Date</th>
                    </tr>
                </thead>
                <tbody>
                    {passportDetails.map((passport, index) => (
                    <tr key={index}>
                        <td><input
                        type="text"
                        className='form-control'
                        value={passport.nationality}
                        onChange={(e) => handlePassportInputChange(index, 'nationality', e.target.value)}
                        /></td>
                        <td><input
                        type="text"
                        className='form-control'
                        value={passport.passport_type}
                        onChange={(e) => handlePassportInputChange(index, 'passport_type', e.target.value)}
                        /></td>
                        <td><input
                        type="text"
                        className='form-control'
                        value={passport.passport_authority}
                        onChange={(e) => handlePassportInputChange(index, 'passport_authority', e.target.value)}
                        /></td>
                        <td><input
                        type="date"
                        className='form-control'
                        value={passport.issued_date}
                        onChange={(e) => handlePassportInputChange(index, 'issued_date', e.target.value)}
                        /></td>
                        <td><input
                        type="date"
                        className='form-control'
                        value={passport.expiry_date}
                        onChange={(e) => handlePassportInputChange(index, 'expiry_date', e.target.value)}
                        /></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export default PassportDetail
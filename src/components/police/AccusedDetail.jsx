import React from 'react'

const AccusedDetail = ({accused}) => {
    return (
        <div className="card card-outline card-secondary">
            <div className="card-header">
                <strong>Accused Detail</strong>
            </div>
            <div className="card-body p-1">
                {accused.filter((l) => l.litigant_type === 1)
                    .map((a, index) => (
                    <div class="card mb-3 border-info" key={index}>
                        <div class="row no-gutters">
                        <div class="col-md-2 d-flex justify-content-center pt-2">
                            <img src={`${process.env.PUBLIC_URL}/images/profile.jpg`} alt="" style={{width:"120px", height:"120px"}}/>
                        </div>
                        <div class="col-md-10">
                            <div class="card-body">
                            <h5 class="card-title"><strong>{a.litigant_name}</strong>{` ${a.age}, ${a.gender}`}</h5>
                            <p class="card-text">{`${a.relation} Name: ${a.relation_name}`}</p>
                            <p class="card-text">{ a.address }</p>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AccusedDetail
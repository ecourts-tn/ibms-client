import React from 'react'
import { CreateMarkup } from '../../../utils'

const Grounds = ({grounds}) => {
  return (
        <>
            { grounds.map((ground, index) => (
            <div className="card" key={index}>
                <div className="card-body mt-0">
                    <p dangerouslySetInnerHTML={CreateMarkup(ground.description)}></p>
                </div>
            </div>
            ))}
        </>
    )
}

export default Grounds
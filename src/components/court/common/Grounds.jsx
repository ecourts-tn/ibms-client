import React from 'react'
import { CreateMarkup } from 'utils'

const Grounds = ({grounds}) => {
  return (
        <>
            { grounds.map((ground, index) => (
            <div className="card" key={index}>
                <div className="card-body p-0">
                    <span dangerouslySetInnerHTML={CreateMarkup(ground.description)}></span>
                </div>
            </div>
            ))}
        </>
    )
}

export default Grounds
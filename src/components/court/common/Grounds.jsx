import React from 'react'
import { CreateMarkup } from 'utils'

const Grounds = ({grounds}) => {
  return (
        <React.Fragment>
            { grounds.map((ground, index) => (
            <div className="card" key={index}>
                <div className="card-body p-2">
                    <span dangerouslySetInnerHTML={CreateMarkup(ground.description)}></span>
                </div>
            </div>
            ))}
        </React.Fragment>
    )
}

export default Grounds
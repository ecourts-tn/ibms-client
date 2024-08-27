import React, {useEffect, useRef} from 'react'
import Stepper from 'bs-stepper';
import { Link } from 'react-router-dom';
import BasicContainer from './basic/BasicContainer';

const Steps = () => {
    const stepperRef = useRef(null);

    const headers = [
        {
            title: 'Initial Input',
            url: 'bail/initial-input',
            completed:true
        },
        {
            title: 'Litigant',
            url: 'bail/litigant',
            completed: true
        },
        {
            title: 'Grounds',
            url: 'bail/ground',
            active:true
        },
        {
            title: 'Previous Case Details',
            url: 'bail/previous-details'
        },
        { 
            title: 'Advocate Details',
            url: 'bail/advocate'
        },
        {
            title: 'Documents',
            url: 'bail/documents'
        },
        {
            title: 'Payment',
            url: 'bail/payment'
        },
        {
            title: 'E-File',
            url: 'bail/efile'
        }
    ]

    return (
        <div id="stepper1" className="bs-stepper">
            <div className="bs-stepper-header mb-3">
                { headers.map((item, index) => (
                    <>
                        <div className="step" data-target={`#${item.index}`}>
                            <Link to={item.url}>
                                <button className="step-trigger">
                                    <span className="bs-stepper-circle" style={{backgroundColor: item.completed  ? 'green' : item.active ? 'red': ''}}>{index+1}</span>
                                    <span className="bs-stepper-label" style={{color: item.completed ? 'green' : item.active ? 'red': ''}}>{ item.title }</span>
                                </button>
                            </Link>
                        </div>
                        { index !== headers.length-1 && (<div className="line"></div>)}   
                    </>
                ))}
            </div>
            <div className="bs-stepper-content">
                <div id="1" className="content">
                    <BasicContainer></BasicContainer>
                    <button 
                    className="btn btn-primary float-right" 
                    type="button" 
                    onClick={() => stepperRef.current.next()}>
                        <i className="fa fa-arrow-right mr-2"></i>Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Steps

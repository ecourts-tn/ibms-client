import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const StepperButton = ({ steps=[], isCurrentStepSubmitted = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);

    const pathSegments = location.pathname.split('/');
    const basePath = pathSegments[2] || 'bail'; // Default to "bail" if not found

    const currentIndex = steps.findIndex((step) =>
        location.pathname.endsWith(step.path)
    );

    const previousDisabled = currentIndex <= 0;

    useEffect(() => {
        setNextDisabled(!isCurrentStepSubmitted || currentIndex >= steps.length - 1);
    }, [isCurrentStepSubmitted, currentIndex, steps.length]);

    const handleNext = () => {
        if (!nextDisabled && currentIndex < steps.length - 1) {
            navigate(`/filing/${basePath}/${steps[currentIndex + 1].path}`);
        }
    };

    const handlePrevious = () => {
        if (!previousDisabled) {
            navigate(`/filing/${basePath}/${steps[currentIndex - 1].path}`);
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between">
                <Button onClick={handlePrevious} disabled={previousDisabled}>
                    <i className="fa fa-arrow-left mr-2"></i>
                    {t('previous')}
                </Button>
                <Button onClick={handleNext} disabled={nextDisabled}>
                    {t('next')}
                    <i className="fa fa-arrow-right ml-2"></i>
                </Button>
            </div>
        </div>
    );
};

export default StepperButton;

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const StepperButton = ({ steps, isCurrentStepSubmitted=true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);

    // Find the current step based on the URL
    const currentIndex = steps.findIndex(step =>
        location.pathname.endsWith(step.path)
    );

    // Determine if the "Previous" button should be disabled
    const previousDisabled = currentIndex <= 0;

    // Update the "Next" button disabled state based on submission status
    useEffect(() => {
        setNextDisabled(!isCurrentStepSubmitted);
    }, [isCurrentStepSubmitted]);

    // Handlers for navigation
    const handleNext = () => {
        if (!nextDisabled) navigate(`/filing/bail/${steps[currentIndex + 1].path}`);
    };

    const handlePrevious = () => {
        if (!previousDisabled) navigate(`/filing/bail/${steps[currentIndex - 1].path}`);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between">
                <Button
                    onClick={handlePrevious}
                    disabled={previousDisabled}
                >
                    <i className="fa fa-arrow-left mr-2"></i>{t('previous')}
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={nextDisabled}
                >
                    {t('next')}<i className="fa fa-arrow-right ml-2"></i>
                </Button>
            </div>
        </div>
    );
};

export default StepperButton;

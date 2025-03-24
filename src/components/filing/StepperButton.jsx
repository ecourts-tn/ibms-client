import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const StepperButton = ({ steps = [], isCurrentStepSubmitted = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);

    // Extract base path from the current location or default to "bail"
    const pathSegments = location.pathname.split('/');
    const basePath = pathSegments[2] || 'bail';

    // Find the current step index
    const currentIndex = steps.findIndex((step) =>
        location.pathname.endsWith(step.path)
    );

    const previousDisabled = currentIndex <= 0;

    // Update the disabled state of the "Next" button
    useEffect(() => {
        setNextDisabled(!isCurrentStepSubmitted || currentIndex >= steps.length - 1);
    }, [isCurrentStepSubmitted, currentIndex, steps.length]);

    // Navigate to the next step
    const handleNext = () => {
        if (!nextDisabled && currentIndex < steps.length - 1) {
            navigate(`/filing/${basePath}/${steps[currentIndex + 1].path}`);
        }
    };

    // Navigate to the previous step
    const handlePrevious = () => {
        if (!previousDisabled) {
            navigate(`/filing/${basePath}/${steps[currentIndex - 1].path}`);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mt-3">
                {/* Previous Button */}
                <Button
                    variant="info"
                    onClick={handlePrevious}
                    disabled={previousDisabled}
                    className="d-flex align-items-center"
                >
                    <i className="fa fa-arrow-left mr-2"></i>
                    {t('previous')}
                </Button>

                {/* Next Button */}
                <Button
                    variant="info"
                    onClick={handleNext}
                    disabled={nextDisabled}
                    className="d-flex align-items-center"
                >
                    {t('next')}
                    <i className="fa fa-arrow-right ml-2"></i>
                </Button>
            </div>
        </div>
    );
};

export default StepperButton;

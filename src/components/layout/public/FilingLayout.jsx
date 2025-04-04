import React, {useState, useEffect, useContext} from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { StepContext } from "contexts/StepContext";
import { BaseContext } from "contexts/BaseContext";
import { decrypt } from "components/utils/crypto";


const FilingLayout = ({routes, title}) => {
    const [headerTitle, setHeaderTitle] = useState(""); 
    const [activeStep, setActiveStep] = useState(1)
    const { currentStep } = useContext(StepContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);
    const {efileNumber} = useContext(BaseContext)

    // Extract base path from the current location or default to "bail"
    const pathSegments = location.pathname.split('/');
    const basePath = pathSegments[2] || 'bail';

    // Find the current step index
    const currentIndex = routes.findIndex((step) =>
        location.pathname.endsWith(step.path)
    );

    const previousDisabled = currentIndex <= 0;

    // Update the disabled state of the "Next" button
    useEffect(() => {
        setNextDisabled(currentIndex >= routes.length - 1);
    }, [currentIndex, routes.length]);

    // Update the title on URL change
    useEffect(() => {
        const activeStep = routes.find((step) =>
            location.pathname.includes(step.path)
        );
        if (activeStep) {
            setActiveStep(activeStep.id)
            setHeaderTitle(activeStep.name); // Update title based on route
        }
    }, [location.pathname]);

    const handleNext = () => {
        if (!nextDisabled && currentIndex < routes.length - 1) {
            navigate(`/filing/${basePath}/${routes[currentIndex + 1].path}`);
        }
    };

    const handlePrevious = () => {
        if (!previousDisabled) {
            navigate(`/filing/${basePath}/${routes[currentIndex - 1].path}`);
        }
    };

    return (
        <PrivateRoute>
            <div className="container-fluid" style={{ minHeight: '400px' }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-2 mx-2">
                        <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                        <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t(title)}</li>
                    </ol>
                </nav>
                <div className="row no-gutters">
                    {/* Left Sidebar */}
                    <nav className="col-md-3 d-md-block">
                        <div className="card card-outline card-primary m-2" style={{ borderColor: '#076280', minHeight: '600px' }}>
                            <div className="card-body p-0">
                                <div className="list-group list-group-menu">
                                    {routes.map((route, index) => (
                                        <Link
                                            key={index}
                                            to={currentStep.current_step >= route.id ? route.path : route.path}
                                            className={`list-group-item py-2 ${currentStep < route.id ? "" : ""}`}
                                            onClick={(e) => {
                                                if (currentStep < route.id) e.preventDefault();
                                            }}
                                            style={{
                                                color: '#0e6655',
                                                backgroundColor: activeStep === route.id ? '#e59866' : '#076280',
                                                fontWeight: "bold",
                                                textDecoration: "none",
                                                pointerEvents: currentStep < route.id ? "none" : "auto",
                                                opacity: currentStep < route.id ? 0.7 : 1,
                                            }}
                                        >
                                            {t(route.name)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                    {/* Main Content */}
                    <main className="col-md-9 content">
                        <div className="card card-outline card-primary m-2 " style={{ borderColor: '#076280', minHeight: '600px' }}>
                            {/* Dynamic Card Header */}
                            <div className="card-header" style={{ backgroundColor: "#076280", color: "#FAFAFA", borderRadius: 0 }}>
                                <div className="d-flex justify-content-between font-weight-bold">
                                    <span>{t(headerTitle)}</span>
                                    <span>{ efileNumber ? decrypt(efileNumber) : null }</span>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                <Outlet />
                            </div>
                            <div className="card-footer">
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
                        </div>
                    </main>
                </div>
            </div>
        </PrivateRoute>
    );
};

export default FilingLayout
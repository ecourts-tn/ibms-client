import React, { useState, useEffect, useContext, useRef } from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { StepContext } from "contexts/StepContext";
import { BaseContext } from "contexts/BaseContext";

const FilingLayout = ({ routes, title }) => {
    const [headerTitle, setHeaderTitle] = useState("");
    const [activeStep, setActiveStep] = useState(1);
    const { currentStep, completedSteps } = useContext(StepContext);
    const { efileNumber, clearEfileNumber } = useContext(BaseContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);

    console.log("current step", currentStep)
    
    const pathSegments = location.pathname.split('/');
    const basePath = pathSegments[2] || 'bail';
    const prevBasePath = useRef(basePath);

    useEffect(() => {
        if (prevBasePath.current !== basePath) {
            clearEfileNumber();
            prevBasePath.current = basePath;
        }
    }, [basePath]);

    const currentIndex = routes.findIndex((step) => location.pathname.endsWith(step.path));
    const previousDisabled = currentIndex <= 0;


    useEffect(() => {
        const activeRoute = routes.find((step) => location.pathname.includes(step.path));
        if (activeRoute) {
            setActiveStep(activeRoute.id);
            setHeaderTitle(activeRoute.name);
        }
    }, [location.pathname, routes]);

    const handleNext = () => {
        const nextRoute = routes[currentIndex + 1];
        const currentRoute = routes[currentIndex];
      
        if (!nextRoute) return;
      
        const isCurrentStepCompleted = completedSteps.includes(currentRoute.id);
      
        // if (!isCurrentStepCompleted) {
        //   // block navigation and optionally alert user
        //   alert("Please complete the current step before proceeding.");
        //   return;
        // }
      
        navigate(`/filing/${basePath}/${nextRoute.path}`);
    };

    useEffect(() => {
        const currentRoute = routes[currentIndex];
        const isCurrentStepCompleted = completedSteps.includes(currentRoute.id);
        const isLastStep = currentIndex >= routes.length - 1;
      
        setNextDisabled(isLastStep || !isCurrentStepCompleted);
    }, [currentIndex, routes, completedSteps]);

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
                    <nav className="col-md-3 d-md-block">
                        <div className="card card-outline card-primary m-2" style={{ borderColor: '#076280', minHeight: '600px' }}>
                            <div className="card-body p-0">
                                <div className="list-group list-group-menu">
                                    {routes.map((route, index) => {
                                        const isDisabled = route.id > currentStep;
                                        const isActive = activeStep === route.id;

                                        return (
                                            <Link
                                                key={index}
                                                to={`/filing/${basePath}/${route.path}`}
                                                // onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                                                className={`list-group-item py-2`}
                                                style={{
                                                    color: '#FAFAFA',
                                                    backgroundColor: isActive ? '#e59866' : '#076280',
                                                    fontWeight: "bold",
                                                    // pointerEvents: isDisabled ? "none" : "auto",
                                                    pointerEvents:"auto",
                                                    textDecoration:"none",
                                                    // opacity: isDisabled ? 0.6 : 1,
                                                }}
                                            >
                                                {t(route.name)}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="col-md-9 content">
                        <div className="card card-outline card-primary m-2" style={{ borderColor: '#076280', minHeight: '600px' }}>
                            <div className="card-header" style={{ backgroundColor: "#076280", color: "#FAFAFA", borderRadius: 0 }}>
                                <div className="d-flex justify-content-between font-weight-bold">
                                    <span>{t(headerTitle)}</span>
                                    <span>{efileNumber}</span>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                <Outlet />
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    {/* <Button variant="info" onClick={handlePrevious} disabled={previousDisabled}>
                                        <i className="fa fa-arrow-left mr-2"></i>{t('previous')}
                                    </Button>
                                    <Button variant="info" onClick={handleNext} disabled={nextDisabled}>
                                        {t('next')}<i className="fa fa-arrow-right ml-2"></i>
                                    </Button> */}
                                    <Button variant="info" onClick={handlePrevious}>
                                        <i className="fa fa-arrow-left mr-2"></i>{t('previous')}
                                    </Button>
                                    <Button variant="info" onClick={handleNext}>
                                        {t('next')}<i className="fa fa-arrow-right ml-2"></i>
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

export default FilingLayout;

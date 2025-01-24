import React, {useState, useEffect, useContext} from "react";
import { PrivateRoute } from "hooks/PrivateRoute";
import { Outlet, Route, useLocation, useNavigate } from "react-router-dom";
/* -------- Components ----------- */
import Initial from "components/Initial";
import PetitionerContainer from "components/petitioner/PetitionerContainer";
import RespondentContainer from "components/respondent/RespondentContainer";
import GroundsContainer from "components/grounds/GroundsContainer";
import PreviousCaseContainer from "components/history/PreviousCaseContainer";
import Advocate from "components/filing/Advocate";
import Document from "components/filing/Document";
import Payment from "components/payment/Payment";
import EFile from "components/filing/efile/EFile";
import BailStepper from "components/filing/stepper/BailStepper";
import StepperButton from "components/filing/StepperButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "api";
import Button from "react-bootstrap/Button";
import { StepContext } from "contexts/StepContext";



const bailRoutes = [
    { id: 1, path: "initial-input", component: <Initial />, name:"basic_details"},
    { id: 2, path: "petitioner", component: <PetitionerContainer />, name:"petitioners" },
    { id: 3, path: "respondent", component: <RespondentContainer />, name:"respondents" },
    { id: 4, path: "ground", component: <GroundsContainer />, name:"ground" },
    { id: 5, path: "previous-history", component: <PreviousCaseContainer />, name:"previous_case_details" },
    { id: 6, path: "advocate", component: <Advocate />, name:"advocate" },
    { id: 7, path: "document", component: <Document />, name:"upload_document" },
    { id: 8, path: "payment", component: <Payment />, name:"payment" },
    { id: 9, path: "efile", component: <EFile />, name:"efile" },
];


const BailFilingLayout = () => {
    const [headerTitle, setHeaderTitle] = useState(""); 
    const [activeStep, setActiveStep] = useState(1)
    const { currentStep } = useContext(StepContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [nextDisabled, setNextDisabled] = useState(true);

    // Extract base path from the current location or default to "bail"
    const pathSegments = location.pathname.split('/');
    const basePath = pathSegments[2] || 'bail';

    // Find the current step index
    const currentIndex = bailRoutes.findIndex((step) =>
        location.pathname.endsWith(step.path)
    );

    const previousDisabled = currentIndex <= 0;

    // Update the disabled state of the "Next" button
    useEffect(() => {
        setNextDisabled(currentIndex >= bailRoutes.length - 1);
    }, [currentIndex, bailRoutes.length]);

    // Update the title on URL change
    useEffect(() => {
        const activeStep = bailRoutes.find((step) =>
            location.pathname.includes(step.path)
        );
        if (activeStep) {
            setActiveStep(activeStep.id)
            setHeaderTitle(activeStep.name); // Update title based on route
        }
    }, [location.pathname]);

    const handleNext = () => {
        if (!nextDisabled && currentIndex < bailRoutes.length - 1) {
            navigate(`/filing/${basePath}/${bailRoutes[currentIndex + 1].path}`);
        }
    };

    const handlePrevious = () => {
        if (!previousDisabled) {
            navigate(`/filing/${basePath}/${bailRoutes[currentIndex - 1].path}`);
        }
    };


    return (
        <PrivateRoute>
            <div className="container-fluid" style={{ minHeight: '400px' }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-2 mx-2">
                        <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                        <li className="breadcrumb-item"><a href="#">{t('filing')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('bail')}</li>
                    </ol>
                </nav>
                <div className="row no-gutters">
                    {/* Left Sidebar */}
                    <nav className="col-md-3 d-md-block">
                        <div className="card card-outline card-primary m-2" style={{ borderColor: '#0e6655', minHeight: '600px' }}>
                            <div className="card-body p-0">
                                <div className="list-group list-group-menu">
                                    {bailRoutes.map((route, index) => (
                                        <Link
                                            key={route.id}
                                            to={currentStep >= route.id ? route.path : "#"}
                                            className={`list-group-item py-2 ${currentStep < route.id ? "" : ""}`}
                                            onClick={(e) => {
                                                if (currentStep < route.id) e.preventDefault();
                                            }}
                                            style={{
                                                color: '#0e6655',
                                                backgroundColor: activeStep === route.id ? '#007bff' : '#0e6655',
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
                        <div className="card card-outline card-primary m-2 " style={{ borderColor: '#0e6655', minHeight: '600px' }}>
                            {/* Dynamic Card Header */}
                            <div className="card-header" style={{ backgroundColor: "#0e6655", color: "#FAFAFA", borderRadius: 0 }}>
                                <strong>{t(headerTitle)}</strong>
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


export const BailFilingRoutes = () => (
    <Route path="filing/bail" element={<BailFilingLayout />}>
        {bailRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
        ))}
    </Route>
);


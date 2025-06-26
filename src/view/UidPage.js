import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UidContext } from '../view-model/UidContext';
import SideBar from '../components/SideBar';
import UidBanner from '../components/UidBanner';
import IngestDataPage from '../components/IngestDataPage';
import ReportDataPage from '../components/ReportDataPage';
import '../stylesheets/UidStylesheets/UidPage.css';

/**
 * UidPage is where information for each specific UID will be displayed 
 * 
 */
const UidPage = () => {
    const navigate = useNavigate();
    const { uidsInfo, chosenUidObject, viewMode } = useContext(UidContext);

    return (
        <div className="report-data-page-container">
            <div className="report-data-main-layout">
                <SideBar />
                <div className="report-data-main-content">
                    {chosenUidObject !== null && (
                        <>
                            <UidBanner />
                            <div className="report-data-main-content-container">
                                {/* If a UID object is chosen, the render will depend on whether Report or Ingest was selected */}
                                {
                                    viewMode === "ingest" && (
                                        <IngestDataPage />
                                    )
                                }
                                {
                                    viewMode === "report" && (
                                        <ReportDataPage />
                                    )
                                }

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

}

export default UidPage;
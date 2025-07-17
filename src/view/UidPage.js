import { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import UidBanner from '../components/UidBanner';
import IngestDataPage from '../view/IngestDataPage';
import ReportDataPage from '../view/ReportDataPage';
import RemodelFromReportPage from '../view/RemodelFromReportPage';

//Stylesheets:
import '../stylesheets/UidStylesheets/UidPage.css';

/**
 * UidPage component is responsible for displaying detailed views for a specific UID
 * 
 * - Fetched UID information from `UidContext`.
 * - Uses React Router's `useParams` to extract `uidValue` and `viewMode` from the URL.
 * - Includes a `SideBar` for navigation between different UIDs
 * - Displays a `UidBanner` for selected UID metadata
 * - Conditionally renders subcomponents based on the selected `viewMode`:
 *      -`IngestDataPage` for ingest-related data
 *      - `ReportDataPage` for report-related data
 *      - `RemodelFromReportPage` for initiating a remodel based on a report
 * 
 *   @component
 */
const UidPage = () => {

    const { uidsInfo } = useContext(UidContext);  // List of UIDs and related metadata.
    const { viewMode, uidValue } = useParams();

    // Find the UID object based on the uidValue param
    const chosenUidObject = uidValue
        ? uidsInfo?.find(uid => uid.uidValue === uidValue)
        : null;
    return (
        <div className="uid-page-container">
            {uidsInfo && (
                <div className="uid-page-grid-layout">
                    <div className="uid-sidebar">
                        <SideBar />
                    </div>
                    {chosenUidObject !== null && (
                        <>
                            <div className="uid-banner">
                                <UidBanner uidObject={chosenUidObject} viewMode={viewMode} />
                            </div>
                            <div className="uid-page-main-content">
                                <div className="report-ingest-main-content-container">
                                    {/* If a UID object is chosen, the render will depend on whether Report or Ingest was selected */}
                                    {viewMode === "ingest" && (<IngestDataPage />)}
                                    {viewMode === "report" && (<ReportDataPage />)}
                                    {viewMode==="remodel" && (<RemodelFromReportPage />)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default UidPage;
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import UidBanner from '../components/UidBanner';
import IngestDataPage from '../view/IngestDataPage';
import ReportDataPage from '../view/ReportDataPage';
import '../stylesheets/UidStylesheets/UidPage.css';

/**
 * UidPage is where information for each specific UID will be displayed 
 * 
 */
const UidPage = () => {
    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();
    const chosenUidObject = uidValue
        ? uidsInfo?.find(uid => uid.uidValue === uidValue)
        : null;

    return (
        <div className="uid-page-container">
            {uidsInfo && (
                <div className="uid-page-grid-layout">
                    {/* <SideBar /> */}
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
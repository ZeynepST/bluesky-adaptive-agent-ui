import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
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
    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();
    const chosenUidObject = uidValue
        ? uidsInfo?.find(uid => uid.uidValue === uidValue)
        : null;

    // /const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    return (
        <>
            {uidsInfo && (
                <div className="report-data-page-container">
                    <div className="report-data-main-layout">
                        <SideBar />
                        <div className="report-data-main-content">
                            {chosenUidObject !== null && (
                                <>
                                    <UidBanner uidObject={chosenUidObject} viewMode={viewMode} />
                                    <div className="report-data-main-content-container">
                                        {/* If a UID object is chosen, the render will depend on whether Report or Ingest was selected */}
                                        {
                                            viewMode === "ingest" && (
                                                // <IngestDataPage uid={uidValue} />
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
            )}
        </>
    );
}

export default UidPage;
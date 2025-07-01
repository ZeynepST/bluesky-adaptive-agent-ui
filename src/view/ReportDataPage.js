import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { ReportViewModel } from '../view-model/ReportViewModel';
import LatestClusterCentersPlot from '../components/LatestClusterCentersPlot';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';
import '../stylesheets/UidStylesheets/ReportDataPage.css';

/**
 * ReportDatPage will render the data under the report component of http://localhost:8000/ui/browse
 */

const ReportDataPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();

    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);


    const { clusterCenters, recentClusterCenters } = ReportViewModel(uidValue);

    return (
        <div className="report-data-page">
            {uidsInfo.map((uid) => (
                <React.Fragment key={uid.uidValue}>
                    {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                    {uid.uidValue === uidValue && chosenUidObject?.hasReport && (
                        <div className="report-data-page-container">
                            <div className="report-data-graphs">
                                <div className="latest-cluster-center-graph">
                                    <LatestClusterCentersPlot data={recentClusterCenters} />
                                </div>

                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

}

export default ReportDataPage;
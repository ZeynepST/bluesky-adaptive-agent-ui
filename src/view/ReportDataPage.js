import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { ReportViewModel } from '../view-model/ReportViewModel';
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


    const { clusterCenters } = ReportViewModel(uidValue);

    return (
        <div className="report-data-page">
            {uidsInfo.map((uid) => (
                <React.Fragment key={uid.uidValue}>
                    {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                    {uid.uidValue === uidValue && chosenUidObject?.hasReport && (
                        <div className="report-data-page-container">
                            <h1> This is the Report Page</h1>
                            <ul>clusterCenters {clusterCenters}</ul>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

}

export default ReportDataPage;
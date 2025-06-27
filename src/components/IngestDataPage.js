import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';

/**
 * IngestDatPage will render the data under the ingest component of http://localhost:8000/ui/browse
 */

const IngestDataPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();

    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    return (
        <div className="ingest-data-page-container">
            {uidsInfo.map((uid) => (
                <React.Fragment key={uid.uidValue}>
                    {/* This ensures that the IngestDataPage doesn't render information for the wrong UID */}
                    {uid.uidValue === uidValue && chosenUidObject?.hasIngest && (
                        <h1> This is the Ingest Page</h1>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

}

export default IngestDataPage;
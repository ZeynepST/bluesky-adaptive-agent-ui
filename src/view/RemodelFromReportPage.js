import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { RemodelViewModel } from '../view-model/RemodelViewModel';

const RemodelFromReportPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();
    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue); 
    const{distances, clusters}=RemodelViewModel(uidValue);
    
    
    return (
        <div className="remodel-from-report-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                {chosenUidObject.uidValue === uidValue && chosenUidObject?.hasReport && chosenUidObject?.hasIngest && (
                    <div className="remodel-from-report-container">
                        <ul>
                            <li> The distances are: {distances}</li>
                            <li> The clusters are:{ clusters} </li>
                        </ul>
                    </div>
                )
                }
            </React.Fragment>
        </div>
    );
}

export default RemodelFromReportPage;
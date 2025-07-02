import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { ReportViewModel } from '../view-model/ReportViewModel';
import LatestClusterCentersPlot from '../components/Plots/LatestClusterCentersPlot';
import ClusterCentersOT from '../components/Plots/ClusterCentersOTPlot';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';
import '../stylesheets/UidStylesheets/ReportDataPage.css';


import PlotlyScatter from '../components/Plots/PlotlyScatter';



/**
 * ReportDatPage will render the data under the report component of http://localhost:8000/ui/browse
 */

const ReportDataPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();

    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);


    const { clusterCenters, recentClusterCenters, transformRCC, reportsCacheLength } = ReportViewModel(uidValue);

    return (
        <div className="report-data-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                {chosenUidObject.uidValue === uidValue && chosenUidObject?.hasReport && (
                        <div className="report-data-pg-container">
                            <div className="report-data-graphs">
                                <div className="latest-cluster-center-graph">
                                    <PlotlyScatter
                                        data={transformRCC}
                                        title="Latest Cluster Centers"
                                        xAxisTitle="Feature Index"
                                        yAxisTitle="Cluster Center Value" />
                                </div>
                                <div className="cluster-centers-graph">
                                    <ClusterCentersOT clusterCenters={clusterCenters} reportsCacheLength={reportsCacheLength}/>
                                </div>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        </div>
    );

}

export default ReportDataPage;
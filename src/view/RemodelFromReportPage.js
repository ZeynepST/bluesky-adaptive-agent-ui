import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { RemodelViewModel } from '../view-model/RemodelViewModel';
import PlotlyScatter from '../components/Plots/PlotlyScatter';
import { IngestViewModel } from '../view-model/IngestViewModel';

const RemodelFromReportPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();
    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);
    const { distances } = RemodelViewModel(uidValue);

    const { transformIndVarPlotData } = IngestViewModel(uidValue);

    const [plotData, setPlotData] = useState([]);
    useEffect(() => {
        if (!distances || distances.length === 0 || !transformIndVarPlotData || transformIndVarPlotData.length === 0 || !transformIndVarPlotData[0].x)
            return;
        const data = distances[0].map((_, clusterIdx) => ({
            x: transformIndVarPlotData[0].x,
            y: distances.map(d => d[clusterIdx]),
            type: 'scatter',
            mode: 'lines+markers',
            name: `Distance to Cluster ${clusterIdx}`,
        }));

        setPlotData(data);
    }, [distances, transformIndVarPlotData]);

    if (!chosenUidObject || !transformIndVarPlotData || transformIndVarPlotData.length === 0 || !transformIndVarPlotData[0].x) {
        return <div>Loading...</div>;
    }

    return (
        <div className="remodel-from-report-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                {chosenUidObject.uidValue === uidValue && chosenUidObject?.hasReport && chosenUidObject?.hasIngest && (
                    <div className="remodel-from-report-container">
                        <div className="remodel-graphs">
                            <div className="ind-vars-graph">
                                <PlotlyScatter
                                    data={plotData}
                                    title=""
                                    xAxisTitle="Index"
                                    yAxisTitle="Weights" />
                            </div>
                        </div>
                    </div>
                )
                }
            </React.Fragment>
        </div>
    );
}

export default RemodelFromReportPage;
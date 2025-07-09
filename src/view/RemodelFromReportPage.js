import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { RemodelViewModel } from '../view-model/RemodelViewModel';
import PlotlyScatter from '../components/Plots/PlotlyScatter';
import { IngestViewModel } from '../view-model/IngestViewModel';
import { ReportViewModel } from '../view-model/ReportViewModel';
import ClusterDistancePlot from '../components/Plots/ClusterDistancePlot';


const RemodelFromReportPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();
    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    const { transformIndVarPlotData, independentVars, observables, is1D } = IngestViewModel(uidValue);

    const { clusterCenters, recentClusterCenters } = ReportViewModel(uidValue);

    const { distances, clusterLabels } = RemodelViewModel(uidValue, clusterCenters, recentClusterCenters, independentVars, observables, transformIndVarPlotData);
    const uniqueLabels = [...new Set(clusterLabels)];

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
                            {/* beginning of distancce-index plot */}
                            <div className="distance-index-graph">
                                {
                                    // This check prevents: export default RemodelFromReportPage;Cannot read properties of undefined (reading 'map')
                                    distances.length > 0 && distances[0] &&
                                    <PlotlyScatter
                                        data={
                                            // This creates one trace per cluster
                                            // Each vertical column of points corresponds to a single data point
                                            distances[0].map((_, clusterIdx) => ({
                                                x: transformIndVarPlotData[0].y,
                                                y: distances.map(d => d[clusterIdx]),
                                                type: 'scatter',
                                                mode: 'markers',
                                                name: `Distance to Cluster ${clusterIdx + 1}`,
                                            }))
                                        }
                                        title=""
                                        xAxisTitle="Independent Variable"
                                        yAxisTitle="Distances"
                                    />
                                }
                            </div>
                            {/* end of distance-index plot */}
                            {/* beginning of 1D ind plots */}
                            <div className="plots-1D-container">
                                {/* the plot below assumes independent variables are 1D */}
                                <div className="plot1-ind-idx-color-cluster-labels-1D">
                                    {is1D &&
                                        <PlotlyScatter
                                            data={
                                                [{
                                                    x: transformIndVarPlotData[0].x,  //the index
                                                    y: transformIndVarPlotData[0].y, //the value of independentVars,
                                                    type: 'scatter',
                                                    mode: 'markers',
                                                    name: '1D Independent Variables vs Index',
                                                    marker: {
                                                        color: clusterLabels,
                                                        colorscale: 'Viridis',
                                                        colorbar: {
                                                            title: {
                                                                text: 'Cluster Labels'
                                                            },
                                                            tickvals: uniqueLabels,
                                                            ticktext: uniqueLabels.map(label => label.toString()),
                                                            titleside: 'center',
                                                        },
                                                        showscale: true
                                                    }
                                                }]
                                            }
                                            title=""
                                            xAxisTitle="Index"
                                            yAxisTitle="Independent Variables [1D]"
                                        />}
                                </div>
                                {/*Start of plot2-ind-idx-color-cluster-labels-1D" */}
                                <div className="plot2-ind-idx-color-distance-labels-1D">
                                    <ClusterDistancePlot
                                        distances={distances}
                                        transformIndVarPlotData={transformIndVarPlotData}
                                    />
                                </div>
                            </div>
                            {/* end of 1D ind var plots */}
                            {/******************************************************************************************/}
                            {/* beginning of 2D independent plots */}
                            <div className="plots-2D">
                                {/* the plot below assumes the independent variables are 2D */}
                                <div className='plot1-ind-idx-color-cluster-labels-2D'>
                                    {!is1D &&
                                        <PlotlyScatter
                                            data={[
                                                {
                                                    x: independentVars.map(d => d[0]),  // first feature of each point
                                                    y: independentVars.map(d => d[1]),  // second feature of each point
                                                    mode: 'markers',
                                                    type: 'scatter',
                                                    name: '2D Independent Variables vs Index',
                                                    marker: {
                                                        color: clusterLabels,
                                                        colorscale: 'Viridis',
                                                        colorbar: {
                                                            title: 'Cluster Labels',
                                                            tickvals: uniqueLabels,
                                                            ticktext: uniqueLabels.map(label => label.toString())
                                                        },
                                                        showscale: true,
                                                    },
                                                },
                                            ]}
                                            title=""
                                            xAxisTitle="Index"
                                            yAxisTitle="Independent Variables [2D]"
                                        />
                                    }
                                </div>
                                {/* start of plot2-ind-idx-color-distance-labels-2D */}
                                <div className="plot2-ind-idx-color-distance-labels-2D">
                                    
                                </div>

                            </div>
                            {/* end of 2D ind variable plots */}
            
                        </div>
                    </div>
                )
                }
            </React.Fragment>
        </div>
    );
}
export default RemodelFromReportPage;
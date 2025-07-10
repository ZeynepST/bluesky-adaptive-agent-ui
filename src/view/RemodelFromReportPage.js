import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { RemodelViewModel } from '../view-model/RemodelViewModel';
import PlotlyScatter from '../components/Plots/PlotlyScatter';
import { IngestViewModel } from '../view-model/IngestViewModel';
import { ReportViewModel } from '../view-model/ReportViewModel';
import prepareWaterfallScatter1D from '../view-model/RemodelViewModel';
// import ClusterDistancePlot from '../components/Plots/ClusterDistancePlot';


const RemodelFromReportPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();
    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    const { transformIndVarPlotData, independentVars, observables, is1D } = IngestViewModel(uidValue);

    const { clusterCenters, recentClusterCenters } = ReportViewModel(uidValue);

    const { distances, clusterLabels } = RemodelViewModel(uidValue, clusterCenters, recentClusterCenters, independentVars, observables, transformIndVarPlotData);
    const uniqueLabels = [...new Set(clusterLabels)];
    //may move this
    const tab10 = [
        '#1f77b4', // blue
        '#ff7f0e', // orange
        '#2ca02c', // green
        '#d62728', // red
        '#9467bd', // purple
        '#8c564b', // brown
        '#e377c2', // pink
        '#7f7f7f', // gray
        '#bcbd22', // olive
        '#17becf'  // cyan
    ];

    const clusterColorMap = {};
    uniqueLabels.forEach((label, idx) => {
        clusterColorMap[label] = tab10[idx % tab10.length];
    });
 
    const indIdxClusterTraces = uniqueLabels.map((label, idx) => { //this loops through each unique cluster label
        const color = tab10[idx % tab10.length]; //picks a color from tab10. %tab10.length ensures a loop around in event that there are more than 10 clusters
        //the arrays below hold the x and y values for just one cluster at a time (so 0 or 1 or 2, etc)
        const x = [];
        const y = [];
        transformIndVarPlotData[0].x.forEach((val, i) => { //this loops over every point in the data
            //valu is the x-value (so the index ) and i is the index in the array
            if (clusterLabels[i] === label) { //checking if this point's cluster label matches the one being processed right now
                x.push(val);
                y.push(transformIndVarPlotData[0].y[i]);
            }
        });
        return {
            x,
            y,
            type: 'scatter',
            mode: 'markers',
            name: `Cluster ${label}`,
            marker: {
                color,
            }
        };
    });

    if (!chosenUidObject || !transformIndVarPlotData || transformIndVarPlotData.length === 0 || !transformIndVarPlotData[0].x) {
        return <div>Loading...</div>;
    }
    const plotData = prepareWaterfallScatter1D(observables, clusterLabels, independentVars);

    return (
        <div className="remodel-from-report-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                {chosenUidObject.uidValue === uidValue && chosenUidObject?.hasReport && chosenUidObject?.hasIngest && (
                    <div className="remodel-from-report-container">
                        <div className="remodel-graphs">
                            {/* beginning of distance-index plot */}
                            <div className="distance-index-graph">
                                {
                                    // This check prevents: export default RemodelFromReportPage;Cannot read properties of undefined (reading 'map')
                                    distances.length > 0 && distances[0] &&
                                    <PlotlyScatter
                                        data={
                                            //essentially iterating through the columns
                                            distances[0].map((_, clusterIdx) => {
                                                const xValues = transformIndVarPlotData[0].y;
                                                const yValues = distances.map(d => d[clusterIdx]); //this iterates through all the rows in distances
                                                const sortedPairs = xValues.map((x, i) => ({ x, y: yValues[i] }))
                                                    .sort((a, b) => a.x - b.x);
                                                return {
                                                    x: sortedPairs.map(p => p.x),
                                                    y: sortedPairs.map(p => p.y),
                                                    type: 'scatter',
                                                    mode: 'lines+markers',
                                                    name: `Distance to Cluster ${clusterIdx + 1}`
                                                };
                                            })
                                        }
                                        title=""
                                        xAxisTitle="Independent Variable"
                                        yAxisTitle="Distances"
                                    />
                                }
                            </div>
                            {/* end of distance-index plot */}
                            {/******************************************************************************************/}
                            {/* beginning of 1D ind plots */}
                            <div className="plots-1D-container">
                                {/* the plot below assumes independent variables are 1D */}
                                {is1D && <div className="plot1-ind-idx-color-cluster-labels-1D">
                                    <PlotlyScatter
                                        data={indIdxClusterTraces}
                                        title=""
                                        xAxisTitle="Index"
                                        yAxisTitle="Independent Variables [1D]"
                                    />
                                </div>
                                }
                                {is1D && <div className="plot2-observable-sortedby-ind-coloredby-clusterlabel-1D">
                                    <PlotlyScatter
                                        data={
                                            plotData
                                        }
                                        title="Observables Sorted by Independent Variables [1D]"
                                        xAxisTitle="Index"
                                        yAxisTitle="Observables"
                                        layout={{
                                            yaxis: {
                                                tickmode: "linear",
                                                dtick: 1,
                                                title: {
                                                    text: "Sorted Position"
                                                },
                                            }
                                        }}
                                    />
                                </div>
                                }
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
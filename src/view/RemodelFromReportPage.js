import React, { useContext } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import { RemodelViewModel } from '../view-model/RemodelViewModel';
import { IngestViewModel } from '../view-model/IngestViewModel';
import { ReportViewModel } from '../view-model/ReportViewModel';
import { createHeatmapGrid } from '../view-model/RemodelViewModel.js';
import { prepareWaterFallScatter } from '../view-model/RemodelViewModel.js';
import PlotlyScatter from '../components/Plots/PlotlyScatter';
import PlotlyHeatmap from '../components/Plots/PlotlyHeatmap';
// import ClusterDistancePlot from '../components/Plots/ClusterDistancePlot';
// Stylesheets: 
import '../stylesheets/UidStylesheets/RemodelFromReportPage.css';

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

const RemodelFromReportPage = () => {

    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();
    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    const { transformIndVarPlotData, independentVars, observables, is1D } = IngestViewModel(uidValue);

    const { clusterCenters, recentClusterCenters } = ReportViewModel(uidValue);

    const { distances, clusterLabels } = RemodelViewModel(uidValue, clusterCenters, recentClusterCenters, independentVars, observables, transformIndVarPlotData);
    const uniqueLabels = [...new Set(clusterLabels)];

    const [offSetWFScatter1D, setOffSetWFScatter1D] = useState("");

    // selectedHMClusterIdx is the cluster index being represented in the heat map for the distance-index-graph-2D plot
    const [selectedHMClusterIdx, setSelectedHMClusterIdx] = useState(0);

    const [selectedScatterClusterIdx, setSelectedScatterClusterIdx] = useState(0);

    const [selectedWaterFallClusterIdx, setSelectedWaterFallClusterIdx] = useState(0);

    const numClusters = distances[0]?.length || 0;

    const clusterColorMap = {};
    uniqueLabels.forEach((label, idx) => {
        clusterColorMap[label] = tab10[idx % tab10.length];
    });

    if (!chosenUidObject || !transformIndVarPlotData || transformIndVarPlotData.length === 0 || !transformIndVarPlotData[0].x || !clusterLabels ||
        clusterLabels.length === 0 || !independentVars || !distances || independentVars.length === 0) {
        return <div>Loading...</div>;
    }

    // The global max and min for distances is used to lock the axis limits for the color-axis in the heatmap
    const allDistances = distances.flat(); // flatten distances: [[...], [...], ...] -> [...]
    const globalMinDistances = Math.min(...allDistances);
    const globalMaxDistances = Math.max(...allDistances);

    const indIdxClusterTraces = uniqueLabels.map((label, idx) => { //this loops through each unique cluster label
        const color = tab10[idx % tab10.length]; //picks a color from tab10. %tab10.length ensures a loop around in event that there are more than 10 clusters
        //the arrays below hold the x and y values for just one cluster at a time (so 0 or 1 or 2, etc)
        const x = [];
        const y = [];
        transformIndVarPlotData[0].x.forEach((val, i) => { // this loops over every point in the data
            //val is the x-value (so the index ) and i is the index in the array
            if (clusterLabels[i] === label) { // checking if this point's cluster label matches the one being processed right now
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

    const heatmapData = createHeatmapGrid(independentVars, distances, selectedHMClusterIdx);

    const scatterDistanceIdxData2D = () => {
        const x = transformIndVarPlotData[0].x;
        const y = transformIndVarPlotData[0].y;
        const distanceValues = distances.map(d => d[selectedScatterClusterIdx]);
        const hoverTexts = clusterLabels.map((label, i) =>
            `Point ${i}<br>Cluster Label: ${label}<br>Distance to Cluster ${selectedScatterClusterIdx}: ${distanceValues[i].toFixed(2)}`
        );
        return [{
            x,
            y,
            type: 'scatter',
            mode: 'markers',
            name: `Distance to Cluster ${selectedScatterClusterIdx}`,
            marker: {
                color: distanceValues,
                size: 10,
                colorscale: 'Viridis',
                coloraxis: 'coloraxis', // links to the layout.coloraxis
                colorbar: {
                    title: `Distance to Cluster ${selectedScatterClusterIdx}`
                }
            },
            text: hoverTexts,
            hoverinfo: 'text'
        }];
    };

    // Handler functions
    const handlePrevScatter = () => {
        if (selectedScatterClusterIdx > 0) {
            setSelectedScatterClusterIdx(selectedScatterClusterIdx - 1);
        }
    };

    const handleNextScatter = () => {
        if (selectedScatterClusterIdx < numClusters - 1) {
            setSelectedScatterClusterIdx(selectedScatterClusterIdx + 1);
        }
    };
    const handlePrevHM = () => {
        setSelectedHMClusterIdx(prev => Math.max(0, prev - 1));
    };

    const handleNextHM = () => {
        setSelectedHMClusterIdx(prev => Math.min(numClusters - 1, prev + 1));
    };

    const handlePrevWaterFall = () => {
        if (selectedWaterFallClusterIdx > 0) {
            setSelectedWaterFallClusterIdx(selectedWaterFallClusterIdx - 1);
        }
    };
    const handleNextWaterFall = () => {
        if (selectedWaterFallClusterIdx < numClusters - 1) {
            setSelectedWaterFallClusterIdx(selectedWaterFallClusterIdx + 1);
        }
    };
    //End of Handler Functions 

    // Calculate grid bounds (the rectangular area the data covers)
    const xValues = independentVars.map(point => point[0]);
    const yValues = independentVars.map(point => point[1]);
    const gridBounds = {
        xMin: Math.min(...xValues),
        xMax: Math.max(...xValues),
        yMin: Math.min(...yValues),
        yMax: Math.max(...yValues)
    };

    return (
        <div className="remodel-from-report-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the ReportDataPage doesn't render information for the wrong UID */}
                {chosenUidObject.uidValue === uidValue && chosenUidObject?.hasReport && chosenUidObject?.hasIngest && (
                    <div className="remodel-from-report-container">
                        <div className="remodel-from-report-page-graphs">
                            {/******************************************************************************************/}
                            {/* beginning of 1D ind plots */}
                            <div className="plots-1D-container">
                                {is1D && distances.length > 0 && distances[0] && ( // This check prevents: export default RemodelFromReportPage;Cannot read properties of undefined (reading 'map')                                   
                                    <div classsName="plots-1D">
                                        {/* beginning of distance-index plot */}
                                        <div className="distance-index-graph-1D">
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
                                        </div>
                                        {/* end of distance-index plot */}
                                        <div className="plot1-ind-idx-color-cluster-labels-1D">
                                            <PlotlyScatter
                                                data={indIdxClusterTraces}
                                                title=""
                                                xAxisTitle="Index"
                                                yAxisTitle="Independent Variables [1D]"
                                            />
                                        </div>
                                        <div className="plot2-observable-sortedby-ind-coloredby-clusterlabel-1D-container">
                                            {/* This is the waterfall plot */}
                                            <div className="plot2-observable-sortedby-ind-coloredby-clusterlabel-1D-wrapper">
                                                <PlotlyScatter
                                                    data={
                                                        prepareWaterFallScatter(observables, clusterLabels, independentVars, offSetWFScatter1D, is1D)
                                                    }
                                                    title="Observables Sorted by Independent Variables [1D]"
                                                    xAxisTitle="Index"
                                                    yAxisTitle="Observables"
                                                    yAxisLayout={{
                                                        showticklabels: false,
                                                        ticks: "",
                                                        showgrid: false,
                                                    }}
                                                />
                                                <div className="waterfall-plot-scatter1D-offset-input-box" >
                                                    <input
                                                        type="number"
                                                        className="offSetWFScatter1D-input"
                                                        placeholder="Enter Offset..."
                                                        value={offSetWFScatter1D}
                                                        onChange={(e) => setOffSetWFScatter1D(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* end of 1D ind var plots */}
                            {/******************************************************************************************/}
                            {/* beginning of 2D independent plots */}
                            <div className="plots-2D-container">
                                {!is1D && distances.length > 0 && distances[0] &&
                                    (
                                        <div className="plots-2D">
                                            {/* beginning of distance-index plot */}
                                            <div className="distance-index-graph-2D">
                                                {/* Scatter plot */}
                                                <div className="distance-index-graph-2D">
                                                    <PlotlyScatter
                                                        data={scatterDistanceIdxData2D()}
                                                        title={`Distance to Cluster ${selectedScatterClusterIdx} - 2D View`}
                                                        xAxisTitle="Index 0"
                                                        yAxisTitle="Index 1"
                                                        colorAxisRange={{ cmin: globalMinDistances, cmax: globalMaxDistances }}
                                                    />
                                                </div>
                                            </div>
                                            {/* Cluster selector controls */}
                                            <div className="cluster-distance-plot-selector-container">
                                                <button
                                                    onClick={handlePrevScatter}
                                                    disabled={selectedScatterClusterIdx === 0}
                                                >
                                                    &larr; Prev
                                                </button>
                                                <Select
                                                    options={Array.from({ length: numClusters }, (_, idx) => ({
                                                        label: `Cluster ${idx + 1}`,
                                                        value: idx
                                                    }))}
                                                    onChange={(option) => setSelectedScatterClusterIdx(option.value)}
                                                    value={{ label: `Cluster ${selectedScatterClusterIdx}`, value: selectedScatterClusterIdx }}
                                                />
                                                <button
                                                    onClick={handleNextScatter}
                                                    disabled={selectedScatterClusterIdx === numClusters - 1}
                                                >
                                                    Next &rarr;
                                                </button>
                                            </div>
                                            {/* end of distance-index plot */}

                                            {/* heat map */}
                                            <div className="distance-index-graph-2D-heatmap">
                                                <PlotlyHeatmap
                                                    array={heatmapData}
                                                    title={`Distance to Cluster ${selectedHMClusterIdx} - 2D View`}
                                                    xAxisTitle="Index 0"
                                                    yAxisTitle="Index 1"
                                                    colorScale="Viridis"
                                                    tickStep={5}
                                                    showTicks={true}
                                                    dataPoints={independentVars}
                                                    selectedCluster={selectedHMClusterIdx}
                                                    distances={distances}
                                                    gridBounds={gridBounds}
                                                    zMin={globalMinDistances}
                                                    zMax={globalMaxDistances}
                                                />
                                                <div className="cluster-distance-plot-selector-container">
                                                    <button onClick={handlePrevHM} disabled={selectedHMClusterIdx === 0}>
                                                        &larr; Prev
                                                    </button>
                                                    <Select
                                                        options={distances[0].map((_, idx) => ({
                                                            label: `Cluster ${idx}`,
                                                            value: idx
                                                        }))}
                                                        onChange={(option) => setSelectedHMClusterIdx(option.value)}
                                                        value={{ label: `Cluster ${selectedHMClusterIdx}`, value: selectedHMClusterIdx }}
                                                    />
                                                    <button onClick={handleNextHM} disabled={selectedHMClusterIdx === numClusters - 1}>
                                                        Next &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                            {/* end of heat map */}
                                            <div className="plot1-ind-idx-color-cluster-labels-2D">
                                                <PlotlyScatter
                                                    data={indIdxClusterTraces}
                                                    title="Independent Variables [2D]"
                                                    xAxisTitle="Index 0"
                                                    yAxisTitle="Index 1"
                                                />
                                            </div>
                                            {/* End of plot1 for 2D */}
                                            {/* beginning of plot2 for 2D */}
                                            <div className="plot2-observable-sortedby-ind-coloredby-clusterlabel-2D-container">
                                                {/* This is the waterfall plot */}
                                                <div className="plot2-observable-sortedby-ind-coloredby-clusterlabel-2D-wrapper">
                                                    <PlotlyScatter
                                                        data={
                                                            prepareWaterFallScatter(observables, clusterLabels, independentVars, offSetWFScatter1D, is1D, distances, selectedWaterFallClusterIdx)
                                                        }
                                                        title={`Observables Sorted by Distances to Cluster ${selectedWaterFallClusterIdx} - 2D View`}
                                                        xAxisTitle="Index"
                                                        yAxisTitle="Observables"
                                                        yAxisLayout={{
                                                            showticklabels: false,
                                                            ticks: "",
                                                            showgrid: false,
                                                        }}
                                                    />
                                                    <div className="waterfall-plot-scatter2D-offset-input-box" >
                                                        <input
                                                            type="number"
                                                            className="offSetWFScatter2D-input"
                                                            placeholder="Enter Offset..."
                                                            value={offSetWFScatter1D}
                                                            onChange={(e) => setOffSetWFScatter1D(Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="waterfall-plot-scatter2D-selector-container">
                                                        <button onClick={handlePrevWaterFall} disabled={selectedWaterFallClusterIdx === 0}>
                                                            &larr; Prev
                                                        </button>
                                                        <Select
                                                            options={distances[0].map((_, idx) => ({
                                                                label: `Cluster ${idx}`,
                                                                value: idx
                                                            }))}
                                                            onChange={(option) => setSelectedWaterFallClusterIdx(option.value)}
                                                            value={{ label: `Cluster ${selectedWaterFallClusterIdx}`, value: selectedWaterFallClusterIdx }}
                                                        />
                                                        <button onClick={handleNextWaterFall} disabled={selectedWaterFallClusterIdx === numClusters - 1}>
                                                            Next &rarr;
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
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
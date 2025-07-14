import { useEffect, useState } from 'react';
import { IngestViewModel } from './IngestViewModel'
import { ReportViewModel } from './ReportViewModel';
import { remodelFromReportTS } from '../models/sklearn.tsx';

const colorMap = [
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

//not sure about the parameter 
export const RemodelViewModel = (uidValue, clusterCenters, recentClusterCenters, independentVars, observables) => {

    const [distances, setDistances] = useState([]);
    const [clusterLabels, setClusterLabels] = useState([]);

    useEffect(() => {

        if (!uidValue || !observables || !Array.isArray(observables) || observables.length === 0 || !Array.isArray(observables[0])) {
            //we return if the data has not yet loaded 
            return;
        }

        if (!recentClusterCenters || !Array.isArray(recentClusterCenters) || recentClusterCenters.length === 0) {
            return;
        }

        const loadData = async () => {
            try {
                const result = await remodelFromReportTS({
                    observables,
                    clusterCenters,
                    recentClusterCenters,
                    model_type: "KMeans"
                });

                setDistances(result.distances);
                setClusterLabels(result.clusterLabels);

            } catch (error) {
                console.error("Remodel error:", error);
            }
        };

        loadData();
    }, [uidValue, independentVars, observables, clusterCenters, recentClusterCenters]); //needs further testing

    return {
        distances, clusterLabels
    };

}

/**
 * prepareWaterFallScatter prepares traces for the waterfall plot where observables is sorted either by the independent variable or distances.
 * If distances is passed, then the function assumes that the sorting will be based on distances to a cluster selected by the user 
 */

export function prepareWaterFallScatter(observables, clusterLabels, independentVars, offset = 1, is1D = true, distances = null, selectedCluster = null) {
    const traces = [];
    const seenLabels = new Set(); //this ensures that the legend doesn't repeat clusterLabel values 
    //the offset for the waterfall plot will be determined by the user
    if (offset === "") {
        offset = 1;
    }

    const paired = observables.map((obs, i) => ({
        observable: obs,
        cluster: clusterLabels[i],
        independentVar: is1D ? independentVars[i] : independentVars[i][0], //if independent vars is 2D, extract the x value 
        distanceToCluster: !is1D && distances!==null && selectedCluster !== null ? distances[i][selectedCluster] : null
    }));

    // sorts by independent variable or distance to a selected cluster value in ascending order 
    (distances && selectedCluster !== null) ? paired.sort((a, b) => a.distanceToCluster - b.distanceToCluster) : paired.sort((a, b) => a.independentVar - b.independentVar);


    paired.forEach((entry, stackIndex) => {
        const x = entry.observable.map((_, idx) => idx);
        const y = entry.observable.map(val => val + stackIndex * offset); // stack by sorted index will add offset 

        const clusterLabel = entry.cluster;
        const showLegend = !seenLabels.has(clusterLabel);
        seenLabels.add(clusterLabel);
        traces.push({
            x,
            y,
            mode: 'lines',
            type: 'scatter',
            name: `Cluster ${clusterLabel}`,
            line: {
                color: colorMap[clusterLabel % colorMap.length],
            },
            showlegend: showLegend,
        });
    });
    return traces;
}


// This function creates a 2D grid of interpolated values based on the plotted 2D independent variables
// With a grid, a smooth heatmap that shows how the distance values change across the entire area is created
export function createHeatmapGrid(independentVars, distances, cluster, gridSize = 20) {
    // This finds the data bounds
    const xValues = independentVars.map(point => point[0]);
    const yValues = independentVars.map(point => point[1]);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Calculating grid spacing
    const xStep = (xMax - xMin) / (gridSize - 1);
    const yStep = (yMax - yMin) / (gridSize - 1);

    const grid = [];

    for (let i = 0; i < gridSize; i++) {
        const row = [];
        const yGrid = yMin + i * yStep;

        for (let j = 0; j < gridSize; j++) {
            const xGrid = xMin + j * xStep;

            // Inverse Distance Weighting Interpolation:
            //   -For each grid cell, the function calculates a weighted average of all data points
            //   - Closter points have more influence (Blue areas: close to cluster, Red areas: far from cluster)
            let totalWeight = 0;
            let weightedSum = 0;
            for (let k = 0; k < independentVars.length; k++) {
                const dx = independentVars[k][0] - xGrid;
                const dy = independentVars[k][1] - yGrid;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const weight = 1 / (distance + 0.001);

                const value = distances[k][cluster];

                weightedSum += value * weight;
                totalWeight += weight;
            }

            row.push(weightedSum / totalWeight);
        }
        grid.push(row);
    }
    return grid;
};

//unused at the moment:

export const prepareWaterfallScatterWOIndependent = (observables, clusterLabels) => {
    const traces = [];
    const offsetAmount = 1;
    const seenLabels = new Set(); // Tracks which clusters have already been labeled

    for (let i = 0; i < observables.length; i++) {
        const yValues = observables[i].map(val => val + i * offsetAmount);
        const xValues = observables[i].map((_, idx) => idx);

        // Pairs each value with corresponding x, then sorts
        const pairedValues = xValues.map((xVal, index) => ({
            xValues: xVal,
            yValues: yValues[index],
        }));
        const sortedPairValues = pairedValues.sort((a, b) => a.xValues - b.xValues);

        const x = sortedPairValues.map(p => p.xValues);
        const y = sortedPairValues.map(p => p.yValues);

        const clusterLabel = clusterLabels[i];
        const showLegend = !seenLabels.has(clusterLabel);
        seenLabels.add(clusterLabel);

        traces.push({
            x,
            y,
            mode: 'lines',
            type: 'scatter',
            name: `Cluster ${clusterLabel}`,
            marker: {
                color: colorMap[clusterLabel % colorMap.length],
            },
            showlegend: showLegend,
        });
    }
    return traces;
}

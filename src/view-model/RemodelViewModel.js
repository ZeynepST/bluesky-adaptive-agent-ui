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

export default function prepareWaterfallScatter1D(observables, clusterLabels, independentVars) {
    const traces = [];
    // const colorMap = ['#636EFA', '#00CC96', '#EF553B', '#AB63FA', '#FFA15A', '#19D3F3'];
    const seenLabels = new Set(); //this ensures that the legend doesn't repeat clusterLabel values 

    const paired = observables.map((obs, i) => ({
        observable: obs,
        cluster: clusterLabels[i],
        independentVar: independentVars[i]
    }));

    // sorts by independent variable value in ascending order 
    paired.sort((a, b) => a.independentVar - b.independentVar);

    paired.forEach((entry, stackIndex) => {
        const x = entry.observable.map((_, idx) => idx);
        const y = entry.observable.map(val => val + stackIndex); // stack by sorted index will add offset 

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

export const prepareWaterfallScatterWOIndependent = (observables, clusterLabels) => {
    const traces = [];
    const offsetAmount = 1;
    const colorMap = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA'];
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

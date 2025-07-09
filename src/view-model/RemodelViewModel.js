import { useEffect, useState } from 'react';
import { IngestViewModel } from './IngestViewModel'
import { ReportViewModel } from './ReportViewModel';
import { remodelFromReportTS } from '../models/sklearn.tsx';

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

export default function prepareWaterfallScatter1D(observables, clusterLabels, transformIndVarPlotData) {
    const traces = [];
    const offsetAmount = 1;
    const colorMap = ['#636EFA', '#EF553B', '#00CC96', '#AB63FA'];
    const seenLabels = new Set();

    for (let i = 0; i < observables.length; i++) {
        const yValues = observables[i].map(val => val + i * offsetAmount);
        const xValues = transformIndVarPlotData?.[0]?.y ?? [];
 
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
            showlegend: showLegend, // this ensures that it only shows legend once per cluster
        });
    }

    return traces;
}

export const prepareWaterfallScatterWOIndependent=(observables, clusterLabels) =>{
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

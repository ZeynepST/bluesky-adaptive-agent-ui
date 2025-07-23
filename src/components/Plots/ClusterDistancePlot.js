import { useState } from 'react';
import Select from 'react-select';
import PlotlyScatter from './PlotlyScatter';
import '../../stylesheets/PlotStylesheets/ClusterDistancePlot.css';



const ClusterDistancePlot = ({ distances, transformIndVarPlotData }) => {
    const numClusters = distances[0]?.length || 0;
    const [selectedCluster, setSelectedCluster] = useState(0);

    const clusterOptions = Array.from({ length: numClusters }, (_, i) => ({
        value: i,
        label: `Cluster ${i+1}`
    }));

    const handlePrev = () => {
        setSelectedCluster(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setSelectedCluster(prev => Math.min(numClusters - 1, prev + 1));
    };

    const trace = {
        x: transformIndVarPlotData[0].x,
        y: transformIndVarPlotData[0].y,
        type: 'scatter',
        mode: 'markers',
        name: `Distance to Cluster ${selectedCluster+1}`,
        marker: {
            color: distances.map(d => d[selectedCluster]),
            colorscale: 'Viridis',
            showscale: true,
            colorbar: {
                title: {
                    text: 'Distances'
                },
            }
        }
    };

    return (
        <div>
            <PlotlyScatter
                data={[trace]}
                title={`Distances to Cluster ${selectedCluster +1 }`}
                xAxisTitle="Index"
                yAxisTitle="Independent Variable (1D)"
            />
            <div className="cluster-distance-plot-selector-container">
                <button onClick={handlePrev} disabled={selectedCluster === 0}>&larr; Prev</button>
                <Select
                    options={clusterOptions}
                    value={clusterOptions.find(opt => opt.value === selectedCluster)}
                    onChange={(opt) => setSelectedCluster(opt.value)}
                    styles={{ container: base => ({ ...base, minWidth: 200 }) }}
                />
                <button onClick={handleNext} disabled={selectedCluster === numClusters - 1}>Next &rarr;</button>
            </div>
        </div>
    );
};

export default ClusterDistancePlot;

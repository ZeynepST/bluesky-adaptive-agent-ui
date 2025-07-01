import Plot from 'react-plotly.js';

function ScatterPlot({ vars=[] }) {

    //this converts the nested [value] to value
    const y = vars.map(d => d[0]);
    const x = y.map((_, i) => i); //index positions

    return (
        <Plot
            data={[{
                x,
                y,
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'blue', size: 10 },
                }]}
            layout={{
                title: 'Scatter Plot of Independent Values',
                xaxis: { title: 'Index' },
                yaxis: { title: 'Value' },
                height: 400
            }}
        />
    );
}

export default ScatterPlot;

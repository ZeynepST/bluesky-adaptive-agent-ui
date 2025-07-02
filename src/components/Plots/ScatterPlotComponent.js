import Plot from 'react-plotly.js';

// this is for 1D arrays
function ScatterPlot({ vars = [] }) {

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
                title: {
                    text: 'Scatter Plot of Independent Values',
                    x: 0.5,
                    xanchor: 'center',
                    font: {
                        size: 15
                    }
                },
                xaxis: {
                    title: {
                        text: 'Index',
                        font: {
                            size: 10
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Independent Variables',
                        font: {
                            size: 10
                        }
                    }
                },
                height: 400
            }
            }
        />
    );
}

export default ScatterPlot;

import Plot from 'react-plotly.js';

function WaterFallPlot({ observables }) {
  // offsetObservables is an array where the value of each row is shifted upward by its index
  const offsetObservables = observables.map((row, rowIndex) =>
    row.map(value => value + rowIndex)
  );

  //singeLine represents each line on the plot
  const singleLine = offsetObservables.map((row, i) => ({
    x: row.map((_, j) => j),
    y: row,
    type: 'scatter',
    mode: 'lines',
    name: `Series ${i}`,
  }));

  return (
    <Plot
      data={singleLine}
      layout={{
        title: {
          text: 'Waterfall Plot of Observables',
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
            text: 'Value',
            font: {
              size: 10
            }
          }
        },
        // height: 400,
        // showlegend: false,
        autosize: true,
        margin: { l: 40, r: 20, t: 40, b: 40 },
      }}

      config={{ responsive: true }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default WaterFallPlot;

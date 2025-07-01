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
        title: 'Waterfall Plot of Observables',
        // should the x axis be the timestamps?
        xaxis: { title: 'Time' },
        yaxis: { title: 'Offset Value' },
        height: 400,
        showlegend: false,
      }}
    />
  );
}

export default WaterFallPlot;

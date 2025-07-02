import Plot from 'react-plotly.js';
import { useState } from 'react';
import '../stylesheets/PlotStylesheets/WaterFallPlotComponent.css';

function WaterFallPlot({ observables }) {

  //the offset for the waterfall plot will be determined by the user
  const [offSet, setOffSet] = useState("");

  // offsetObservables is an array where the value of each row is shifted upward by its index
  const offsetObservables = observables.map((row, rowIndex) =>
    row.map(value => value + (rowIndex *( Number(offSet) || 1)))
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
    <div className="waterfall-plot-container">
      <div className="waterfall-plot-wrapper">
        {/* beginning of plot */}
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
            autosize: true,
            margin: { l: 40, r: 20, t: 40, b: 40 },
          }}

          config={{ responsive: true }}
          useResizeHandler={true}
          // keeping height at a set value makes it stable and no longer overlaps the input area 
          style={{ width: '100%', height: 500}}
        />
        {/* end of plot */}


        <div className="waterfall-plot-offset-input-box" >
          <input
            type="number"
            className="offset-input"
            placeholder="Enter Offset..."
            value={offSet}
            onChange={(e) => setOffSet(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

export default WaterFallPlot;

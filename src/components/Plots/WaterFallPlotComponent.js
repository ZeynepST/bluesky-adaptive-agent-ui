import Plot from 'react-plotly.js';
import { useState, useRef, useEffect } from 'react';
import '../../stylesheets/PlotStylesheets/WaterFallPlotComponent.css';

function WaterFallPlot({
  data,
  title,
  xAxisTitle,
  yAxisTitle,
  xAxisRange,
  yAxisRange,
  xAxisLayout,
  className,
  colors
}) {

  const plotContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    //resize observer is used to automatically size the Plotly chart based on the parent container's size
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    if (plotContainer.current) {
      resizeObserver.observe(plotContainer.current);
    }

    return () => resizeObserver.disconnect();
  }, []);
  //the offset for the waterfall plot will be determined by the user
  const [offSet, setOffSet] = useState("");

  // offsetObservables is an array where the value of each row is shifted upward by its index
  const offsetObservables = data?.map((row, rowIndex) =>
    row.map(value => value + (rowIndex * (Number(offSet) || 1)))
  );

  //singeLine represents each line on the plot
  const singleLine = offsetObservables.map((row, i) => ({
    x: row.map((_, j) => j),
    y: row,
    type: 'scatter',
    mode: 'lines',
    name: `Series ${i+1}`,
  }));

  return (
    <div className="waterfall-plot-container" >
      <div className="waterfall-plot-wrapper">
        {/* beginning of plot */}
        <div ref={plotContainer}>
          <Plot
            data={singleLine}
            layout={{
              title: {
                text: title,
                x: 0.5,
                xanchor: 'center',
              },
              xaxis: {
                title: {
                  text: xAxisTitle,
                }
              },
              yaxis: {
                title: {
                  text: yAxisTitle,
                }
              },
              autosize: true,
              width: dimensions.width,
              height: dimensions.height,
              margin: { l: 40, r: 20, t: 40, b: 40 },
            }}
            config={{ responsive: true }}
          />
        </div>
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

/**
 * This component is modified from the Bluesky/Finch React component library.
 * Original source: https://github.com/bluesky/finch
 * License: BSD 3-Clause License (see original license at the link above)
 */

import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

// will need to add licensing 
export default function PlotlyScatter({
  data, //data must be a Plotly-compatible array of trace objects. Each object has keys like x,y, mode, etc. 
  title,
  xAxisTitle,
  yAxisTitle,
  xAxisRange,
  yAxisRange,
  xAxisLayout,
  yAxisLayout,
  className,
  colorAxisRange, //This is a new feature to lock the colorscale axis 
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

  return (
    <div className={`pb-4 ${className ?? ''}`} ref={plotContainer}>
      <Plot
        data={data}
        layout={{
          title: {
            text: title
          },
          xaxis: {
            title: {
              text: xAxisTitle
            },
            range: xAxisRange,
            ...xAxisLayout,
          },
          yaxis: {
            title: {
              text: yAxisTitle
            },
            range: yAxisRange,
            ...yAxisLayout,
          },
          autosize: true,
          width: dimensions.width,
          height: dimensions.height,
          margin: {
            l: yAxisTitle ? 60 : 30,
            r: 30,
            t: title ? 40 : 30,
            b: xAxisTitle ? 60 : 30,
          },
          //added coloraxis
          coloraxis: {
            colorscale: 'Viridis',
            colorbar: {
              title: 'Distance',
              x: 1.22, // move it slightly right of the plot
            },
            ...(colorAxisRange ?? {})  // Applies cmin/cmax if provided
          },
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import '../../stylesheets/PlotStylesheets/PlotlyHeatmap.css';

export default function PlotlyHeatmap(
    {
        title = 'Heatmap',
        array, //2d array
        xAxisTitle = '',
        yAxisTitle = '',
        colorScale = 'Viridis',
        verticalScaleFactor = 0.1, //this is used to compute the dynamic height 
        // width = 'w-full',
        // height = 'h-full',
        showTicks = true,
        tickStep = 100, //controls spacing between tick markers
        showScale = true,
        lockPlotHeightToParent = false, //locks the height of the plot to the height of the container, should not be set to True if lockPlotWidthHeightToInputArray is on
        lockPlotWidthHeightToInputArray = false
    }
) {
    const [zMaxOffset, setZMaxOffset] = useState("");
    const plotContainer = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    //Hook to update dimensions of plot dynamically
    useEffect(() => {
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
    if (!array || array.length === 0) {
        return <div className="text-sm text-gray-500 italic">No data available</div>;
    }
    // console.log("the array passed is ", array);
    // Calculate the height based on the number of rows in the array
    const dynamicHeight = Math.max(array.length * verticalScaleFactor, 0);

    return (
        <div className='plotly-heatmap-container'>
            <div className={`plotly-heatmap-wrapper`} ref={plotContainer}>
                <Plot
                    data={[
                        {
                            z: array,
                            type: 'heatmap',
                            colorscale: colorScale,
                            zmin: 0,
                            zmax: zMaxOffset, //this should be controlled by the user
                            showscale: showScale,
                        }
                    ]}
                    layout={{
                        title: {
                            text: title,
                        },
                        xaxis: {
                            title: {
                                text: xAxisTitle
                            },
                            automargin: false,
                            showticklabels: showTicks,
                            showgrid: showTicks
                        },
                        yaxis: {
                            title: {
                                text: yAxisTitle
                            },
                            range: [-0.5, array.length - 0.5], // Dynamically adjust y-axis range
                            autorange: false,
                            automargin: false,
                            tickmode: showTicks ? 'linear' : undefined,
                            tick0: 0, // Starting tick
                            dtick: showTicks ? tickStep : 10000, // Tick step,
                            showticklabels: showTicks,
                            showgrid: showTicks
                        },
                        autosize: true,
                        width: lockPlotWidthHeightToInputArray ? Math.min(dimensions.width, array[0].length) : dimensions.width,
                        height: lockPlotWidthHeightToInputArray ? Math.min(dimensions.height, array.length) : lockPlotHeightToParent ? dimensions.height : dynamicHeight, // Dynamically set height
                        margin: {
                            l: (showTicks || yAxisTitle) ? 50 : 0,
                            r: 0,
                            t: 40,
                            b: xAxisTitle ? 40 : 0,
                        },
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%', height: '100%' }}
                />
                {/* end of plot */}
            </div>
            <div className="plotly-heatmap-offset-input-box" >
                <input
                    type="number"
                    className="plotly-heatmap-offset-input"
                    placeholder="Enter Offset..."
                    value={zMaxOffset}
                    onChange={(e) => setZMaxOffset(Number(e.target.value))}
                />
            </div>
        </div>
    );

}

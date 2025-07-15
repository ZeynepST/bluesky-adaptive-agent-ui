/**
 * This component is modified from the Bluesky/Finch React component library.
 * Original source: https://github.com/bluesky/finch
 * License: BSD 3-Clause License (see original license at the link above)
 */

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
        verticalScaleFactor = 0.1,
        showTicks = true,
        tickStep = 100,
        showScale = true,
        lockPlotHeightToParent = false,
        lockPlotWidthHeightToInputArray = false,
        dataPoints = null, // Array of [x, y] coordinates
        selectedCluster = 0,
        distances = null, // Distance array for coloring points
        gridBounds = null, // {xMin, xMax, yMin, yMax} for mapping points to grid coordinates
        zMin = 0,
        zMax = null
    }
) {
    const [zMaxOffset, setZMaxOffset] = useState("");
    const plotContainer = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
        return <div>No data available</div>;
    }

    // Calculate the height based on the number of rows in the array
    const dynamicHeight = Math.max(array.length * verticalScaleFactor, 0);

    // Prepare plot data
    const plotData = [
        {
            z: array,
            type: 'heatmap',
            colorscale: colorScale,
            zmin: zMin,
            zmax: zMax ?? zMaxOffset, // In Plotly heatmaps, zmax is the paramater used to define the upper bound of the color scale's domain. 
            showscale: showScale,
            name: 'Distance Field'
        }
    ];

    // Add data points as scatter plot if provided
    if (dataPoints && gridBounds) {
        // Convert actual coordinates to grid coordinates
        const gridSize = array[0].length; // this assumes a square grid
        const gridHeight = array.length;

        const xGrid = dataPoints.map(point =>
            ((point[0] - gridBounds.xMin) / (gridBounds.xMax - gridBounds.xMin)) * (gridSize - 1)
        );
        const yGrid = dataPoints.map(point =>
            ((point[1] - gridBounds.yMin) / (gridBounds.yMax - gridBounds.yMin)) * (gridHeight - 1)
        );

        // Get colors for points based on their distance to selected cluster
        let pointColors = dataPoints.map((_, i) => 'white');
        let pointSizes = dataPoints.map(() => 12);

        if (distances) {
            const clusterDistances = distances.map(d => d[selectedCluster]);
            pointColors = clusterDistances.map(dist => {
                return `rgb(0,0,0)`; // This was chosen for easy visualization
            });
            pointSizes = clusterDistances.map(() => 15);
        }

        plotData.push({
            x: xGrid,
            y: yGrid,
            mode: 'markers+text',
            type: 'scatter',
            marker: {
                size: pointSizes,
                color: pointColors,
                line: {
                    color: 'black',
                    width: 2
                }
            },
            text: dataPoints.map((_, i) => `P${i}`),
            textposition: 'middle center',
            textfont: {
                color: 'black',
                size: 10,
                family: 'Arial Black'
            },
            name: 'Data Points',
            showlegend: false
        });
    }
    return (
        <div className='plotly-heatmap-container'>
            <div className={`plotly-heatmap-wrapper`} ref={plotContainer}>
                <Plot
                    data={plotData}
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
                            showgrid: showTicks,
                            ...(gridBounds && {
                                tickmode: 'array',
                                tickvals: [0, array[0].length / 2, array[0].length - 1],
                                ticktext: [
                                    gridBounds.xMin.toFixed(2),
                                    ((gridBounds.xMin + gridBounds.xMax) / 2).toFixed(2),
                                    gridBounds.xMax.toFixed(2)
                                ]
                            })
                        },
                        yaxis: {
                            title: {
                                text: yAxisTitle
                            },
                            range: [-0.5, array.length - 0.5],
                            autorange: false,
                            automargin: false,
                            tickmode: showTicks ? 'linear' : undefined,
                            tick0: 0,
                            dtick: showTicks ? tickStep : 10000,
                            showticklabels: showTicks,
                            showgrid: showTicks,
                            ...(gridBounds && {
                                tickmode: 'array',
                                tickvals: [0, array.length / 2, array.length - 1],
                                ticktext: [
                                    gridBounds.yMin.toFixed(2),
                                    ((gridBounds.yMin + gridBounds.yMax) / 2).toFixed(2),
                                    gridBounds.yMax.toFixed(2)
                                ]
                            })
                        },
                        autosize: true,
                        width: lockPlotWidthHeightToInputArray ? Math.min(dimensions.width, array[0].length) : dimensions.width,
                        height: lockPlotWidthHeightToInputArray ? Math.min(dimensions.height, array.length) : lockPlotHeightToParent ? dimensions.height : dynamicHeight,
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
            </div>
            <div className="plotly-heatmap-offset-input-box">
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
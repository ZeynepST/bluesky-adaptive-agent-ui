import Plot from 'react-plotly.js';

const LatestClusterCentersPlot = ({ data = [] }) => {

  //traces stores the results of the mapping
  //center is the element being processed in the cluster center array 
  const traces = data.map((center, index) => ({
    x: center.map((_, i) => i+1),
    y: center,
    type: 'scatter',
    mode: 'lines+markers',
    name: `Cluster ${index + 1}`,
  }));

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Latest KMeans Cluster Centers',
          font: {
            size: 15
          }
        },
        xaxis: {
          title: {
            text: "Index",
            font: {
              size: 10
            }
          }
        },
        yaxis:
        {
          title: {
            text: "Cluster Center Values",
            font: {
              size: 10
            }
          },
        },
      }}
    />
  );
};

export default LatestClusterCentersPlot;

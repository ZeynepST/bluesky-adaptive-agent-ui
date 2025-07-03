import React, { useContext, useEffect, useState } from 'react';
import { UidContext } from '../view-model/UidContext';
import { IngestViewModel } from '../view-model/IngestViewModel';
import WaterFallPlot from '../components/Plots/WaterFallPlotComponent';
import ScatterPlot from '../components/Plots/ScatterPlotComponent';

import { useParams } from 'react-router-dom';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';

import PlotlyScatter from '../components/Plots/PlotlyScatter';

/**
 * IngestDatPage will render the data under the ingest component of http://localhost:8000/ui/browse
 */

// this uid is an object
const IngestDataPage = () => {

    // uidsInfo is the list of uids and some respective information which will first be populated in a useEffect
    const { uidsInfo } = useContext(UidContext);

    // uidValue refers to the UID selected from the sidebar 
    const { viewMode, uidValue } = useParams();

    const chosenUidObject = uidsInfo.find(uid => uid.uidValue === uidValue);

    const { loadingIngest, independent_vars, observables, ingestTimeStamps, transformIndVar } = IngestViewModel(uidValue);

    return (
        <div className="ingest-data-page">
            <React.Fragment key={uidValue}>
                {/* This ensures that the IngestDataPage doesn't render information for the wrong UID */}
                {chosenUidObject?.uidValue === uidValue && chosenUidObject?.hasIngest && (
                    <div className="ingest-data-page-container">
                        <div className="ingest-data-page-graphs">
                            <div className="ind-vars-graph">
                                {/* <ScatterPlot vars={independent_vars} /> */}
                                <PlotlyScatter
                                    data={transformIndVar}
                                    title="Scatter Plot of Independent Variables"
                                    xAxisTitle="Feature Index"
                                    yAxisTitle="Independent Variables" />
                            </div>
                            <div className="observables-graph" style={{ width: '100%', height: '100%'}}>
                                <WaterFallPlot observables={observables} />
                            </div>

                        </div>

                    </div>
                )}
            </React.Fragment>
        </div>
    );
}

export default IngestDataPage;
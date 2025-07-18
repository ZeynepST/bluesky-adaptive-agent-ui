import { useState, useEffect } from "react";
import { get_cache_len, get_independent_variables, get_observables, get_ingest_timestamps } from "../models/fetchIngestData";


//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const IngestViewModel = (uidValue,  refreshKey = 0) => {

    const [cache_len, setCacheLength] = useState(null);
    const [independentVars, setIndependentVar] = useState([]);
    /**
     * transformIndVarPlotData is the formatted version of independentVars that is ready for plotting with Plotly 
     * independentVars itself is not directly plottable by Plotly because Plotly expects flat arrays for x and y
     * IngestViewModel handles the logic for when independent variables are either 1D or 2D. No furhter processing for transformIndVarPlotData is needed elsewhere
     */
    const [transformIndVarPlotData, setTransformIndVarPlotData] = useState([]);
    const [observables, setObservables] = useState([]);
    const [loadingIngest, setLoadingIngest] = useState(false);
    const [ingestTimeStamps, setIngestTimeStamps] = useState([]);
    const [is1D, setIs1D] = useState(true);



    useEffect(() => {

        if (!uidValue) return;

        const loadData = async () => {
            try {
                setLoadingIngest(true);

                const cacheResponse = await get_cache_len(uidValue);
                const independentVarResponse = await get_independent_variables(uidValue);
                const observablesReponse = await get_observables(uidValue);
                const timeStampResponse = await get_ingest_timestamps(uidValue);

                setCacheLength(cacheResponse);
                setIndependentVar(independentVarResponse);
                setObservables(observablesReponse);
                setIngestTimeStamps(timeStampResponse);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoadingIngest(false);
            }
        }
        loadData();
    }, [uidValue, refreshKey]); //need to check [uidValue]

    // This useEffect is to derive a Plotly-compatible array of trace objects form independentVars
    useEffect(() => {

        if (!uidValue) return;
        if (!independentVars || independentVars.length === 0) return;

        const loadData = async () => {
            try {
                //first check if independentVars is 1D or 2D
                const is1D = !Array.isArray(independentVars[0]) || independentVars[0].length === 1;
                let data;
                if (is1D) {
                    const y = independentVars.map(d => d[0]); //this converts the nested [value] to value
                    const x = y.map((_, i) => i); //this extracts the index positions
                    data = [
                        {
                            x: x,
                            y: y,
                            type: 'scatter',
                            mode: 'markers',
                            name: `Independent Variable`,
                            marker: {
                                size: 15
                            }
                        }
                    ];
                }
                else {
                    //Handles 2D: Scatter plot of [x, y] values
                    const x = independentVars.map(d => d[0]); //[]
                    const y = independentVars.map(d => d[1]);//[]
                    data = [
                        {
                            x: x,
                            y: y,
                            type: 'scatter',
                            mode: 'markers',
                            name: 'Independent Variables (2D)',
                            marker: {
                                size: 15
                            }
                        }
                    ];
                    setIs1D(false); //setting 
                }
                setTransformIndVarPlotData(data);

            }
            catch (error) {
                console.error(error);
            }
        }
        loadData();
    }, [independentVars]);


    return {
        loadingIngest, cache_len, independentVars, observables, ingestTimeStamps, transformIndVarPlotData, is1D
    };



};
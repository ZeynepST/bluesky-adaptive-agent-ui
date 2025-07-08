import { useState, useEffect } from "react";
import { get_cache_len, get_independent_variables, get_observables, get_ingest_timestamps } from "../models/fetchIngestData";
import { RemodelViewModel } from "./RemodelViewModel";

//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const IngestViewModel = (uidValue) => {

    const [cache_len, setCacheLength] = useState(null);
    const [independentVars, setIndependentVar] = useState([]);
    const [transformIndVarPlotData,  setTransformIndVarPlotData] = useState([]);
    const [observables, setObservables] = useState([]);
    const [loadingIngest, setLoadingIngest] = useState(false);
    const [ingestTimeStamps, setIngestTimeStamps] = useState([]);

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
    }, [uidValue]); //need to check [uidValue]

    useEffect(() => {

        if (!uidValue) return;
        if (!independentVars || independentVars.length === 0) return;

        const loadData = async () => {
            try {
                //first check if independentVars is 1D or 2D
                const is1D = !Array.isArray(independentVars[0]) || independentVars[0].length === 1;
                let data;
                if (is1D) {
                    //this converts the nested [value] to value
                    const y = independentVars.map(d => d[0]);
                    const x = y.map((_, i) => i); //index positions
                    data = [
                        {
                            x: x,
                            y: y,
                            type: 'scatter',
                            mode: 'lines+markers',
                            name: `Independent Variable`,
                        }
                    ];
                }
                else {
                    //Handles 2D: Scatter plot of [x, y] values
                    const x = independentVars.map(d => d[0]);
                    const y = independentVars.map(d => d[1]);
                    data = [
                        {
                            x: x,
                            y: y,
                            type: 'scatter',
                            mode: 'markers',
                            name: 'Independent Variables (2D)',
                        }
                    ];
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
        loadingIngest, cache_len, independentVars, observables, ingestTimeStamps, transformIndVarPlotData
    };



};
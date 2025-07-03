import { useState, useEffect } from "react";
import { get_cache_len, get_independent_variables, get_observables, get_ingest_timestamps } from "../models/fetchIngestData";

//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const IngestViewModel = (uidValue) => {

    const [cache_len, setCacheLength] = useState(null);
    const [independent_vars, setIndependentVar] = useState([]);
    const[transformIndVar, setTransformIndVar]=useState([]);
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

        const loadData = async () => {
            try {
                //this converts the nested [value] to value
                const y =  independent_vars.map(d => d[0]);
                const x = y.map((_, i) => i); //index positions
                const data = [
                    {
                        x: x,
                        y: y,
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: `Independent Variable`,
                    }
                ];
                setTransformIndVar(data);
            }
            catch (error) {
                console.error(error);
            }

        }
        loadData();
    }, [independent_vars]);


    return {
        loadingIngest, cache_len, independent_vars, observables, ingestTimeStamps, transformIndVar
    };



};
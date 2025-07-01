import { useState, useEffect } from "react";
import { get_cache_len, get_independent_variables, get_observables, get_ingest_timestamps } from "../models/fetchIngestData";

//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const IngestViewModel = (uidValue) => {

    const [cacheLen, setCacheLen] = useState(null);
    const [independentVar, setIndependentVar] = useState([]);
    const [observables, setObservables] = useState([]);
    const [loadingIngest, setLoadingIngest] = useState(false);
    const [ingestTimeStamps, setIngestTimeStamps] = useState([]);

    useEffect(() => {

        console.log('inside of useeffect in ingest view model');
        if (!uidValue) return;

        const loadData = async () => {
            try {
                setLoadingIngest(true);

                const cacheResponse = await get_cache_len(uidValue);
                const independentVarResponse = await get_independent_variables(uidValue);
                const observablesReponse = await get_observables(uidValue);
                const timeStampResponse=await get_ingest_timestamps(uidValue);

                setCacheLen(cacheResponse);
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


    return {
        loadingIngest, cacheLen, independentVar, observables, ingestTimeStamps
    };



};
import { useState, useEffect } from "react";
import { get_cache_len } from "../models/fetchIngestData";

//uid is the object, not the uid number itself. To access the uid number you need to do uid.uidValue as defined in fetchUids.js
export const IngestViewModel = (uidValue) => {

    const [cacheLen, setCacheLen] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        console.log('inside of useeffect in ingest view model');
        if (!uidValue) return;

        const loadData = async () => {
            try {
                setLoading(true);
                //This is how to deal with multiple calls 
                // const [cacheResponse] = Promise.all (
                //     [get_cache_len(uidValue)]
                // );

                const cacheResponse=await get_cache_len(uidValue);
                setCacheLen(cacheResponse);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        }
        loadData();
    }, [uidValue]); //need to check [uidValue]


    return {
        loading, cacheLen
    };



};
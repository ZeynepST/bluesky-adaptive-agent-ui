import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { useRef } from "react";

export const ModelContext = createContext();

const agent_address = process.env.REACT_APP_AGENT_ADDRESS;
const agent_port = process.env.REACT_APP_AGENT_PORT;


export function ModelProvider({ children }) {

    //variables refers to all of the variables 
    //setNames refer to both variable and method names 
    const [names, setNames] = useState([]);
    const [canRefresh, setCanRefresh] = useState(true);
    const timeoutRefresh = useRef(null);


    const initializeButtonIDState = async (buttonId) => {
        try {
            const response = await axios.get(`/api/variable/${buttonId}`);
            const response_str = String(response.data[buttonId] ?? "UNKNOWN");
            return response_str;
        }
        catch (error) {
            return null;
        }

    }
    //false means idle (gray)
    //true means on (green)
    //null means error (red)

    const [buttonStates, setButtonStates] = useState({
        direct_to_queue: false,
        suggest_on_ingest: false,
        report_on_ingest: false
    });


    const get_names = async () => {
        try {
            const response = await axios.get('api/variables/names');
            setNames(response.data.names || []);
        }
        catch (error) {
            if (!error.response) {
                console.error("network error ", error);
            }
            else if (error.request) {
                console.error("no response received, but the request was sent  ", error);
            }
            else {
                console.error("not sure what this is ", error.response.data);
            }
        }
    }

    const manual_refresh = () => {
        if (!canRefresh) {
            return;
        }
        get_names();
        setCanRefresh(false);

        timeoutRefresh.current = setTimeout(() => {
            setCanRefresh(true);
        }, 600000);
    }

    useEffect(() => {

        const loading = async () => {
            const direct_to_queue_value = await initializeButtonIDState("direct_to_queue");
            const suggest_value = await initializeButtonIDState("suggest_on_ingest");
            const report_value = await initializeButtonIDState("report_on_ingest");

            setButtonStates({
                direct_to_queue: direct_to_queue_value,
                suggest_on_ingest: suggest_value,
                report_on_ingest: report_value
            })
        };
        loading();
        get_names();
        const interval = setInterval(get_names, 600000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeoutRefresh.current);
        }
    }, []);



    //when generateReport is false, that means there was an issue with generating the report
    const [reportStatus, setReportStatus] = useState("idle");
    const [suggestionStatus, setSuggestionStatus] = useState("idle");

    const toggle = async (buttonId) => {
        const current = buttonStates[buttonId];
        const newState = !current;
        try {
            const response = await axios.get(`/api/variable/${buttonId}`);
            const response_str = String(response.data[buttonId] ?? "UNKOWN");
            const new_value = !["True", "true", "on"].includes(response_str);
            const payload = { "value": new_value };

            try {
                const new_response = await axios.post(`/api/variable/${buttonId}`, payload);
                if (new_response) {
                    setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
                }
                else {
                    setButtonStates((prev) => ({ ...prev, [buttonId]: null }));
                }
            }
            catch (error) {
                console.error("trying something ", error);
            }
        }
        catch (error) {
            console.error("Failed to update toggle ", error);
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));
        }
    }


    const generate_report = async () => {
        try {
            setReportStatus("loading");
            const payload = { "value": [[], {}] };
            const response = await axios.post(`/api/variable/generate_report`, payload);
            setReportStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate report ", error);
            setReportStatus("error");
        }
    }

    const generate_suggestion = async () => {
        try {
            setSuggestionStatus("loading");
            const payload = { "value": [[1], {}] };
            const response = await axios.post(`/api/variable/add_suggestions_to_queue`, payload);
            setSuggestionStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate suggestion");
            setSuggestionStatus("error");
        }
    }

    const submit_uids = async (content) => {
        const processedContent = content.split(/[\n,]+/);

        try {
            const payload = { "value": [[processedContent], {}] }; //need to check 
            //or does api expect {json:payload}
            const response = await axios.post('/api/variable/ingest_uids', payload);
            return "success";
        }
        catch (error) {
            console.error("Error with submitting UID ", error);
            return "The following error was received: ";
        }
    }

    const get_variable = async (variable_name) => {
        try {
            const response = await axios.get(`/api/variable/${variable_name}`);
            return String(response?.data?.[variable_name] ?? "UNKNOWN"); //this is the parsed JSON response, and is the value of the variable 
        }
        catch (error) {
            return "ERROR";
        }
    }

    //does this have to return anything to the user? Can the update be reflected in the list instead?
    const update_variable = async (variable_name, new_value) => {
        try {
            let payload = { "value": new_value }; //need to check
            const response = await axios.post(`/api/variable/${variable_name}`, payload);
            return "success";
        }
        catch (error) {
            console.error("Error with updating variable", error);
            return "ERROR";
        }
        // if this variable is updated, available variables and methods should be updated as well. I need to set up an useEffect()
    }



    const call_method = async (method_name, args, kwargs) => {
        try {
            const parsedArgs = args ? JSON.parse(args) : [];
            const parsedKwargs = kwargs ? JSON.parse(kwargs) : {};
            const payload = {
                value: [parsedArgs, parsedKwargs]
            };
            const response = await axios.post(`/api/variable/${method_name}`, payload);
            return "success";
        }
        catch (error) {
            console.error("Error with calling the method ", error);
            return "Failure";
        }
    }


    return (
        <ModelContext.Provider value={{ manual_refresh, names, canRefresh, get_names, call_method, update_variable, get_variable, submit_uids, reportStatus, toggle, buttonStates, generate_report, generate_suggestion, suggestionStatus }}>
            {children}
        </ModelContext.Provider>
    );

}
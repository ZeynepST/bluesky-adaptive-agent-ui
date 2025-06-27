import { useState, useEffect } from "react";
import axios from "axios";
import { createContext, useContext } from "react";
import { useRef } from "react";
import { UidContext } from "./UidContext";

export const ModelContext = createContext();

// const agent_address = process.env.REACT_APP_AGENT_ADDRESS;
// const agent_port = process.env.REACT_APP_AGENT_PORT;

export function ModelProvider({ children }) {
    //variables refers to all of the variables 
    //setNames refer to both variable and method names 
    const [names, setNames] = useState([]);
    const [canRefresh, setCanRefresh] = useState(true);
    const timeoutRefresh = useRef(null);

    // testing
    const { get_uids, setUidRefresh } = useContext(UidContext);


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
        report_on_ingest: false,
        queue_add_position: null
    });


    const get_names = async () => {
        try {
            const response = await axios.get('/api/variables/names');
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
                console.error(error.response.data);
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
            const suggest_on_ingest_value = await initializeButtonIDState("suggest_on_ingest");
            const report_on_ingest_value = await initializeButtonIDState("report_on_ingest");

            const queue_add_position_value = await initializeButtonIDState("queue_add_position");

            setButtonStates({
                direct_to_queue: direct_to_queue_value,
                suggest_on_ingest: suggest_on_ingest_value,
                report_on_ingest: report_on_ingest_value,
                queue_add_position: queue_add_position_value
            });
        };
        loading();

    }, []);

    useEffect(() => {
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
        const convert_to_bool = x => x === "true" || x === true;
        const current = convert_to_bool(buttonStates[buttonId]);
        const newState = !current;
        //This is optimistic UI
        setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
        try {
            const response = await axios.get(`/api/variable/${buttonId}`);
            const responseStr = String(response.data[buttonId] ?? "UNKOWN");
            const newValue = !["True", "true", "on"].includes(responseStr);
            const payload = { "value": newValue };
            const newResponse = await axios.post(`/api/variable/${buttonId}`, payload);
        }
        catch (error) {
            console.error("Failed to update toggle ", error);
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));
        }
        //not sure if this logic is correct
        setUidRefresh(prev => !prev);

    }

    const toggle_queue_add_position = async (buttonId) => {
        const newState = buttonStates[buttonId] === "front" ? "back" : "front";
        //This is optimistic UI
        setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
        try {
            const response = await axios.get(`/api/variable/${buttonId}`);
            const responseStr = String(response.data[buttonId] ?? "UNKOWN");
            const newValue = newState; //need to check logic 
            // "front" if resp_str != "front" else "back"
            const payload = { "value": newValue };
            const newResponse = await axios.post(`/api/variable/${buttonId}`, payload);
            setButtonStates((prev) => ({ ...prev, [buttonId]: newValue }));
        }
        catch (error) {
            console.error("Failed to update queue add position toggle  ", error);
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));
        }
        //not sure if this logic is correct
        setUidRefresh(prev => !prev);
    }


    const generate_report = async () => {
        try {
            setReportStatus("loading");
            const payload = { "value": [[], {}] };
            const response = await axios.post(`/api/variable/generate_report`, payload);
            //Testing
            setUidRefresh(prev => !prev);
            setReportStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate report ", error);
            //Testing
            setUidRefresh(prev => !prev);
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
        try {
            const processedContent = content.split(/[\n,]+/);
            const payload = { "value": [[processedContent], {}] }; //need to check 
            //or does api expect {json:payload}
            const response = await axios.post('/api/variable/ingest_uids', payload);
            // Since uids were submitted, there will be an ingest feature with data, hence the list of uids must be updated 
            setUidRefresh(prev => !prev);
            return "success";
        }
        catch (error) {
            console.error("Error with submitting UID ", error);
            setUidRefresh(prev => !prev);
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

            //not sure if this logic is correct
            setUidRefresh(prev => !prev);

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

            //not sure if this logic is correct
            setUidRefresh(prev => !prev);

            return "success";
        }
        catch (error) {
            console.error("Error with calling the method ", error);
            return "Failure";
        }
    }


    return (
        <ModelContext.Provider value={{
            manual_refresh, names, setNames, canRefresh, get_names, call_method,
            update_variable, get_variable, submit_uids, reportStatus, toggle, toggle_queue_add_position, buttonStates,
            generate_report, generate_suggestion, suggestionStatus
        }}>
            {children}
        </ModelContext.Provider>
    );

}
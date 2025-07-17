import { useState, useEffect } from "react";
import axios from "axios";
import { createContext, useContext } from "react";
import { useRef } from "react";
import { UidContext } from "./UidContext";

/**
 * ModelContext manages application state related to agent behaviors,
 * feature toggles, variable management, UID submission, reporting, and suggestions.
 *
 * @context
 * @property {boolean} canRefresh - Flag indicating if the manual refresh is allowed.
 * @property {Array} names - List of available variable and method names.
 * @property {Function} get_names - Fetches variable/method names from server.
 * @property {Function} manual_refresh - Triggers manual refresh of variable names.
 * @property {Function} toggle - Toggles a boolean feature (like `direct_to_queue`).
 * @property {Function} toggle_queue_add_position - Toggles queue position between 'front' and 'back'.
 * @property {Function} generate_report - Triggers report generation.
 * @property {Function} generate_suggestion - Triggers suggestion generation.
 * @property {Function} submit_uids - Sends UIDs to the server for ingestion.
 * @property {Function} update_variable_value - Updates a server variable to a new value.
 * @property {Function} get_variable_value - Fetches the value of a server variable.
 * @property {Function} call_method - Calls a server method with arguments.
 * @property {Object} buttonStates - UI state for toggle buttons.
 * @property {string} reportStatus - 'idle' | 'loading' | 'error'.
 * @property {string} suggestionStatus - 'idle' | 'loading' | 'error'.
 */
export const ModelContext = createContext();

/**
 * ModelProvider wraps children with shared state and backend interaction functions. 
 * @param {Object} props - The component's props. 
 * @param {React.ReactNode} props.children - The components that will consume the context.
 * @returns 
 */
export function ModelProvider({ children }) {

    /**
     * List of available variable and method names
     * @type {string[]}
    */
    const [names, setNames] = useState([]);
    const [canRefresh, setCanRefresh] = useState(true);
    const timeoutRefresh = useRef(null);

    const { get_uids, setUidRefresh } = useContext(UidContext);

    const [loadingUidSubmission, setLoadingUidSubmission] = useState(false);
    const [uidSubmissionStatus, setUidSubmissionStatus] = useState(null); //"success", "error"

    /**
     * Initializes the state for a toggleable button based on its current backend value.
     * @async 
     * @function
     * @param {string} buttonId - The ID of the button/variable to fetch.
     * @returns {Promise<string|null>} The string value of the button (e.g., "true", "false", "UNKNOWN") or null if an error occurred.
     */
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

    /**
     * false: idle (gray)
     * true: on (green)
     * null: error (red)
     */
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


    // When generateReport is false, that means there was an issue with generating the report
    const [reportStatus, setReportStatus] = useState("idle");
    const [suggestionStatus, setSuggestionStatus] = useState("idle");

    const toggle = async (buttonId) => {
        const convert_to_bool = x => x === "true" || x === true;
        const current = convert_to_bool(buttonStates[buttonId]);
        const newState = !current;
        // Optimistic UI
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
        setUidRefresh(prev => !prev);

    }

    const toggle_queue_add_position = async (buttonId) => {
        const newState = buttonStates[buttonId] === "front" ? "back" : "front";
        // This is optimistic UI
        setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
        try {
            const response = await axios.get(`/api/variable/${buttonId}`);
            const responseStr = String(response.data[buttonId] ?? "UNKOWN");
            const newValue = newState;
            const payload = { "value": newValue };
            const newResponse = await axios.post(`/api/variable/${buttonId}`, payload);
            setButtonStates((prev) => ({ ...prev, [buttonId]: newValue }));
        }
        catch (error) {
            console.error("Failed to update queue add position toggle  ", error);
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));
        }
        setUidRefresh(prev => !prev);
    }
    const generate_report = async () => {
        try {
            setReportStatus("loading");
            const payload = { "value": [[], {}] };
            const response = await axios.post(`/api/variable/generate_report`, payload);
            setUidRefresh(prev => !prev);
            setReportStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate report ", error);
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
        setLoadingUidSubmission(true);
        setUidSubmissionStatus(null); // This resets status while loading 

        try {
            const processedContent = content.split(/[\n,]+/);
            const payload = { "value": [[processedContent], {}] };
            const response = await axios.post('/api/variable/ingest_uids', payload);

            if (response.status !== 200) {
                setUidSubmissionStatus("error");
                return "error";
            }

            const resData = response?.data;

            if (resData?.ingest_uids?.[0] === "accepted") {
                setUidRefresh(prev => !prev);
                setUidSubmissionStatus("success");
                return "success";
            }
            setUidSubmissionStatus("error");
            return resData?.result?.msg || "error";
        }
        catch (error) {
            const resData = error?.response?.data;
            const statusCode = error?.response?.status;
            if (statusCode === 500) {
                console.error("Server-side timeout or internal error");
                setUidSubmissionStatus("error");
                return "server timeout or failure";
            }

            // This is optimistic UI !!Need to check!!
            // This is for when the backend somehow responds with 200 OK but triggers catch. 
            // if (resData?.ingest_uids?.[0] === "accepted") {
            //     setUidRefresh(prev => !prev);
            //     setUidSubmissionStatus("success");
            //     return "success";
            // }
            console.error("Error submitting UIDs:", error);
            setUidSubmissionStatus("error");
            return "error";
        }
        finally {
            setLoadingUidSubmission(false);
        }
    }

    const get_variable_value = async (variable_name) => {
        try {
            const response = await axios.get(`/api/variable/${variable_name}`);
            return String(response?.data?.[variable_name] ?? "UNKNOWN"); // This is the parsed JSON response, and is the value of the variable.
        }
        catch (error) {
            return "ERROR";
        }
    }

    const update_variable_value = async (variable_name, new_value) => {
        try {
            let payload = { "value": new_value };
            const response = await axios.post(`/api/variable/${variable_name}`, payload);
            setUidRefresh(prev => !prev);

            return "success";
        }
        catch (error) {
            console.error("Error with updating variable", error);
            return "ERROR";
        }
    }

    const call_method = async (method_name, args, kwargs) => {
        try {
            const parsedArgs = args ? JSON.parse(args) : [];
            const parsedKwargs = kwargs ? JSON.parse(kwargs) : {};
            const payload = {
                value: [parsedArgs, parsedKwargs]
            };
            const response = await axios.post(`/api/variable/${method_name}`, payload);
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
            update_variable_value, get_variable_value, submit_uids, reportStatus, toggle, toggle_queue_add_position, buttonStates,
            generate_report, generate_suggestion, suggestionStatus,
            loadingUidSubmission, uidSubmissionStatus

        }}>
            {children}
        </ModelContext.Provider>
    );

}
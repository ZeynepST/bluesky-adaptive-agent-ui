import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { useRef } from "react";

export const ModelContext = createContext();

const agent_address=process.env.REACT_APP_AGENT_ADDRESS;
const agent_port=process.env.REACT_APP_AGENT_PORT;
export function ModelProvider({ children }) {

    //testing useEffect
    //variables refers to all of the variables 
    //setNames refer to both variable and method names 
    const [names, setNames] = useState([]);
    const [canRefresh, setCanRefresh] = useState(true);
    const timeoutRefresh = useRef(null);
    const [method, setMethods] = useState([]); //not sure if this is necessary


    const get_names = async () => {
        try {
            const response = await axios.get(`http://${agent_address}:${agent_port}/api/variables/names`);
            setNames(response.data.names || []);
        }
        catch(error){
            console.error("Failed to get names of variables and methods: ",error);
        }
    }

    const manual_refresh=()=>{
        if(!canRefresh){
            return;
        }
        get_names();
        setCanRefresh(false);

        timeoutRefresh.current=setTimeout(()=>{
            setCanRefresh(true);},600000);
        }
    

    useEffect(()=>{
        get_names();

        const interval=setInterval(get_names, 600000);
        return()=>{
            clearInterval(interval);
            clearTimeout(timeoutRefresh.current);
        }
    }, []);
  


    //when generateReport is false, that means there was an issue with generating the report
    const [reportStatus, setReportStatus] = useState("idle");
    const [suggestionStatus, setSuggestionStatus] = useState("idle");

    const [buttonStates, setButtonStates] = useState({
        queue_add_position: false,
        ask_on_tell: false,
        report_on_tell: false
    });

    const toggle = async (buttonId) => {
        console.log("the button id is ", buttonId);
        const current = buttonStates[buttonId];
        const newState = !current;
        setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
        //need to check 
        try {
            //const response=await axios.get(`http://${agent_address}:${agent_port}/api/variable/${buttonId}`);
        }
        catch (error) {
            console.error("Failed to update toggle ", error);
            //should display the error type 
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));

        }
    }

    const generate_report = async () => {
        try {
            setReportStatus("loading");
            const payload = { "value": [[], {}] }; //is this necessary
            //const response = await axios.get(`http://${agent_address}:${agent_port}/api/variable/generate_report`, { params: payload });
            await new Promise((x) => setTimeout(x, 2000)); //This is just to test that it works 
            setReportStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate report");
            setReportStatus("error");
        }
    }

    const generate_suggestion = async () => {
        try {
            setSuggestionStatus("loading");
            const payload = { "value": [[1], {}] };
            const response = await axios.get(`http://${agent_address}:${agent_port}/api/variable/add_suggestions_to_queue`, { params: payload });
            await new Promise((x) => setTimeout(x, 2000)); //This is just to test that it works 
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
            const payload = { "value": [[processedContent], {},] }; //need to check 
            //or does api expect {json:payload}
            //const response=await axios.post(`http://${agent_address}:${agent_port}/api/variable/tell_agent_by_uid`, payload);
            return "success";
        }
        catch (error) {
            console.error("Error with submitting UID ", error);
            return "The following error was received: ";
        }
    }

    const get_variable = async (variable_name) => {
        try {
            const response = await axios.get(`http://${agent_address}:${agent_port}/api/variable/`, { params: variable_name });
            return String(response?.data?.[variable_name] ?? "UNKNOWN"); //this is the parsed JSON response, and is the value of the variable 
        }
        catch (error) {
            console.error("Error with getting variable ", error);
            return "UNKNOWN";
        }
    }

    //does this have to return anything to the user? Can the update be reflected in the list instead?
    const update_variable = async (variable_name, new_value) => {
        console.log("inside of update variable");
        try {
            const payload = { "value": new_value }; //need to check
            //const response = await axios.post(`http://${agent_address}:${agent_port}/api/variable/${variable_name}`, payload);
            return "success";
        }
        catch (error) {
            console.error("Error with updating variable", error);
            return "UNKNOWN";
        }
        // if this variable is updated, available variables and methods should be updated as well. I need to set up an useEffect()
    }



    const call_method = async (method_name, args, kwargs) => {
        try {
            //do I need to perform JSON parse? If I do the comamnd below, I get an error because js expects JSON.parse to be a string 
            const parsedArgs = args ? JSON.parse(args) : [];
            console.log("the second type is ", typeof (args));
            //const parsedArgs = args ? args : [];
            const parsedKwargs = kwargs ? JSON.parse(kwargs) : {};
            // const parsedKwargs = kwargs ? kwargs : {};
            const payload = {
                value: [parsedArgs, parsedKwargs]
            };
            //const response = await axios.post(`http://${agent_address}:${agent_port}/api/variable/${method_name}`, payload);
            return "success";
        }
        catch (error) {
            console.error("Error with calling the method ", error);
            return "Failure";
        }
    }


    return (
        <ModelContext.Provider value={{ manual_refresh,names,canRefresh,get_names, call_method, update_variable, get_variable, submit_uids, reportStatus, toggle, buttonStates, generate_report, generate_suggestion, suggestionStatus }}>
            {children}
        </ModelContext.Provider>
    );

}
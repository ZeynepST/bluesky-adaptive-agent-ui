import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { createContext } from "react";
import { buildQueries } from "@testing-library/dom";

export const ModelContext = createContext();

export function ModelProvider({ children }) {

    //when generateReport is false, that means there was an issue with generating the report
    const [reportStatus, setReportStatus] = useState("idle");
    const [suggestionStatus, setSuggestionStatus] = useState("idle");

    const [buttonStates, setButtonStates] = useState({
        button1: false,
        button2: false,
        button3: false
    });

    const toggle = async (buttonId) => {
        const current = buttonStates[buttonId];
        const newState = !current;
        setButtonStates((prev) => ({ ...prev, [buttonId]: newState }));
        //need to check 
        try {
            //const response=await axios.get('http://{agent_address}:{agent_port}/api/variable/{variable_name}');
        }
        catch (error) {
            console.error("Failed to update toggle");
            //should display the error type 
            setButtonStates((prev) => ({ ...prev, [buttonId]: null }));

        }
    }

    const generateReport = async () => {
        try {
            setReportStatus("loading");
            //const response=await axios.get('http://{agent_address}:{agent_port}/api/variable/{variable_name}');
            await new Promise((x) => setTimeout(x, 2000)); //This is just to test that it works 
            setReportStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate report");
            setReportStatus("error");
        }
    }

    const generateSuggestion = async () => {
        try {
            setSuggestionStatus("loading");
            //const response=await axios.get('http://{agent_address}:{agent_port}/api/variable/{variable_name}');
            await new Promise((x) => setTimeout(x, 2000)); //This is just to test that it works 
            setSuggestionStatus("idle");
        }
        catch (error) {
            console.error("Failed to generate suggestion");
            setSuggestionStatus("error");
        }
    }

    const tellAgent=async(content)=>{
        const processedContent=content.split(/[\n,]+/);
        console.log("the processed text is ",processedContent);
        try{
            //const response=await axios.post('http://{agent_address}:{agent_port}/api/variable/{variable_name}', processedContent);
        }
        catch(error){
            console.error("Error with submitting UID");
        }
    }
    return (
        <ModelContext.Provider value={{tellAgent,reportStatus, toggle, buttonStates, generateReport, generateSuggestion, suggestionStatus }}>
            {children}
        </ModelContext.Provider>
    );

}
import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import '../stylesheets/DebuggingPage.css';
import '../stylesheets/index.css';
import '../stylesheets/NamesTable.css';

const DebuggingPage = () => {

    const navigate = useNavigate();
    //"Enter list of arguments, e.g., ['det1', 10, 'det2', 15]"
    const description1 = 'Enter list of arguments, e.g., ["det1", 10, "det2", 15]'
    const description2 = 'Enter dictionary of keyword arguments using double-quotes (\"), e.g., \n {"det":"det1","pos":15}';
    const { call_method, get_variable, update_variable } = useContext(ModelContext);

    const { names, canRefresh, manual_refresh } = useContext(ModelContext);
    //varName2 refers to the variable name entered by user for "Get Variable"
    const [varName1, setVarName1] = useState("");
    //varName2 refers to variable name to be updated 
    const [varName2, setVarName2] = useState("");
    // fetchedVarName refers to the variable fetched by the backend
    const [fetchedVarName, setFetchedVarName] = useState("");
    //newValue refers to the new value the user inputs. this is not the response from backend 
    const [newValue, setNewValue] = useState("");

    const [methodName, setMethodName] = useState("");
    const [argsValue, setArgs] = useState("");
    const [kwargsValue, setKwargs] = useState("");

    const [callMethodErrors, setCallMethodErrors] = useState({ mName: "", args: "", kwargs: "", response: "" });

    const [updateVarErrors, setUpdateVarErrors] = useState({ response: "", name: "", value: "" });
    // need to check if I can use setVarName/varName for both getting variable and updating variable
    //this is get_variable
    const requestVariable = async () => {
        const value = await get_variable(varName1);
        console.log("the value is ", value);
        if (value !== "UNKNOWN") {
            setFetchedVarName(value);
        }
        else {
            setFetchedVarName("UNKNOWN");
        }
        setVarName1(""); //need to check
    };

    const submitUpdatedVariable = async () => {
        let errors = { response: "", name: "", value: "" };
        if (!varName2.trim()) {
            errors.name = "Must Enter a Value";
        }
        if (!newValue.trim()) {
            errors.value = "Must Enter a Value";
        }
        if (errors.name || errors.value) {
            setUpdateVarErrors(errors);
            return;
        }
        const reply = await update_variable(varName2, newValue);
        if (reply !== "success") {
            errors.response = reply;
            setUpdateVarErrors(errors);
            return;
        }
        setVarName2("");
        setNewValue("");
        setUpdateVarErrors({ response: "", name: "", value: "" });
    }

    const submitMethodCall = async () => {
        console.log("inside of submit method call");

        let errors = { mName: "", args: "", kwargs: "", response: "" };
        if (!methodName.trim()) {
            errors.mName = "Must Enter a Value";
        }
        if (!argsValue.trim()) {
            errors.args = "Must Enter a Value";
        }
        if (!kwargsValue.trim()) {
            errors.kwargs = "Must Enter a Value";
        }

        console.log("args values is ", argsValue);
        try {
            if (!Array.isArray(JSON.parse(argsValue))) {
                throw new Error("Input must be a list of arguments");
            }
        }
        catch (error) {
            errors.args = "Input must be a list of arguments";
        }
        try {
            if (JSON.parse(kwargsValue).constructor !== Object) {
                throw new Error("Input must be a dictionary.");
            }
        }
        catch (error) {
            errors.kwargs = "Input must be a dictionary.";
        }

        if (errors.mName || errors.args || errors.kwargs) {
            setCallMethodErrors(errors);
            return;
        }

        console.log("here are the following inputs ", methodName, argsValue, kwargsValue);


        const reply = await call_method(methodName, argsValue, kwargsValue);
        console.log("the reply is ", reply);
        if (reply !== "success") {
            errors.response = reply;
            setCallMethodErrors(errors);
            return;
        };

        setMethodName("");
        setArgs("");
        setKwargs("");
        setCallMethodErrors({ mName: "", args: "", kwargs: "", response: "" });
    }

    return (
        <div className="mv-container">
            <div className="left">
                <div className="variable-dashboard-container">
                    <h1 id="var-dashboard">Variable Dashboard</h1>
                    {/* v-row1 refers to where the get variable button is  */}
                    <div className="v-row1">
                        <div className="var-name-output-container">
                            <textarea id="enter-var" placeholder="Enter Variable Name" value={varName1} onChange={(e) => setVarName1(e.target.value)}> </textarea>
                            <button className="submit-var-btn" onClick={requestVariable}>Get Value</button>
                            <div className="var-name-output">{fetchedVarName}</div>
                        </div>
                    </div>

                    {/*v-row2 refers to the area where update variable is*/}
                    <div className="v-row2">
                        <div className="v-row2-text-areas">
                            {/* <label className="enter-var-title" htmlFor="enter-var">Enter Variable Name</label> */}
                            <textarea id="enter-var" placeholder="Enter Variable Name" value={varName2} onChange={(e) => setVarName2(e.target.value)}></textarea>
                            {updateVarErrors.name && <p className="error-text">{updateVarErrors.name}</p>}
                            <textarea id="enter-value" placeholder="Enter New Value" value={newValue} onChange={(e) => setNewValue(e.target.value)}></textarea>
                            {updateVarErrors.value && <p className="error-text">{updateVarErrors.value}</p>}
                        </div>
                        <div>
                            {updateVarErrors.response && <p className="error-text">{updateVarErrors.response}</p>}
                            <button className="submit-var-btn" onClick={submitUpdatedVariable}>Update Variable</button>
                        </div>
                    </div>
                </div>

                <div className="method-dashboard-container">
                    <h1 id="var-dashboard">Method Dashboard</h1>
                    <div className="v-row2-text-areas">
                        {/* <label className="enter-var-title" htmlFor="enter-var">Enter Method Name</label> */}
                        <textarea id="enter-var" placeholder="Enter Method Name" value={methodName} onChange={(e) => setMethodName(e.target.value)} > </textarea>
                        {callMethodErrors.mName && <p className="error-text">{callMethodErrors.mName}</p>}

                    </div>
                    <div className="method-list-container">
                        <label className="enter-var-title" htmlFor="enter-var">{description1}</label>
                        <textarea id="enter-description" value={argsValue} onChange={(e) => setArgs(e.target.value)} ></textarea>
                        {callMethodErrors.args && <p className="error-text">{callMethodErrors.args}</p>}
                    </div>
                    <div className="method-list-container">
                        <label className="enter-var-title" htmlFor="enter-var">{description2}</label>
                        <textarea id="enter-description" value={kwargsValue} onChange={(e) => setKwargs(e.target.value)}>  </textarea>
                        {callMethodErrors.kwargs && <p className="error-text">{callMethodErrors.kwargs}</p>}
                    </div>
                    <div>
                        {callMethodErrors.response && <p className="error-text">{callMethodErrors.response}</p>}
                        <button className="submit-var-btn" onClick={submitMethodCall}>Call Method</button>
                    </div>
                </div>
            </div>

            {/* end of left side */}
            <div className="right">
                <div className="available-dashboard-container">
                    <h1 id="var-dashboard">Available Variables and Methods</h1>

                    {/* now the table */}
                    <div className="names-table-container">
                        <table className="names-table-style">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {names.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x}</td>
                                    </tr>
                                )
                                )}
                            </tbody>

                        </table>
                    </div>

                    <button className="refresh-btn" onClick={manual_refresh}
                        disabled={!canRefresh}
                        style={{
                            backgroundColor: canRefresh ? ' rgb(45, 174, 38)' : 'lightgray',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '5px',
                        }}

                    >Refresh Available
                    </button>
                </div>
            </div>
            <div className="switch-btn-container">
                <button className="switchboard-btn" onClick={() => navigate("/")}>Switchboard</button>
            </div>

        </div>
    );
}

export default DebuggingPage;

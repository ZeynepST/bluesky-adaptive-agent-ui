import { useState, useContext, useCallback, useEffect } from 'react';
import { ModelContext } from "../view-model/ModelContext";

// Stylesheets: 
import '../stylesheets/DebuggingPage.css';
import '../stylesheets/index.css';
import '../stylesheets/NamesTable.css';

/**
 * Debugging Page component provides a UI for:
 * - A table of available variable and method names
 *      - A search bar and sorting buttons 
 *      - A refresh button so user can update table every 10 minutes 
 * - Getting values of available variables
 * - Updating value of available variables
 * - Submitting method calls
 * 
 * @component
 */

const DebuggingPage = () => {

    /**
     * Description string shown to users for how to format argument lists.
     * Example input: '["det1", 10, "det2", 15]'
     * @constant {string}
    */
    const description1 = 'Enter list of arguments, e.g., ["det1", 10, "det2", 15]'

    /**
     * Description string shown to users for how to format keyword arguments.
     * Example input: '{"det":"det1","pos":15}'
     * Uses double quotes to ensure JSON validity.
     * @constant {string}
    */
    const description2 = 'Enter dictionary of keyword arguments using double-quotes (\"), e.g., \n {"det":"det1","pos":15}';

    /**
     * Extracted functions and variables from ModelContext.
     */
    const { call_method, get_variable_value, update_variable_value, names, canRefresh, manual_refresh } = useContext(ModelContext);

    /**
     * Stores list of variable and method names from `names`, which is exported from ModelContext 
     * - Used for display, filtering, and search purposes 
     */
    const [listNames, setListNames] = useState([]);

    const filterOptions = ['Default', 'Ascending', 'Descending']; // The filter options for the table 

    /**
     * Currently selected filter option for sorting/display.
     * @state {string}
     */
    const [selectedFilter, setSelectedFilter] = useState('Default');

    // varValue1 refers to the variable name entered by user for "Get Variable".
    const [varName1, setVarName1] = useState("");

    // fetchedVarName refers to the variable value fetched by the backend. Set by `get_variable_value`.
    const [fetchedVarValue, setFetchedVarValue] = useState("");

    // varName2 refers to variable name to be updated.
    const [varName2, setVarName2] = useState("");

    /**
     * New value entered by the user to update a variable.
     * Not to be confused with the value returned by the backend.
     * @state {string}
    */
    const [newValue, setNewValue] = useState("");

    // methodName entered by the user to call
    const [methodName, setMethodName] = useState("");

    /**
     * Positional arguments (args) entered as a stringified array.
     * Example: '["a", 5]'
     * @state {string}
    */
    const [argsValue, setArgs] = useState("");

    /**
     * Keyword arguments (kwargs) entered as a stringified object.
     * Example: '{"param":"value"}'
     * @state {string}
    */
    const [kwargsValue, setKwargs] = useState("");

    /**
     * Errors encountered during `call_method` validation or execution.
     * Fields:
     * - `mName`: Method name error
     * - `args`: Positional args error
     * - `kwargs`: Keyword args error
     * - `response`: Backend response error
     * @state {{ mName: string, args: string, kwargs: string, response: string }}
    */
    const [callMethodErrors, setCallMethodErrors] = useState({ mName: "", args: "", kwargs: "", response: "" });

    /**
      * Errors related to variable updates.
      * Fields:
      * - `name`: Variable name error
      * - `value`: New value error
      * - `response`: Backend update error
     * @state {{ name: string, value: string, response: string }}
    */
    const [updateVarErrors, setUpdateVarErrors] = useState({ response: "", name: "", value: "" });

    /**
     * User input for variable/method name to search for
     * @state {string}
     */
    const [searchText, setSearchText] = useState('');

    /**
     * useEffect to sync `listNames` with the latest value of `names` from context.
    */
    useEffect(() => {
        setListNames(names);
    }, [names]);

    /**
    * Requests the value of a variable using `get_variable_value` and updates the UI state.
    *
    * Calls the asynchronous `get_variable_value` function with the input `varName1`.
    * Sets the result to `fetchedVarValue`. If the result is not found, displays `"UNKNOWN"`.
    * Clears the input field (`varName1`) afterward.
    *
    * @async
    * @function requestVariable
    * @returns {Promise<void>} Resolves after the variable is fetched and UI state is updated.
    */
    const requestVariable = async () => {
        const value = await get_variable_value(varName1);
        if (value !== "UNKNOWN") {
            setFetchedVarValue(value);
        }
        else {
            setFetchedVarValue("UNKNOWN");
        }
        setVarName1("");
    };

    /**
     * Requests updating the value of a variable using `update_variable_variable` and updates the UI state.
     * - Validates `varName2` and `newValue`
     * - Calls the asynchronous `update_variable_variable` function with the inputs `varName2` and `newValue`.
     * - Handles errors and sets approprite error message for the UI.
     * - Clears the input fields `varName2` and `newValue` afterward.
     *
     * @async
     * @function requestVariable
     * @returns {Promise<void>} Resolves after the variable is fetched and UI state is updated.
    */
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
        const reply = await update_variable_value(varName2, newValue);
        if (reply !== "success") {
            errors.response = reply;
            setUpdateVarErrors(errors);
            return;
        }
        setVarName2("");
        setNewValue("");
        setUpdateVarErrors({ response: "", name: "", value: "" });
    }

    /**
     * Submits a method call with specified arguments and keyword arguments.
     * - Validates `methodName`, `argsValue`, and `kwargsValue` inputs.
     * - If inputs are valid, sends data using `call_method` ModelContext function.
     * - Handles errors and sets approprite error message for the UI.
     * - Clears input fields on success. 
     * 
     * @async 
     * @function submitMethodCall
     * @returns {Promise<void>}
     */
    const submitMethodCall = async () => {
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

        const reply = await call_method(methodName, argsValue, kwargsValue);
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

    const handleSearchInput = (event) => {
        setSearchText(event.target.value);
    }

    const handleSearch = (event) => {
        if (event.key === "Enter" && searchText.trim()) {
            event.preventDefault();
            setSearchText('');
            const filteredSearchNames = listNames.filter(name => name.toLowerCase().includes(searchText.toLowerCase()));
            setListNames(filteredSearchNames);
        }
    }

    const getFilteredNames = useCallback((filterName) => {
        setSelectedFilter(filterName);
        if (filterName === 'Ascending') {
            setListNames([...names].sort((a, b) => a.localeCompare(b)));
        }
        else if (filterName === 'Descending') {
            setListNames([...names].sort((a, b) => b.localeCompare(a)));
        }
        else {
            setListNames(names);
        }
    }, [names]);

    return (
        <div className="debugging-page-wrapper">
            <div className="debugging-page-container">
                <div className="left">
                    <div className="variable-dashboard-container">
                        <h1 id="var-dashboard">Variable Dashboard</h1>
                        {/* v-row1 refers to where the get variable button is  */}
                        <div className="v-row1">
                            <div className="var-name-output-container">
                                <textarea id="enter-var" placeholder="Enter Variable Name" value={varName1} onChange={(e) => setVarName1(e.target.value)}> </textarea>
                                <button className="submit-var-btn" onClick={requestVariable}>Get Value</button>
                                <div className="var-name-output">{fetchedVarValue}</div>
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

                {/* start of right side */}
                <div className="right">
                    <div className="available-dashboard-container">
                        <h1 id="var-dashboard">Available Variables and Methods</h1>
                        {/* // className={selectedFilter ===filter ? 'active' : ''} */}
                        <div className="filter-overlay">
                            <div className="filter-btns-container">
                                {filterOptions.map(filter => (
                                    <button key={filter} onClick={() => getFilteredNames(filter)}
                                        className={`filter-btns ${selectedFilter === filter ? 'active' : ''}`}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <input type="text"
                                className="search-bar"
                                placeholder="Search..."
                                value={searchText}
                                onChange={handleSearchInput}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        <div className="names-table-container">
                            {/* now the table */}
                            <table className="names-table-style">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listNames.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x}</td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* end of table */}

                        <button className="refresh-btn" onClick={manual_refresh}
                            disabled={!canRefresh}
                            style={{
                                backgroundColor: canRefresh ? ' rgb(45, 174, 38)' : 'lightgray',
                            }}>
                            Refresh Available
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DebuggingPage;

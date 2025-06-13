import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import '../stylesheets/SwitchBoardPage.css';
import '../stylesheets/index.css';

const AgentSwitchBoardPage = () => {

    const navigate = useNavigate();

    const description = "Enter list of UIDs to tell the agent about. \n This can be in a comma separated list, or with one UID per line."

    const { submit_uids, tellAgent, buttonStates, toggle, generate_report, reportStatus, generate_suggestion, suggestionStatus } = useContext(ModelContext);

    const buttons = [
        { id: "direct_to_queue", label: "Add to Front" },
        { id: "suggest_on_ingest", label: "Continuous Suggesting" },
        { id: "report_on_ingest", label: "Continuous Reporting" }
    ];

    const [uidContent, setUIDContent] = useState('');
    const [uidErrors, setUIDErrors] = useState('');


    const submitUIDButton = async () => {
        let errors = { test: "" };

        if (!uidContent.trim()) {
            errors.test = "Must enter list before submitting";
        }

        if (errors.test) {
            setUIDErrors(errors);
            return;
        }
        const reply = await submit_uids(uidContent);
        if (reply !== "success") {
            errors.test = "Failure";
        }
        if (errors.test) {
            setUIDErrors(errors);
            return;
        }

        setUIDContent("");
        setUIDErrors({ test: "" });
    }


    console.log("this should be true ", buttonStates.suggest_on_ingest);
    console.log("this should be false ", buttonStates.report_on_ingest);
    console.log(typeof (buttonStates.suggest_on_ingest));

    return (
        <div className='agent-switchboard-container'>
            <h1>Agent Switchboard</h1>

            <div className="toggle-btns-container">

                <div className="label-btn-container">

                    <label htmlFor={"direct_to_queue"}>Add to Front</label>
                    <button className={`top-btns ${buttonStates.direct_to_queue !== null ? ((buttonStates.direct_to_queue === 'true' || buttonStates.direct_to_queue === true) ? 'on' : 'off') : 'error'}`} key={"direct_to_queue"} onClick={() => toggle("direct_to_queue")}>
                        {
                            buttonStates.direct_to_queue !== null ? ((buttonStates.direct_to_queue === 'true' || buttonStates.direct_to_queue === true) ? "ON" : "OFF") : "ERROR"
                        }
                    </button>
                </div>
                <div className="label-btn-container">
                    <label htmlFor={"suggest_on_ingest"}>Continuous Suggesting</label>
                    <button className={`top-btns ${buttonStates.suggest_on_ingest !== null ? ((buttonStates.suggest_on_ingest === true || buttonStates.suggest_on_ingest === 'true') ? 'on' : 'off') : 'error'}`} key={"suggest_on_ingest"} onClick={() => toggle("suggest_on_ingest")}>
                        {
                            buttonStates.suggest_on_ingest !== null ? ((buttonStates.suggest_on_ingest === true || buttonStates.suggest_on_ingest === 'true') ? "ON" : "OFF") : "ERROR"
                        }
                    </button>
                </div>
                <div className="label-btn-container">
                    <label htmlFor={"report_on_ingest"}>Continuous Reporting</label>
                    <button className={`top-btns ${buttonStates.report_on_ingest !== null ? (buttonStates.report_on_ingest === true || buttonStates.report_on_ingest === 'true' ? 'on' : 'off') : 'error'}`} key={"report_on_ingest"} onClick={() => toggle("report_on_ingest")}>
                        {
                            buttonStates.report_on_ingest !== null ? ((buttonStates.report_on_ingest === true || buttonStates.report_on_ingest === 'true') ? "ON" : "OFF") : "ERROR"
                        }
                    </button>
                </div>

            </div>

            <div className='generate-btns-container'>

                <button className={`suggestion-btn ${suggestionStatus === 'loading' ? "loading" : suggestionStatus === "error" ? "error" : "idle"}`} onClick={() => generate_suggestion()}>
                    {suggestionStatus === 'error' ? 'ERROR' : 'Generate Suggestion'}
                </button>

                <button className={`report-btn ${reportStatus === 'loading' ? "loading" : reportStatus === "error" ? "error" : "idle"}`} onClick={() => generate_report()}>
                    {reportStatus === 'error' ? 'ERROR' : 'Generate Report'}
                </button>
            </div>
            <div className="tell-agent-container">
                <label className="uid-text-area-title" htmlFor="tell-uid">Tell Agent by UID</label>
                <label className="uid-text-area-description" htmlFor="tell-uid">
                    {description}
                </label>
                <textarea id="tell-uid" value={uidContent} onChange={(e) => setUIDContent(e.target.value)} />
                {/* {uidErrors.uidContent && <p className="error-text">{uidErrors.uidContent}</p>} */}
                {uidErrors.test && <p className="error-text">{uidErrors.test}</p>}
                <button className="submit-uid-btn" onClick={submitUIDButton}>Submit</button>
            </div>

            <div className="nav-btn-container">
                <button className="nav-mv-btn" onClick={() => navigate("/DebuggingPage")}>Methods/Variables</button>
            </div>
        </div>
    );
};
export default AgentSwitchBoardPage
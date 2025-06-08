import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import '../stylesheets/SwitchBoardPage.css';
import '../stylesheets/index.css';
//should this be ModelContext?

const AgentSwitchBoardPage = () => {

    const navigate = useNavigate();

    const description = "Enter list of UIDs to tell the agent about. \n This can be in a comma separated list, or with one UID per line."

    const { submit_uids, tellAgent, buttonStates, toggle, generate_report, reportStatus, generate_suggestion, suggestionStatus } = useContext(ModelContext);
    //in the return, make it so that these buttons have the same class for easy css application
    const buttons = [
        { id: "queue_add_position", label: "Add to Front" },
        { id: "ask_on_tell", label: "Continuous Suggesting" },
        { id: "report_on_tell", label: "Continuous Reporting" }

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
        // tellAgent(uidContent);
        const reply = await submit_uids(uidContent);
        console.log("the reply is ", reply);
        if (reply !== "success") {
            console.log("shouldnt be here");
            errors.test = "Failure";
        }
        if (errors.test) {
            setUIDErrors(errors);
            return;
        }

        setUIDContent("");
        setUIDErrors({ test: "" });
    }

    //on click, I would change the color so buttonStates[id]? "green": "black"
    return (
        <div className='agent-switchboard-container'>
            <h1>Agent Switchboard</h1>
            <div className="toggle-btns-container">
                {buttons.map(({ id, label }) => (
                    <div className="label-btn-container">
                        <label htmlFor={id}>{label}</label>
                        <button className={`top-btns ${buttonStates[id] != null ? (buttonStates[id] ? 'on' : 'off') : 'error'}`} key={id} onClick={() => toggle(id)}>
                            {
                                buttonStates[id] != null ? (buttonStates[id] ? "ON" : "OFF") : "ERROR"
                            }
                        </button>
                    </div>
                ))}
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
//value={uid
export default AgentSwitchBoardPage
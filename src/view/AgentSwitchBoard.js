import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
//should this be ModelContext?

const HomePage = () => {

    const description = "Enter list of UIDs to tell the agent about. \n This can be in a comma separated list, or with one UID per line."

    const {tellAgent, buttonStates, toggle, generateReport, reportStatus, generateSuggestion, suggestionStatus } = useContext(ModelContext);
    //in the return, make it so that these buttons have the same class for easy css application
    const buttons = [
        { id: "button1", label: "Add to Front" },
        { id: "button2", label: "Continuous Suggesting" },
        { id: "button3", label: "Continuous Reporting" }

    ];

    const [uidContent, setUIDContent] = useState('');
    const [uidError, setUIDErrors]=useState('');

    const submitUIDButton=()=>{
        let errors={uidContent:""};

        if(!uidContent.trim()){
            errors.uidContent="Must enter list before submitting";
        }

        if(errors.uidContent){
            setUIDErrors(errors);
            return;
        }
        tellAgent(uidContent);
        setUIDContent("");
        setUIDErrors({uidContent:""});
    }


    //on click, I would change the color so buttonStates[id]? "green": "black"
    return (
        <div className='agent-switchboard-container'>
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

                <button className={`suggestion-btn ${suggestionStatus === 'loading' ? "loading" : suggestionStatus === "error" ? "error" : "idle"}`} onClick={() => generateSuggestion()}>
                    {suggestionStatus === 'error' ? 'ERROR' : 'Generate Suggestion'}
                </button>

                <button className={`report-btn ${reportStatus === 'loading' ? "loading" : reportStatus === "error" ? "error" : "idle"}`} onClick={() => generateReport()}>
                    {reportStatus === 'error' ? 'ERROR' : 'Generate Report'}
                </button>


            </div>
            <div className="tell-agent-container">
                <label className="uid-text-area-title" htmlFor="tell-uid">Tell Agent by UID</label>
                <label className="uid-text-area-description" htmlFor="tell-uid">
                    {description}
                </label>
                <textarea id="tell-uid" value={uidContent} onChange={(e)=>setUIDContent(e.target.value)}/>
                <button className="submit-uid-btn" onClick={submitUIDButton}>Submit</button>

            </div>
        </div>
    );
};
//value={uid
export default HomePage;
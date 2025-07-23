import React, { useState, useEffect, useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { ModelContext } from "../view-model/ModelContext";
import { IngestViewModel } from '../view-model/IngestViewModel';

// Stylesheets:
import '../stylesheets/index.css';
import '../stylesheets/SwitchBoardPage.css';

/**
 * AgentSwitchBoardPage component provides a UI for:
 * - Toggling features (e.g., direct to queue, continuous suggestion/report)
 * - Submitting UIDs
 * - Generating suggestions and reports
 * 
 * @component
 */
const AgentSwitchBoardPage = () => {

    const description = "Enter list of UIDs to tell the agent about. \n This can be in a comma separated list, or with one UID per line."

    const [uidContent, setUIDContent] = useState('');
    const [uidErrors, setUIDErrors] = useState('');

    const { uidsInfo, uidRefresh } = useContext(UidContext);
    const { submit_uids, buttonStates, toggle, toggle_queue_add_position,
        generate_report, reportStatus, generate_suggestion, suggestionStatus,
        loadingUidSubmission
    } = useContext(ModelContext);



    const [refreshKey, setRefreshKey] = useState(0);
    const [cacheLen, setCacheLen] = useState(0);

    const [showReportErrorMessage, setShowReportErrorMessage] = React.useState(false);
    const [blinkingActive, setBlinkingActive] = useState(false);

    const currentUid = uidsInfo.at(0);
    const numberOfClusters = currentUid?.numberOfClusters ?? 0;
    const ingestData = IngestViewModel(currentUid?.hasIngest ? currentUid.uidValue : null, refreshKey);

    useEffect(() => {
        setCacheLen(ingestData?.cache_len ?? 0);
    }, [ingestData?.cache_len]);

    useEffect(() => {
        if (cacheLen >= numberOfClusters) {
            setShowReportErrorMessage(false);
            setBlinkingActive(false);
        }
    }, [cacheLen, numberOfClusters]);


    /**
     * submitUIDButton validates and sends UID input to the backend.
     * Displays validation or submission error if any.
     * @async
     * @function
     * @returns {Promise<void>}
     */
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
            errors.test = reply;
            setUIDErrors(errors);
            return;
        }
        setUIDContent("");
        setUIDErrors({ test: "" });

        setRefreshKey(prev => prev + 1);

    }

    const onReportClick = () => {
        if (cacheLen < numberOfClusters) {
            setShowReportErrorMessage(true); // trigger message display
            setBlinkingActive(true);

            // Stop blinking after 30 seconds
            setTimeout(() => {
                setBlinkingActive(false);
            }, 30000);

        } else {
            setShowReportErrorMessage(false); // clear message if previously shown
            setBlinkingActive(false);
            generate_report();
        }
    };

    return (
        <div className="agent-switchboard-wrapper">
            <div className='agent-switchboard-container'>
                <h1 id='agent-switchboard-title'>Agent Switchboard</h1>
                <div className="top3-btns-container">
                    <div id="direct-to-queue-container" className="toggle-btn-container">
                        <label htmlFor={"direct_to_queue"}>Add to Front</label>
                        <button className={`top-btns ${buttonStates.direct_to_queue !== null ? ((buttonStates.direct_to_queue === 'true' || buttonStates.direct_to_queue === true) ? 'on' : 'off') : 'error'}`} key={"direct_to_queue"} onClick={() => toggle("direct_to_queue")}>
                            {
                                buttonStates.direct_to_queue !== null ? ((buttonStates.direct_to_queue === true || buttonStates.direct_to_queue === 'true') ? "ON" : "OFF") : "ERROR"
                            }
                        </button>
                    </div>
                    <div id="suggest-on-ingest-btn-container" className="toggle-btn-container">
                        <label htmlFor={"suggest_on_ingest"}>Continuous Suggesting</label>
                        <button id="suggest-on-ingest-btn" className={`top-btns ${buttonStates.suggest_on_ingest !== null ? ((buttonStates.suggest_on_ingest === true || buttonStates.suggest_on_ingest === 'true') ? 'on' : 'off') : 'error'}`} key={"suggest_on_ingest"} onClick={() => toggle("suggest_on_ingest")}>
                            {
                                buttonStates.suggest_on_ingest !== null ? ((buttonStates.suggest_on_ingest === true || buttonStates.suggest_on_ingest === 'true') ? "ON" : "OFF") : "ERROR"
                            }
                        </button>
                    </div>
                    <div id="report-on-ingest-btn-container" className="toggle-btn-container">
                        <label htmlFor={"report_on_ingest"}>Continuous Reporting</label>
                        <button className={`top-btns ${buttonStates.report_on_ingest !== null ? (buttonStates.report_on_ingest === true || buttonStates.report_on_ingest === 'true' ? 'on' : 'off') : 'error'}`} key={"report_on_ingest"} onClick={() => toggle("report_on_ingest")}>
                            {
                                buttonStates.report_on_ingest !== null ? ((buttonStates.report_on_ingest === true || buttonStates.report_on_ingest === 'true') ? "ON" : "OFF") : "ERROR"
                            }
                        </button>
                    </div>
                </div>
                <div className="queue-add-position-container">
                    <div className="toggle-btn-container">
                        <label htmlFor={"queue_add_position"}>Queue Add Position</label>
                        <button id="queue-add-position-btn" className={`top-btns ${buttonStates.queue_add_position !== null ? (buttonStates.queue_add_position === "front" ? 'on' : 'off') : 'error'}`} key={"queue_add_position"} onClick={() => toggle_queue_add_position("queue_add_position")}>
                            {
                                buttonStates.queue_add_position !== null ? ((buttonStates.queue_add_position === "front") ? "FRONT" : "BACK") : "ERROR"
                            }
                        </button>
                    </div>
                </div>
                <div className='generate-btns-container'>
                    <div className="suggest-btn-container">
                        <button className={`suggestion-btn ${suggestionStatus === 'loading' ? "loading" : suggestionStatus === "error" ? "error" : "idle"}`} onClick={() => generate_suggestion()}>
                            {suggestionStatus === 'error' ? 'ERROR' : 'Generate Suggestion'}
                        </button>
                    </div>
                    <div className="report-btn-container">
                        <button
                            className={`report-btn ${reportStatus === 'loading' ? "loading" : "idle"}`}
                            onClick={onReportClick}
                            disabled={reportStatus === 'loading'}
                        >
                            {reportStatus === 'loading' ?
                                (
                                    <span className="spinner" aria-label="Loading..." />
                                )
                                :
                                "Generate Report"}
                        </button>

                        {showReportErrorMessage && (
                            <div className="report-error-icon-container">
                                <div className={`blinking-icon ${blinkingActive ? 'blinking' : ''}`}>!</div>
                                <div className="tooltip">
                                    Submit at least {numberOfClusters} UIDs to enable report generation.<br />
                                    You currently have {cacheLen} UIDs ingested.
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <div className="tell-agent-container">
                    <label className="uid-text-area-title" htmlFor="tell-uid">Specify UIDs to Inform Agent</label>
                    <label className="uid-text-area-description" htmlFor="tell-uid">
                        {description}
                    </label>
                    <textarea className="tell-uid" value={uidContent} onChange={(e) => setUIDContent(e.target.value)} />
                    {uidErrors.test && <p className="error-text">{uidErrors.test}</p>}
                    {/* <button className="submit-uid-btn" onClick={submitUIDButton}>Submit</button> */}
                    <button
                        className="submit-uid-btn"
                        onClick={submitUIDButton}
                        disabled={loadingUidSubmission}
                    >
                        {loadingUidSubmission ? (
                            <span className="spinner" aria-label="Loading..." />
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AgentSwitchBoardPage
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * UidBanner component displays specific UID information such as agent name and model type. If the UID object has ingest and/or report
 * then it will render buttons which will then render specific pages with data on either one. 
 */

const UidBanner = () => {

    const { uidsInfo, chosenUidObject, setViewMode, viewMode } = useContext(UidContext);

    return (

        <aside className="uid-banner-container">

            <h1 className="side-bar-title">Dashboard</h1>
            <hr className="side-bar-delimiter" />

            {/* Below will be a list of the specific UID information*/}
            <ul>
                {/* uid refers to the different UID objects within uidsInfo */}
                {uidsInfo.map((uid) => (
                    <>
                        {uid.uidValue === chosenUidObject?.uidValue && (
                            <React.Fragment key={uid.uidValue}>
                                <li key={uid.uidValue}>
                                    <div><span className="uid-banner-labels"> Time Stamp: </span>{uid.datetime}</div>
                                    <div><span className="uid-banner-labels"> Agent Name:</span> {uid.agentName}</div>
                                    <div><span className="uid-banner-labels"> Model Type: </span>{uid.modelType}</div>
                                    <div><span className="uid-banner-labels"> Algorithm: </span>{uid.modelAlgorithm}</div>
                                    <div><span className="uid-banner-labels"> Max Iterations: </span>{uid.maxIter}</div>
                                    <div><span className="uid-banner-labels"> Number of Clusters: </span>{uid.numberOfClusters}</div>
                                    <div><span className="uid-banner-labels"> Random State: </span>{uid.randomState}</div>
                                </li>
                            </React.Fragment>
                        )}
                    </>
                ))}
            </ul>
            <div className="ingest-report-btns-container">
                {/* This is conditional rendering. Only if the selected UID object has "ingest" in its stream_names will this be rendered */}
                <div className="align-ingest-report-btns">
                    {
                        chosenUidObject?.hasIngest && (
                            <button className={`ingest-report-btns ${viewMode === "ingest" ? "selected" : ""}`} onClick={() => setViewMode("ingest")}>Ingest</button>
                        )
                    }
                    {/* This is conditional rendering. Only if the selected UID object has "report" in its stream_names will this be rendered */}
                    {
                        chosenUidObject?.hasReport && (
                            <button className={`ingest-report-btns ${viewMode === "report" ? "selected" : ""}`} onClick={() => setViewMode("report")}>Report</button>
                        )
                    }
                </div>
            </div>

        </aside>
    );
}

export default UidBanner;
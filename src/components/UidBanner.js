import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * UidBanner component displays specific UID information such as agent name and model type. If the UID object has ingest and/or report
 * then it will render buttons which will then render specific pages with data on either one. 
 */

const UidBanner = ({ uidObject, viewMode }) => {

    // const { uidsInfo} = useContext(UidContext);
    if (!uidObject) return null;

    return (

        <aside className="uid-banner-container">

            <h1 className="side-bar-title">Dashboard</h1>
            <hr className="side-bar-delimiter" />
            <ul>
                <li>
                    <div><span className="uid-banner-labels">Time Stamp:</span> {uidObject.datetime}</div>
                    <div><span className="uid-banner-labels">Agent Name:</span> {uidObject.agentName}</div>
                    <div><span className="uid-banner-labels">Model Type:</span> {uidObject.modelType}</div>
                    <div><span className="uid-banner-labels">Algorithm:</span> {uidObject.modelAlgorithm}</div>
                    <div><span className="uid-banner-labels">Max Iterations:</span> {uidObject.maxIter}</div>
                    <div><span className="uid-banner-labels">Number of Clusters:</span> {uidObject.numberOfClusters}</div>
                    <div><span className="uid-banner-labels">Random State:</span> {uidObject.randomState}</div>
                </li>
            </ul>
            <div className="ingest-report-btns-container">
                <div className="align-ingest-report-btns">
                    {uidObject.hasIngest && (
                        <Link to={`/UidPage/${uidObject.uidValue}/ingest`}>
                            <button className={`ingest-report-btns ${viewMode === "ingest" ? "selected" : ""}`}>Ingest &gt;</button>
                        </Link>
                    )}
                    {uidObject.hasReport && (
                        <Link to={`/UidPage/${uidObject.uidValue}/report`}>
                            <button className={`ingest-report-btns ${viewMode === "report" ? "selected" : ""}`}>Report &gt;</button>
                        </Link>
                    )}
                </div>
            </div>

        </aside>
    );
}

export default UidBanner;





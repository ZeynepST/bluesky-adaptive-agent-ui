import { Link } from 'react-router-dom';
import { IngestViewModel } from "../view-model/IngestViewModel";

//Stylesheets:
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * UidBanner component displays metadata and controls for a specific UID.
 * 
 *  - Shows key UID-related informastion such as agent name, model type, algorithm, etc.
 *  - If ingest/and or report and remodel data is available, renders buttons that navigate to their corresponding 
 *    data pages using React Router.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.uidObject - The UID object whose metadata will be displayed.
 * @param {string} props.viewMode - The currently selected view mode (ingest, report, or remodel).
 *
 * @returns {JSX.Element|null} The rendered banner or null if no uidObject is provided.
 */

const UidBanner = ({ uidObject, viewMode }) => {

    if (!uidObject) return null;

    const cacheLen = IngestViewModel(uidObject.hasIngest ? uidObject.uidValue : null)?.cache_len;

    return (
        <aside className="uid-banner-container">
            <h1 className="side-bar-title">Dashboard</h1>
            <hr className="side-bar-delimiter" />
            <ul>
                <li>
                    <div><span className="uid-banner-labels">Time Stamp:</span> {uidObject.datetime}</div>
                    <div><span className="uid-banner-labels">Agent Name:</span> {uidObject.agentName}</div>
                    <div><span className="uid-banner-labels">Model Type:</span> {uidObject.modelType}</div>
                    <div><span className="uid-banner-labels">Max Iterations:</span> {uidObject.maxIter}</div>
                    <div><span className="uid-banner-labels">Random State:</span> {uidObject.randomState}</div>
                    <div><span className="uid-banner-labels">Cache Length:</span> {cacheLen ?? 0}</div>
                    {uidObject.agentType === "ClusterAgent" && (
                        <div className="cluster-agent-only-banner">
                            <div><span className="uid-banner-labels">Number of Clusters:</span> {uidObject.numberOfClusters}</div>
                            {/* Only Cluster Agent seems to have this Algorithm attribute */}
                            <div><span className="uid-banner-labels">Algorithm:</span> {uidObject.modelAlgorithm}</div>
                        </div>
                    )}
                    {uidObject.agentType === "DecompositionAgent" && (
                        <div><span className="uid-banner-labels">Number of Components:</span> {uidObject.numberOfComponents}</div>
                    )}
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
                    {uidObject.hasReport && uidObject.hasIngest && uidObject.agentType === "ClusterAgent" && (
                        <Link to={`/UidPage/${uidObject.uidValue}/remodelCluster`}>
                            <button className={`ingest-report-btns ${viewMode === "remodelCluster" ? "selected" : ""}`}>Remodel &gt;</button>
                        </Link>
                    )}
                    {uidObject.hasReport && uidObject.hasIngest && uidObject.agentType === "DecompositionAgent" && (
                        <Link to={`/UidPage/${uidObject.uidValue}/remodelCluster`}>
                            <button className={`ingest-report-btns ${viewMode === "remodelCluster" ? "selected" : ""}`}>Remodel &gt;</button>
                        </Link>
                    )}
                </div>
            </div>

        </aside>
    );
}

export default UidBanner;





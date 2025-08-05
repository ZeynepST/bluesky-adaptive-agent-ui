import axios from "axios";
/**
 * Fetches and processes a list of UIDs associated with MockClusterAgent runs.
 *
 * Makes a GET request to the `/api/v1/search/` endpoint, filters results for
 * items where `agent_name` starts with "MockClusterAgent", and extracts
 * key metadata 
 *
 * @async
 * @function get_uids
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of parsed UID objects.
 * 
 * Each object in the array has the shape:
 * {
 *   uidValue: string,
 *   datetime: string | null,
 *   hasIngest: boolean,
 *   hasReport: boolean,
 *   agentName: string | null,
 *   modelType: string | null,
 *   modelAlgorithm: string | null,
 *   maxIter: number | null,
 *   numberOfClusters: number | null,
 *   randomState: number | null,
 * }
 */

export const get_uids = async () => {

    try {
        const response = await axios.get('/api/v1/search/');
        // This is to access the nested data within the response
        const rawData = response.data.data;

        const prefixes = ["ClusterAgent", "DecompositionAgent"];
        // This is parsing the nested data and ensures only MockClusterAgents are processed 
        const parsedUids = rawData.filter(item => {
            const agentName = item?.attributes?.metadata?.start?.agent_name;
            return prefixes.some(prefix => agentName?.includes(prefix));
        }
        )
            .map((item) => {
                const uidValue = item.id;
                const metadata = item.attributes.metadata;
                const model_params = item.attributes.metadata.start.model_params;
                // streamNames refers to ingest and report.
                const streamNames = metadata?.summary?.stream_names || [];

                const agentName = metadata?.start?.agent_name || null;
                const agentType = prefixes.find(prefix => agentName.includes(prefix)) || null;

                return {
                    uidValue,
                    datetime: metadata?.summary?.datetime || null,
                    hasIngest: streamNames.includes("ingest"),
                    hasReport: streamNames.includes("report"),
                    agentName: agentName,
                    agentType: agentType,
                    modelType: metadata?.start?.model_type || null,
                    modelAlgorithm: model_params?.algorithm || null,
                    maxIter: model_params?.max_iter || null,
                    randomState: model_params?.random_state || null,
                    ...(agentType === "ClusterAgent" && {
                        numberOfClusters: model_params?.n_clusters || null,
                    }),
                    ...(agentType === "DecompositionAgent" && {
                        numberOfComponents: model_params?.n_components || null,
                    })
                };

            });
        return parsedUids;
    }
    catch (error) {
        console.error("Failed to get list of uids");
        return [];
    }
}
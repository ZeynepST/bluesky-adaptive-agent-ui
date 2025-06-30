//fetch data and process it
import axios from "axios";

export const get_uids = async () => {

    try {
        const response = await axios.get('/api/v1/search/');
        // This is to access the nested data within the response
        const rawData = response.data.data;
        // This is parsing the nested data and ensures only MockClusterAgents are processed 
        const parsedUids = rawData.filter(item => item?.attributes?.metadata?.start?.agent_name?.startsWith("MockClusterAgent")).map((item) => {
            const uidValue = item.id;
            const metadata = item.attributes.metadata;
            const model_params = item.attributes.metadata.start.model_params;
            // streamNames refers to ingest and report.
            const streamNames = metadata?.summary?.stream_names || [];

            return {
                uidValue,
                datetime: metadata?.summary?.datetime || null,
                hasIngest: streamNames.includes("ingest"),
                hasReport: streamNames.includes("report"),
                agentName: metadata?.start?.agent_name || null,
                modelType: metadata?.start?.model_type || null,
                modelAlgorithm: model_params?.algorithm || null,
                maxIter: model_params?.max_iter || null,
                numberOfClusters: model_params?.n_clusters || null,
                randomState: model_params?.random_state || null,
            };

        });
        return parsedUids;
    }
    catch (error) {
        console.error("Failed to get list of uids");
        return [];
    }
}
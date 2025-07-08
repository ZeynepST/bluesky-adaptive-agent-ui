import * as tf from '@tensorflow/tfjs'
import * as sk from 'scikitjs'
import { setBackend, KMeans } from "scikitjs";
sk.setBackend(tf) //This is required by the documentation

/**
 * All TS will really need to reimplement is:
 * Make the model
 * Set the _clusters_centers
 * Predict on the observables
 * Transform the observables into distances.
*/


export async function remodelFromReportTS({
    observables,
    clusterCenters,
    recentClusterCenters,
    independentVars,
    idx  //needs further checking
}: {
    observables: number[][],
    clusterCenters: number[][][],
    recentClusterCenters: number[][]
    independentVars?: any[],
    idx?: number,
}) {

    const selectedCenters = typeof idx === 'number' ? clusterCenters[idx] : recentClusterCenters;

    console.log("observables shape:", observables.length, Array.isArray(observables[0]) ? observables[0].length : "not 2D");

    // convert data to tensors
    const X = tf.tensor2d(observables);
    const centers = tf.tensor2d(selectedCenters);

    const model = new KMeans({
        nClusters: selectedCenters.length,
        init: 'random',
        maxIter: 1,
    });

    model.clusterCenters = centers;

    //predicts cluster labels
    const clusterTensor = model.predict(X); //predict on the observables 
    const clusters = await clusterTensor.array();

    //computes distances to cluster centers
    const distanceTensor = model.transform(X); //transform observables to distances 
    const distances = await distanceTensor.array();

    //this is the result of the remodeling
    return {
        distances,
        clusters
    };
}




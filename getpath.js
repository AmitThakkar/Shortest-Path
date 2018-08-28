/**
 * Created by Amit Thakkar(vigildbest@gmail.com) on 28/08/18.
 */

const Graph = require('./graph.js')

const graph = new Graph();
graph.loadData("location.config", (error) => {
    if(error) {
        throw error;
    }

    // These are different tests.
    console.log("Bedroom => Bedroom");
    console.log(graph.getShortestPath("Bedroom", "Bedroom"));
    console.log();
    console.log("House => Knife");
    console.log(graph.getShortestPath("House", "knife"));
    console.log();
    console.log("Kitchen => cat");
    console.log(graph.getShortestPath("Kitchen", "cat"));
    console.log();
    console.log("Kitchen => sofa");
    console.log(graph.getShortestPath("Kitchen", "sofa"));
    console.log();
    console.log("Kitchen => Trees");
    console.log(graph.getShortestPath("Kitchen", "Trees"));
});
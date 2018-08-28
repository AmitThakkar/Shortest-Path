/**
 * Created by Amit Thakkar(vigildbest@gmail.com) on 28/08/18.
 * This class represents graph and here it will be Estate.
 */

const fs = require('fs');

const Node = require('./graph-node.js');

class Graph {
    constructor() {
        this.cache = {};
    }

    addNode(newNodeValue, previousNode, isLastNode) {
        // Keeping cache for all the nodes references so searching would be very fast and easy.
        let node = this.cache[newNodeValue];
        if(!node) {
            node = new Node(newNodeValue);
            this.cache[newNodeValue] = node;
        }
        // Two connected node must have link to each other, so setting next to each other in both nodes.
        if(previousNode) {
            // Last node is thing, so no need to set next node.
            if(!isLastNode) {
                node.setNext(previousNode);
            }
            previousNode.setNext(node);
        }
        return node;
    }

    getNode(nodeValue) {
        return this.cache[nodeValue];
    }

    // This method will load graph from provided config file
    loadData(configFile, callback) {
        const graph = this;
        fs.readFile(configFile, function(err, contents) {
            if(err) {
                callback(error);
            }
            if(!contents) {
                callback("No Path Defined!");
            }

            // Splitting config files base on new line delimiter.
            const paths = contents.toString().split("\r\n");
            paths.forEach((path) => {
                // Splitting path on base on colon so we can get each part of route.
                let parts = path.split(":");

                // last part has " - " so splitting it and handling it separately.
                let lastPart = parts.pop();
                let lastParts = lastPart.split(" - ");
                parts = parts.concat(lastParts);

                let previousNode = undefined;
                let isLastNode = false;
                parts.forEach((part, index) => {
                    if(parts.length-1 === index) {
                        isLastNode = true;
                    }
                    previousNode = graph.addNode(part, previousNode, isLastNode);
                });
            });
            callback();
        });
    }

    shortestPath(sourceValue, destinationValue, distance, path) {
        path.push(sourceValue);

        // Recursion termination condition, if source and destination are same.
        if(sourceValue === destinationValue) {
            return path;
        }
        const graph = this;

        let sourceNode = this.cache[sourceValue];

        // Setting distance to current node and increasing the distance for next nodes.
        sourceNode.setDistance(distance++);
        let nextNodes = sourceNode.getNext();
        let smallPath;
        for(let nextNodeKey in nextNodes) {
            let nextNode = nextNodes[nextNodeKey];
            let nextNodeDistance = nextNode.getDistance();

            // If next node is already reach with small distance number then ignoring it.
            if(!nextNodeDistance || nextNodeDistance > distance) {
                // Calling shortestPath in recursion so that it get fetch all the route.
                let newPath = graph.shortestPath(nextNode.getValue(), destinationValue, distance, path.slice());

                // Setting smallPath to newPath if newPath is smaller the new
                if(!smallPath || (newPath && newPath.length && smallPath.length > newPath.length)) {
                    smallPath = newPath;
                }
            }
        }
        return smallPath;
    }

    // Setting distance to all node as provided in parameter
    setDistanceToAllNode(distance) {
        for(let nodeKey in this.cache) {
            this.cache[nodeKey].setDistance(distance);
        }
    }

    getShortestPath(sourceValue, destinationValue) {
        if(!this.cache[sourceValue]) {
            return "Start location not found!"
        }
        if(!this.cache[destinationValue]) {
            return "End location not found!"
        }
        if(sourceValue === destinationValue) {
            return "You are already there!";
        }

        // Setting Distance to undefined to all the nodes.
        this.setDistanceToAllNode(undefined);

        // Calling shortest path to get shortest path from source to destination.
        let shortestPath = this.shortestPath(sourceValue, destinationValue, 1, []);
        if(!shortestPath) {
            return "Sorry, we are not able to find path! Please try later."
        }

        // Output result logic.
        let result = "You are in the " + shortestPath.shift() + ".";
        let resultEnd = " get " + shortestPath.pop()+ ".";
        shortestPath.forEach((path) => {
            result += " Go to " + path;
        });
        return result + resultEnd;
    }
}

module.exports = Graph;
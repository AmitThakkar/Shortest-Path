/**
 * Created by Amit Thakkar(vigildbest@gmail.com) on 28/08/18.
 */

const fs = require('fs');

const Node = require('./graph-node.js');

class Graph {
    constructor() {
        this.cache = {};
    }

    addNode(newNodeValue, previousNode, isLastNode) {
        let node = this.cache[newNodeValue];
        if(!node) {
            node = new Node(newNodeValue);
            this.cache[newNodeValue] = node;
        }
        if(previousNode) {
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

    loadData(configFile, callback) {
        const graph = this;
        fs.readFile(configFile, function(err, contents) {
            if(err) {
                callback(error);
            }
            if(!contents) {
                callback("No Path Defined!");
            }

            const paths = contents.toString().split("\r\n");
            paths.forEach((path) => {
                let parts = path.split(":");
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
        if(sourceValue === destinationValue) {
            return path;
        }
        const graph = this;

        let sourceNode = this.cache[sourceValue];
        sourceNode.setDistance(distance++);
        let nextNodes = sourceNode.getNext();
        let smallPath;
        for(let nextNodeKey in nextNodes) {
            let nextNode = nextNodes[nextNodeKey];
            let nextNodeDistance = nextNode.getDistance();
            if(!nextNodeDistance || nextNodeDistance > distance) {
                let newPath = graph.shortestPath(nextNode.getValue(), destinationValue, distance, path.slice());
                if(!smallPath || (newPath && newPath.length && smallPath.length > newPath.length)) {
                    smallPath = newPath;
                }
            }
        }
        return smallPath;
    }

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
        this.setDistanceToAllNode(undefined);
        let shortestPath = this.shortestPath(sourceValue, destinationValue, 1, []);
        if(!shortestPath) {
            return "Sorry, we are not able to find path! Please try later."
        }
        let result = "You are in the " + shortestPath.shift() + ".";
        let resultEnd = " get " + shortestPath.pop()+ ".";
        shortestPath.forEach((path) => {
            result += " Go to " + path;
        });
        return result + resultEnd;
    }
}

module.exports = Graph;
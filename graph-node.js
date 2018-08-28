/**
 * Created by Amit Thakkar(vigildbest@gmail.com) on 28/08/18.
 * This class represents each part of the Graph i.e. Bedroom
 */

class Node {
    constructor(value) {
        this.value = value;
        this.distance = undefined;
    }

    getValue() {
        return this.value;
    }

    getDistance() {
        return this.distance;
    }
    setDistance(distance) {
        this.distance = distance;
    }

    setNext(nextNode) {
        if(!nextNode) {
            return;
        }
        // If this is first node then, setting this.next to empty object.
        if(!this.next) {
            this.next = {};
        }
        this.next[nextNode.getValue()] = nextNode;
    }

    getNext() {
        return this.next;
    }

}

module.exports = Node;
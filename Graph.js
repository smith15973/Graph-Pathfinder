export class Graph {
    constructor() {
        this.nodes = []
        this.edges = []
    }

    getNode(id) {
        return this.nodes.find(node => node.id === id.toString())
    }

    addNode(node) {
        this.nodes.push(node);
        return node;
    }

    addEdge(edge) {
        // check if edge already exists
        const existingEdge = this.edges.find(existingEdge => {
            return (
                (existingEdge.sourceNodeId === edge.sourceNodeId && existingEdge.targetNodeId === edge.targetNodeId) ||
                (existingEdge.sourceNodeId === edge.targetNodeId && existingEdge.targetNodeId === edge.sourceNodeId)
            )
        })
        if (existingEdge) {
            return;
        } else {
            this.edges.push(edge);
            return edge;
        }
    }

    deleteEdge(dEdge) {
        this.edges = this.edges.filter(edge => !(edge.sourceNodeId === dEdge.sourceNodeId && edge.targetNodeId === dEdge.targetNodeId))
    }

    deleteNode(id) {
        this.edges = this.edges.filter(edge => edge.sourceNodeId !== id && edge.targetNodeId !== id)
        this.nodes = this.nodes.filter(node => node.id !== id);
    }

    calculateShortestPath(sourceId = '1', targetId = '2') {
        // debugger;
        let unprocessedVertices = this.nodes.filter(node => node.id !== sourceId);
        let unprocessedEdges = this.edges;
        unprocessedVertices.forEach(vertice => { vertice.parent = null, vertice.cost = -1 })


        const startVertice = this.nodes.find(node => node.id === sourceId);
        startVertice.parent = null;
        startVertice.cost = 0;
        const processedVertices = [startVertice]


        while (unprocessedVertices.length > 0 && this.hasMoreConnections(processedVertices, unprocessedEdges)) {
            let shortestEdge = { source: null, target: null, pathWeight: null, edge: null }

            processedVertices.forEach(vertice => {
                //find edge
                const edges = unprocessedEdges.filter(edge => edge.sourceNodeId === vertice.id || edge.targetNodeId === vertice.id);

                edges.forEach(edge => {
                    const pathWeight = vertice.cost + edge.weight;

                    if (!shortestEdge.source || pathWeight < shortestEdge.pathWeight) { //if found new shortest path
                        shortestEdge = {
                            source: vertice,
                            target: edge.sourceNodeId === vertice.id ? this.findNode(edge.targetNodeId) : this.findNode(edge.sourceNodeId),
                            pathWeight: vertice.cost + edge.weight,
                            edge: edge
                        }
                    }

                })
            })

            if (shortestEdge.target.parent === null || shortestEdge.pathWeight < shortestEdge.target.cost) {
                shortestEdge.target.parent = shortestEdge.source;
                shortestEdge.target.cost = shortestEdge.pathWeight;
                unprocessedVertices = unprocessedVertices.filter(vertice => vertice.id !== shortestEdge.target.id);
                processedVertices.push(shortestEdge.target);
            }
            unprocessedEdges = unprocessedEdges.filter(edge => shortestEdge.edge.id !== edge.id);
        }

        // return the target node to show path if it is a real path, otherwise return -1
        const targetNode = this.nodes.find(node => node.id === targetId)
        return this.verifyPath(sourceId, targetNode) ? targetNode : -1

    }

    findNode(id) {
        return this.nodes.find(node => node.id === id);
    }

    findEdges(node) {
        const edges = this.edges.filter(edge => edge.sourceNodeId === node.id || edge.targetNodeId === node.id);
        return edges;
    }

    findEdge(source, target) {
        const existingEdge = this.edges.find(existingEdge => {
            return (
                (existingEdge.sourceNodeId === source && existingEdge.targetNodeId === target.id) ||
                (existingEdge.sourceNodeId === target.id && existingEdge.targetNodeId === source.id)
            )
        })
        return existingEdge;
    }

    hasMoreConnections(processedVertices, unprocessedEdges) {
        let hasMoreConnections = false;
        processedVertices.forEach(pVertice => {
            const edges = unprocessedEdges.filter(edge => edge.sourceNodeId === pVertice.id || edge.targetNodeId === pVertice.id);
            if (edges.length > 0) {
                hasMoreConnections = true;
                return true;
            }
        })

        return hasMoreConnections;
    }

    verifyPath(sourceId, targetNode) {
        let traversalNode = targetNode;
        while (traversalNode.parent !== null) {
            traversalNode = traversalNode.parent;
        }
        return traversalNode.id === sourceId
    }

    reset() {
        this.nodes = [];
        this.edges = [];
    }

}


export class Node {
    constructor(xPos, yPos, id) {
        this.xPos = xPos
        this.yPos = yPos
        this.id = `${id}`;
        this.cost = -1;
        this.parent = null;
    }

    setPosition(x = this.xPos, y = this.yPos) {
        this.xPos = x;
        this.yPos = y;
    }
    getPosition() {
        return { xPos: this.xPos, yPos: this.yPos };
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setCost(cost) {
        this.cost = cost;
    }

    getCost() {
        return this.cost;
    }

    setParent(parent) {
        this.parent = parent;
    }

    getParent() {
        return this.parent
    }

}

export class Edge {
    constructor(sourceNodeId, targetNodeId, weight = 1, directed = false) {
        this.sourceNodeId = sourceNodeId;
        this.targetNodeId = targetNodeId;
        this.weight = weight;
        this.directed = false;
        this.id = `${this.sourceNodeId}-to-${this.targetNodeId}`
    }

    setWeight(weight) {
        this.weight = parseInt(weight);
    }

    getWeight() {
        return this.weight
    }

    // getCoordinates() {
    // }


}

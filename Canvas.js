import { Graph, Node, Edge } from "./Graph.js";

let numNodes = 0;
const edge = { source: 0, target: 0 }
const canvas = document.querySelector("#canvas");
const lineCanvas = document.querySelector("#lineCanvas");
const calculateShortestPathButton = document.querySelector("#calculateShortestPathButton");
const resetButton = document.querySelector("#resetButton");
const sourceSelect = document.querySelector("#sourceSelect");
const targetSelect = document.querySelector("#targetSelect");

const graph = new Graph();
const nodeHeight = 30;
const nodeWidth = 30;
const primaryFontSize = calculateFontSize(nodeWidth, nodeHeight, 8)
const edgeWeightInputWidth = 20
const edgeWeightInputHeight = 20
const secondaryFontSize = 10


calculateShortestPathButton.addEventListener('click', (event) => {
    const targetNode = graph.calculateShortestPath(sourceSelect.value, targetSelect.value)
    displayShortestPath(targetNode);
})

canvas.addEventListener('click', (event) => {
    if (event.target !== canvas) return;
    createNode(event.layerX, event.layerY);
})

sourceSelect.addEventListener('change', (event) => displayGraph())
targetSelect.addEventListener('change', (event) => displayGraph())

resetButton.addEventListener('click', (event) => {
    graph.reset();
    numNodes = 0;
    document.querySelectorAll(`option`).forEach(option => option.remove())
    displayGraph();


})

function createNodeSelectOption(node) {
    const sourceOption = document.createElement('option');
    sourceOption.value = node.id;
    sourceOption.innerText = node.id;
    sourceOption.id = `sourceOption${node.id}`;
    sourceSelect.appendChild(sourceOption);

    const targetOption = document.createElement('option');
    targetOption.value = node.id;
    targetOption.innerText = node.id;
    targetOption.id = `targetOption${node.id}`;
    targetSelect.appendChild(targetOption);
}

function createNode(x, y) {
    const node = new Node(x - nodeWidth / 2, y - nodeHeight / 2, ++numNodes);
    graph.addNode(node);
    createNodeSelectOption(node);
    displayGraph();
}

function deleteNode(id) {
    // remove as options
    document.querySelector(`#sourceOption${id}`).remove()
    document.querySelector(`#targetOption${id}`).remove()
    graph.deleteNode(id);
    displayGraph();
}

function createEdge(source, target, weight = 1) {
    const edge = new Edge(source, target, weight);
    graph.addEdge(edge);
    displayGraph();
}

function handleNodeClick(event) {
    const node = event.currentTarget;
    event.stopPropagation()
    if (event.button === 0) {
        if (edge.source === 0) {
            node.classList.add('selected');
            edge.source = node.id;
        } else if (node.id === edge.source) {
            node.classList.remove('selected');
            edge.source = 0;
        } else {
            createEdge(edge.source, node.id);
            node.classList.remove('selected');
            edge.source = 0;
            edge.target = 0;
        }

    } else if (event.button === 2) {
        deleteNode(node.id);
    }
}


function displayGraph() {
    document.querySelectorAll('.node').forEach(node => node.remove());
    document.querySelectorAll('.nodeDistance').forEach(nodeDistance => nodeDistance.remove());
    document.querySelectorAll('.edge').forEach(edge => edge.remove());
    document.querySelectorAll('.edge-weight').forEach(edgeWeight => edgeWeight.remove());
    graph.nodes.forEach(node => displayNode(node));
    graph.edges.forEach(edge => displayEdge(edge));
}

function displayNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.id = `${node.id}`;
    nodeElement.style.left = node.xPos + 'px';
    nodeElement.style.top = node.yPos + 'px';
    nodeElement.style.height = nodeHeight + 'px';
    nodeElement.style.width = nodeWidth + 'px';
    nodeElement.style.fontSize = primaryFontSize + 'px';
    nodeElement.innerHTML = node.id;
    nodeElement.addEventListener('mousedown', (event => handleNodeClick(event)));
    nodeElement.addEventListener('contextmenu', e => e.preventDefault());
    canvas.appendChild(nodeElement);
}

function displayEdge(edge) {
    const sourceNode = graph.nodes.find(node => node.id === edge.sourceNodeId);
    const targetNode = graph.nodes.find(node => node.id === edge.targetNodeId);

    const x1 = sourceNode.xPos + nodeWidth / 2;
    const y1 = sourceNode.yPos + nodeHeight / 2;
    const x2 = targetNode.xPos + nodeWidth / 2;
    const y2 = targetNode.yPos + nodeHeight / 2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add('edge');
    line.id = edge.id;


    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");

    lineCanvas.appendChild(line);
    displayEdgeWeight(x1, x2, y1, y2, edge);

}


function displayEdgeWeight(x1, x2, y1, y2, edge) {
    const edgeWeight = document.createElement('input');
    edgeWeight.type = 'number'
    edgeWeight.className = 'edge-weight';
    edgeWeight.value = edge.weight;
    edgeWeight.id = `weight-${edge.id}`

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    edgeWeight.style.position = 'absolute';
    edgeWeight.style.left = `${(midX - edgeWeightInputWidth / 2)}px`;
    edgeWeight.style.top = `${(midY - edgeWeightInputHeight / 2)}px`;
    edgeWeight.style.height = edgeWeightInputHeight + "px";
    edgeWeight.style.width = edgeWeightInputWidth + "px";
    edgeWeight.style.fontSize = secondaryFontSize + "px";

    edgeWeight.addEventListener('focusout', (event) => {
        if (event.target.value === '') {
            graph.deleteEdge(edge);
        } else if (edge.getWeight().toString() !== event.target.value) {
            edge.setWeight(event.target.value);
            
        }
        displayGraph()
    })

    canvas.appendChild(edgeWeight);
}

function displayShortestPath(targetNode) {
    if (targetNode === -1) { alert("Path does not exist!"); return }

    let traversalNode = targetNode;
    while (traversalNode !== null) {
        document.getElementById(parseInt(traversalNode.id)).classList.add('shortest')
        if (traversalNode.parent) {
            const edge = document.getElementById(`${traversalNode.id}-to-${traversalNode.parent.id}`) ||
                document.getElementById(`${traversalNode.parent.id}-to-${traversalNode.id}`)
            edge.classList.add('shortest');
        }

        traversalNode = traversalNode.parent
    }
    displayDistances();
}

function displayDistances() {
    graph.nodes.forEach(node => {
        const distanceDiv = document.createElement('div');
        distanceDiv.classList.add('nodeDistance');
        distanceDiv.id = `${node.id}nodeDistance`
        distanceDiv.innerHTML = node.cost < 0 ? '&#8734' : node.cost;
        distanceDiv.style.left = (node.xPos - 5) + 'px';
        distanceDiv.style.top = (node.yPos - 5) + 'px';
        distanceDiv.style.fontSize = secondaryFontSize + "px";

        canvas.appendChild(distanceDiv);
    })
}


function calculateFontSize(width, height, baseFontSize) {
    // Use the smaller dimension to ensure text fits within the node
    const minDimension = Math.min(width, height);

    // Calculate a proportional font size
    // This is a simple linear relationship - you can adjust the formula as needed
    const fontSize = (minDimension / 20) * baseFontSize;

    // Set minimum and maximum bounds to prevent extremely small or large text
    return Math.max(8, Math.min(fontSize, 48));
}


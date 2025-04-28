import { RedBlackTree, RedBlackNode } from './RedBlackTree.js';




const canvas = document.querySelector("#canvas");
const lineCanvas = document.querySelector("#lineCanvas");
const findNodeButton = document.querySelector("#findNodeButton");
const insertValueButton = document.querySelector("#insertValueButton");
const removeNodeButton = document.querySelector("#removeNodeButton");
const valueInput = document.querySelector("#valueInput");
const resetButton = document.querySelector("#resetButton");
const generateGraphButton = document.querySelector("#generateGraphButton");
const generateSizeInput = document.querySelector("#generateSizeInput");
const verifiedTreeDisplay = document.querySelector("#verifiedTreeDisplay");

const rbTree = new RedBlackTree();
const nodeHeight = 30;
const nodeWidth = 30;
const primaryFontSize = calculateFontSize(nodeWidth, nodeHeight, 8)
const levelHeight = 60;




insertValueButton.addEventListener('click', (event) => {
    const value = parseFloat(valueInput.value);
    valueInput.value = '';
    createNode(value);
})

removeNodeButton.addEventListener('click', (event) => {
    const value = parseFloat(valueInput.value);
    valueInput.value = '';
    deleteNode(value);
})

findNodeButton.addEventListener('click', (event) => {
    document.querySelectorAll('.shortest').forEach(shortest => shortest.classList.remove('shortest'));
    const value = parseFloat(valueInput.value);
    findNode(value);
})

resetButton.addEventListener('click', (event) => {
    rbTree.reset();
    displayTree(rbTree.getRoot(), 0, 0, null);
    updateVerifiedTreeDisplay()
})

generateGraphButton.addEventListener('click', (event) => {
    let size = parseInt(generateSizeInput.value)
    if (size > 100) {
        size = 100;
        generateSizeInput.value = size;
    }
    generateRandomGraph(size);
})

function createNode(value) {
    if (!value) return;
    const node = new RedBlackNode(value);
    node.onChange(() => {
        displayTree(rbTree.getRoot(), 0, 0, null);
    })
    rbTree.insertNode(node);
    displayTree(rbTree.getRoot(), 0, 0, null);
    updateVerifiedTreeDisplay()
}


function displayTree(node, level, left) {
    if (node === rbTree.getRoot()) {
        document.querySelectorAll('.node').forEach(node => node.remove());
        document.querySelectorAll('.edge').forEach(edge => edge.remove());
    }

    if (node !== null) {
        displayNode(node, level, left);

        const canvasWidth = canvas.offsetWidth;

        // Dynamically adjust horizontal spacing based on level
        const horizontalSpacing = (canvasWidth / 5) / Math.pow(2, level); // Decrease spacing as level increases

        // Calculate parent node position for edge drawing

        const parentX = (canvasWidth / 2) + left;
        const parentY = (nodeHeight) + (level * levelHeight);

        // Only draw edges to existing children
        if (node.getLeftChild() !== null) {
            const childX = (canvasWidth / 2) + (left - horizontalSpacing);
            const childY = (nodeHeight) + ((level + 1) * levelHeight);
            const edgeId = `${node.getLeftChild().getValue()}-to-${node.getValue()}`
            displayEdge(parentX, parentY, childX, childY, edgeId);
        }

        if (node.getRightChild() !== null) {
            const childX = (canvasWidth / 2) + (left + horizontalSpacing);
            const childY = (nodeHeight) + ((level + 1) * levelHeight);
            const edgeId = `${node.getRightChild().getValue()}-to-${node.getValue()}`
            displayEdge(parentX, parentY, childX, childY, edgeId);
        }

        displayTree(node.getLeftChild(), level + 1, left - horizontalSpacing);
        displayTree(node.getRightChild(), level + 1, left + horizontalSpacing);
    }
}

function displayNode(node, level, left,) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.id = `${node.getValue()}`;
    nodeElement.style.backgroundColor = node.getColor();

    const leftStyle = `calc(50% - ${nodeWidth / 2}px + ${left}px)`
    const topStyle = `calc(${nodeHeight / 2}px + ${level * levelHeight}px)`
    nodeElement.style.left = leftStyle;
    nodeElement.style.top = topStyle;
    nodeElement.style.height = nodeHeight + 'px';
    nodeElement.style.width = nodeWidth + 'px';
    nodeElement.style.fontSize = primaryFontSize + 'px';
    nodeElement.innerHTML = node.getValue();

    canvas.appendChild(nodeElement);
}

function displayEdge(x1, y1, x2, y2, edgeId) {
    const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
    edge.classList.add('edge');
    edge.id = edgeId;
    edge.setAttribute("x1", x1);
    edge.setAttribute("y1", y1);
    edge.setAttribute("x2", x2);
    edge.setAttribute("y2", y2);
    edge.setAttribute("stroke", "black");
    edge.setAttribute("stroke-width", "2");
    lineCanvas.appendChild(edge);
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

function generateRandomGraph(size = 50, min = 0, max = 999) {
    rbTree.reset();
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * max));
    values.forEach(value => {
        createNode(value);
    });
}

function findNode(value) {
    let traversalNode = rbTree.findNode(value);
    while (traversalNode) {
        const nodeElement = document.getElementById(traversalNode.getValue());
        const parent = traversalNode.getParent();
        if (parent) {
            const edgeElement = document.getElementById(`${traversalNode.getValue()}-to-${parent.getValue()}`);
            edgeElement.classList.add('shortest')
        }
        nodeElement.classList.add('shortest')
        traversalNode = parent;
    }

}

function deleteNode(value) {
    rbTree.deleteNode(value);
    displayTree(rbTree.getRoot(), 0, 0, null);
    updateVerifiedTreeDisplay()
}


function updateVerifiedTreeDisplay() {
    const { isValid, message } = rbTree.verifyRedBlackTree();
    verifiedTreeDisplay.innerHTML = message;
    if (isValid) {
        verifiedTreeDisplay.style.color = 'green';
    } else {
        verifiedTreeDisplay.style.color = 'red';
    }
}




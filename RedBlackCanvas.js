import { RedBlackTree, RedBlackNode } from './RedBlackTree.js';




const canvas = document.querySelector("#canvas");
const lineCanvas = document.querySelector("#lineCanvas");
const insertValueButton = document.querySelector("#insertValueButton");
const valueInput = document.querySelector("#valueInput");
const resetButton = document.querySelector("#resetButton");

const rbTree = new RedBlackTree();
const nodeHeight = 30;
const nodeWidth = 30;
const primaryFontSize = calculateFontSize(nodeWidth, nodeHeight, 8)




insertValueButton.addEventListener('click', (event) => {
    const value = parseFloat(valueInput.value);
    valueInput.value = '';
    createNode(value);
})

canvas.addEventListener('click', (event) => {

})

resetButton.addEventListener('click', (event) => {

})

function createNode(value) {
    const node = new RedBlackNode(value);
    rbTree.insertNode(node);
    console.log(rbTree);
    displayTree(rbTree.getRoot(), 0, 0, null);
}

// function deleteNode(id) {

//     graph.deleteNode(id);
//     displayGraph();
// }

// function createEdge(source, target, weight = 1) {
//     const edge = new Edge(source, target, weight);
//     graph.addEdge(edge);
//     displayGraph();
// }

// function handleNodeClick(event) {
//     const node = event.target;
//     event.stopPropagation()
//     if (event.button === 0) {
//         if (newEdge.source === null) {
//             node.classList.add('selected');
//             newEdge.source = graph.findNode(node.id);
//         } else if (node.id === newEdge.source.id) {
//             node.classList.remove('selected');
//             newEdge.source = null;
//         } else {
//             newEdge.target = graph.findNode(node.id);
//             createEdge(newEdge.source, newEdge.target);
//             node.classList.remove('selected');
//             newEdge.source = null;
//             newEdge.target = null;
//         }

//     } else if (event.button === 2) {
//         deleteNode(node.id);
//     }
// }


function displayTree(node, level, left, direction) {
    if (node === rbTree.getRoot()) {
        document.querySelectorAll('.node').forEach(node => node.remove());
        document.querySelectorAll('.edge').forEach(edge => edge.remove());
    }

    if (node !== null) {
        displayNode(node, level, left, direction);

        // Dynamically adjust horizontal spacing based on level
        const horizontalSpacing = 100 / Math.pow(2, level); // Decrease spacing as level increases

        // Calculate parent node position for edge drawing
        const canvasWidth = canvas.offsetWidth;
        const parentX = (canvasWidth / 2) + left;
        const parentY = (nodeHeight) + (level * 50);

        // Only draw edges to existing children
        if (node.getLeftChild() !== null) {
            const childX = (canvasWidth / 2) + (left - horizontalSpacing);
            const childY = (nodeHeight) + ((level + 1) * 50);
            displayEdge(parentX, parentY, childX, childY);
        }

        if (node.getRightChild() !== null) {
            const childX = (canvasWidth / 2) + (left + horizontalSpacing);
            const childY = (nodeHeight) + ((level + 1) * 50);
            displayEdge(parentX, parentY, childX, childY);
        }

        displayTree(node.getLeftChild(), level + 1, left - horizontalSpacing, 'left');
        displayTree(node.getRightChild(), level + 1, left + horizontalSpacing, 'right');
    }
}

function displayNode(node, level, left, direction) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.id = `${node.getValue()}`;
    nodeElement.style.backgroundColor = node.getColor();

    const leftStyle = `calc(50% - ${nodeWidth / 2}px + ${left}px)`
    const topStyle = `calc(${nodeHeight / 2}px + ${level * 50}px)`
    nodeElement.style.left = leftStyle;
    nodeElement.style.top = topStyle;
    nodeElement.style.height = nodeHeight + 'px';
    nodeElement.style.width = nodeWidth + 'px';
    nodeElement.style.fontSize = primaryFontSize + 'px';
    nodeElement.innerHTML = node.getValue();

    canvas.appendChild(nodeElement);
}

function displayEdge(x1, y1, x2, y2) {
    const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
    edge.classList.add('edge');
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





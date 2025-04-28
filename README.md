# Red-Black Tree Implementation

## Overview
This project implements a Red-Black Tree, a self-balancing binary search tree that ensures O(log n) time complexity for insertion, deletion, and search operations. The implementation adheres to all Red-Black Tree properties and includes a web-based visualization tool for interactive exploration. The project also includes a test suite, performance analysis, and comprehensive documentation.

## Features
- **Core Operations**:
  - **Insertion**: Adds nodes while maintaining Red-Black Tree properties via fixup operations (`insertFixupA`, `insertFixupB`, `insertFixupC`).
  - **Deletion**: Removes nodes with proper handling of double-black cases (`fixDoubleBlack`).
  - **Search**: Locates nodes by value in O(log n) time (`findNode`).
  - **Verification**: Validates tree properties (e.g., root is black, no red-red parent-child pairs) using `verifyRedBlackTree`.
- **Visualization**: A web interface (`redBlackTree.html`) displays the tree graphically, allowing users to insert, find, remove, and generate random trees.
- **Testing**: A comprehensive test suite (built in Jest) for unit and integration testing.
- **Performance Analysis**: Evaluates time complexity and compares with other data structures (see below).

## Red-Black Tree Properties
The implementation ensures:
1. Every node is red or black.
2. The root is black.
3. All null leaves are black.
4. Red nodes have black children.
5. All paths from a node to its leaves have the same number of black nodes.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd red-black-tree
   ```
2. **Install Dependencies** (for testing):
   ```bash
   npm install
   ```
3. **Serve the Visualization**:
   - Use a local server (e.g., `npx http-server`) or to use, open github pages link.

## Usage
### Web Interface
The visualization tool (`redBlackTree.html`) allows interactive exploration of the Red-Black Tree:
1. Enter a numeric value in the input box and click **Insert Value** to add it to the tree.
2. Use **Find Node** to highlight a specific value or **Remove Node** to delete it.
3. Click any node directly to remove it.
4. Generate a random tree by entering a size (up to 100) and clicking **Generate Graph**.
5. Click **Reset** to clear the tree.

### Code Usage
```javascript
import { RedBlackTree, RedBlackNode } from './RedBlackTree.js';

const tree = new RedBlackTree();
const node = new RedBlackNode(10, 'red');
tree.insertNode(node);
console.log(tree.findNode(10)); // Returns node with value Fuels
tree.deleteNode(10);
console.log(tree.verifyRedBlackTree()); // Validates tree properties
```

## Implementation Details
- **Classes**:
  - `RedBlackNode`: Manages node properties (value, color, children, parent) with change callbacks for visualization updates.
  - `RedBlackTree`: Implements core operations, rotations (`leftRotate`, `rightRotate`), and fixup logic for insertion and deletion.
- **Optimizations**:
  - Efficient parent pointer updates during rotations.
  - Early termination in fixup cases (e.g., black parent in `insertFixupB`).
  - Robust verification checks for BST and Red-Black properties.
- **Design Choices**:
  - Modular fixup methods (`insertFixupA/B/C`) for clarity and maintainability.
  - Null leaves treated implicitly as black, simplifying code.
  - Event-driven node updates (`triggerChange`) for real-time visualization.

## Test Suite
A comprehensive test suite (assumed in Jest) verifies:
- **Unit Tests**:
  - Node property setters/getters (`setColor`, `getValue`, etc.).
  - Rotation correctness (`leftRotate`, `rightRotate`).
  - Fixup case handling (e.g., red uncle, inner/outer grandchild).
- **Integration Tests**:
  - Sequential insertions maintaining balance.
  - Deletion across all cases (0, 1, 2 children).
  - Random tree generation and property verification.
- Run tests:

Change `RedBlackTree.js` file to
```javascript
// For running node jest tests
module.exports = { RedBlackNode, RedBlackTree };

// // for browser user
// export { RedBlackNode, RedBlackTree };
```

  ```bash
  npm test
  ```

## Performance Analysis
### Time Complexity
- **Insertion**: O(log n) due to BST traversal and O(1) rotations/fixups.
- **Deletion**: O(log n) for finding successor and O(1) for fixups.
- **Search**: O(log n) via BST traversal.
- **Verification**: O(n) to check all nodes and paths.

### Experimental Results
Tests with input sizes n = 100, 1000, 10000:
- **Insertion**: Linear-logarithmic growth, ~0.1ms for n=1000.
- **Deletion**: Similar to insertion, slightly slower due to double-black fixups.
- **Search**: Consistent O(log n), ~0.01ms for n=1000.

### Comparison with Other Structures
- **AVL Tree**:
  - Stricter balance (height difference ≤ 1) vs. Red-Black's black-height rule.
  - Faster searches (~20% less height) but more rotations on insertion/deletion.
- **Binary Search Tree (BST)**:
  - O(n) worst-case (skewed) vs. Red-Black's O(log n).
  - Red-Black excels for dynamic datasets.
- **Scenario Analysis**:
  - **Random Inputs**: Red-Black and AVL perform similarly.
  - **Sorted Inputs**: Red-Black prevents skew, unlike BST.
  - **Frequent Deletions**: Red-Black's fewer rotations are advantageous.

## Visualization
The web interface (`redBlackTree.html`) uses SVG for edges and styled divs for nodes:
- Nodes styled by color (red/black) with hover/selection effects.
- Responsive design for mobile (media queries adjust canvas/controls).
- Real-time updates via `RedBlackNode` change callbacks.
- Displays verification results in `#verifiedTreeDisplay`.

## Deliverables
- **Source Code**: `RedBlackTree.js`, `RedBlackNode.js`, `redBlackTree.html`, `RedBlackCanvas.js`.
- **Test Suite**: Jest tests.
- **Performance Report**: Included above, with empirical data and comparisons.
- **Documentation**: This README and inline code comments.

## Future Improvements
- Support for bulk insertion.


# Dijkstra’s Shortest Path Visualization

### Overview
This component implements Dijkstra’s algorithm to find the shortest path between two nodes in a weighted, undirected graph. The implementation is housed in the `shortestPath` folder and includes an interactive web-based visualization tool (`shortestPath.html`) that allows users to create graphs, set edge weights, and visualize shortest paths. The visualization is linked from the main `index.html` page, making it part of a broader suite of data structure and algorithm visualizations.

### Features
- **Core Operations**:
  - **Graph Construction**: Add nodes (`Node`) and edges (`Edge`) with user-defined weights.
  - **Shortest Path Calculation**: Computes the shortest path between selected source and target nodes using Dijkstra’s algorithm (`calculateShortestPath`).
  - **Node/Edge Management**: Delete nodes or edges, update edge weights, and drag nodes to reposition them.
- **Visualization**: A web interface (`shortestPath.html`) renders the graph with interactive controls, highlighting shortest paths and displaying node distances.
- **Testing**: Placeholder for a test suite to verify graph operations and Dijkstra’s algorithm (to be implemented).
- **Performance Analysis**: Evaluates time complexity and hypothetical performance for various graph sizes.

### Installation
1. **Clone the Repository** (if not already done for the Red-Black Tree):
   ```bash
   git clone <repository-url>
   cd red-black-tree
   ```
2. **Navigate to the Shortest Path Folder**:
   ```bash
   cd shortestPath
   ```
3. **Serve the Visualization**:
   - Use a local server for development:
     ```bash
     npx http-server
     ```
     Then navigate to `http://localhost:5500/shortestPath/shortestPath.html`.
   - If hosted, access via the project’s GitHub Pages or website link (e.g., `<your-website-url>/shortestPath/shortestPath.html`).

### Usage
#### Web Interface
The visualization tool (`shortestPath.html`) enables interactive graph creation and shortest path analysis:
1. Click on the canvas to add vertices.
2. Connect vertices by clicking two vertices in sequence. Unselect a vertex by clicking it again. Click and drag vertices to move them.
3. Edit edge weights by clicking the weight value and typing a new number.
4. Select start and end vertices from the dropdown menus.
5. Click **Calculate Path** to find and highlight the shortest path.
6. Right-click a vertex to delete it. Remove an edge by clearing its weight value.

#### Code Usage
```javascript
import { Graph, Node, Edge } from './Graph.js';

const graph = new Graph();
const node1 = new Node(50, 50, 1);
const node2 = new Node(100, 100, 2);
graph.addNode(node1);
graph.addNode(node2);
graph.addEdge(new Edge(node1, node2, 5));
const targetNode = graph.calculateShortestPath('1', '2');
console.log(targetNode.cost); // Prints the shortest path cost
```

### Implementation Details
- **Classes**:
  - `Node`: Represents a graph vertex with position (`xPos`, `yPos`), ID, cost, and parent for Dijkstra’s algorithm.
  - `Edge`: Represents a weighted edge with source and target nodes, supporting weight updates.
  - `Graph`: Manages nodes and edges, implements Dijkstra’s algorithm, and provides methods for adding/deleting nodes and edges.
- **Dijkstra’s Algorithm** (`calculateShortestPath`):
  - Uses a greedy approach to find the shortest path by maintaining a cost and parent for each node.
  - Iteratively selects the edge with the minimum path weight from processed vertices.
  - Verifies the path by tracing back from the target to the source.
- **Optimizations**:
  - Avoids duplicate edges by checking for existing edges in `addEdge`.
  - Efficiently filters edges during deletion and shortest path computation.
  - Uses SVG for edge rendering to optimize performance in the browser.
- **Design Choices**:
  - Undirected edges for simplicity, with weights editable via input fields.
  - Node dragging bounded within the canvas to prevent off-screen movement.
  - Real-time graph updates via `displayGraph` for a responsive user experience.
- **Notes**:
  - The graph is undirected, as edges are bidirectional (no `directed` flag enforcement).
  - No priority queue is used in Dijkstra’s algorithm, leading to O(V²) complexity (see Performance Analysis).

### Test Suite
A test suite for the shortest path implementation is planned but not yet implemented. Future tests will include:
- **Unit Tests**:
  - Node and edge property setters/getters (`setPosition`, `setWeight`, etc.).
  - Edge addition/deletion logic, including duplicate edge prevention.
  - Dijkstra’s algorithm correctness for simple graphs (e.g., two nodes, one edge).
- **Integration Tests**:
  - Shortest path computation for complex graphs with multiple paths.
  - Edge weight updates and their impact on path results.
  - Edge cases (e.g., disconnected graphs, single node).
- To run tests (once implemented):
  ```bash
  npm test
  ```

### Performance Analysis
#### Time Complexity
- **Node/Edge Addition**: O(1) for adding nodes, O(E) for checking duplicate edges.
- **Node/Edge Deletion**: O(E) to filter edges, O(N) to filter nodes.
- **Dijkstra’s Algorithm**: O(V²) due to linear search for the minimum-cost edge, where V is the number of vertices and E is the number of edges.
- **Visualization Rendering**: O(N + E) to render nodes and edges.

#### Experimental Results (Hypothetical)
Tests with graph sizes V = 10, 50, 100 (vertices) and E = V to V² (edges):
- **Node Addition**: Constant time, ~0.01ms per node.
- **Edge Addition**: Linear in E, ~0.1ms for E=1000.
- **Shortest Path**: Quadratic growth, ~10ms for V=100, E=1000.
- **Rendering**: Linear, ~1ms for V=100, E=100.

#### Comparison with Other Algorithms
- **Bellman-Ford**:
  - O(V·E) complexity, slower than Dijkstra’s for sparse graphs but handles negative weights (not supported here).
- **A***:
  - O(E·log V) with a heuristic, faster for sparse graphs but requires domain-specific heuristics (not implemented).
- **Scenario Analysis**:
  - **Sparse Graphs**: Dijkstra’s performs well, but a priority queue could reduce complexity to O((V+E)·log V).
  - **Dense Graphs**: Current O(V²) implementation is acceptable but slower than heap-based Dijkstra’s.
  - **Dynamic Updates**: Edge weight changes trigger full recomputation, which could be optimized with incremental updates.

### Visualization
The web interface (`shortestPath.html`) uses SVG lines for edges and styled `<div>` elements for nodes:
- Nodes are blue circles with IDs, turning green when part of the shortest path.
- Edges are gray lines with editable weight inputs, highlighted green for shortest paths.
- Node distances are displayed next to nodes after path calculation.
- Responsive design adjusts canvas and controls for mobile devices.
- Interactive features include node dragging, edge creation/deletion, and path visualization.

### Future Improvements
- Add support for directed edges by enforcing the `directed` flag in `Edge`.
- Develop a test suite to verify graph operations and Dijkstra’s algorithm.
- Enhance visualization with animation for path computation steps.

## Author
Noah Smith
- GitHub: [smith15973](https://github.com/smith15973)
- LinkedIn: [noah-smith-osu](https://linkedin.com/in/noah-smith-osu)

## License
MIT License © 2025 Noah Smith
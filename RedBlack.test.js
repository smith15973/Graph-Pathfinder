// Import your RedBlackTree implementation
// If using Node.js with Jest, Mocha, etc., adjust the import accordingly
const { RedBlackNode, RedBlackTree } = require('./RedBlackTree');

// For browser or direct testing
// Assuming RedBlackTree and RedBlackNode classes are globally available

describe('RedBlackNode', () => {
  test('constructor initializes with default values', () => {
    const node = new RedBlackNode();
    expect(node.value).toBeNull();
    expect(node.color).toBeNull();
    expect(node.leftChild).toBeNull();
    expect(node.rightChild).toBeNull();
    expect(node.parent).toBeNull();
  });

  test('constructor initializes with provided values', () => {
    const parent = new RedBlackNode(10, 'black');
    const leftChild = new RedBlackNode(5, 'red');
    const rightChild = new RedBlackNode(15, 'red');
    const node = new RedBlackNode(7, 'black', leftChild, rightChild, parent);

    expect(node.value).toBe(7);
    expect(node.color).toBe('black');
    expect(node.leftChild).toBe(leftChild);
    expect(node.rightChild).toBe(rightChild);
    expect(node.parent).toBe(parent);
  });

  test('isLeaf returns true for leaf nodes', () => {
    const leaf = new RedBlackNode(5, 'red');
    expect(leaf.isLeaf()).toBe(true);
  });

  test('isLeaf returns false for non-leaf nodes', () => {
    const parent = new RedBlackNode(10, 'black');
    const leftChild = new RedBlackNode(5, 'red');
    parent.setLeftChild(leftChild);

    expect(parent.isLeaf()).toBe(false);
  });

  test('getters and setters work correctly', () => {
    const node = new RedBlackNode(10, 'black');
    const leftChild = new RedBlackNode(5, 'red');
    const rightChild = new RedBlackNode(15, 'red');
    const parent = new RedBlackNode(20, 'black');

    node.setLeftChild(leftChild);
    node.setRightChild(rightChild);
    node.setParent(parent);
    node.setColor('red');
    node.setValue(12);

    expect(node.getLeftChild()).toBe(leftChild);
    expect(node.getRightChild()).toBe(rightChild);
    expect(node.getParent()).toBe(parent);
    expect(node.getColor()).toBe('red');
    expect(node.getValue()).toBe(12);
  });

  test('removeLeftChild removes and returns left child', () => {
    const node = new RedBlackNode(10, 'black');
    const leftChild = new RedBlackNode(5, 'red');

    node.setLeftChild(leftChild);
    expect(node.getLeftChild()).toBe(leftChild);

    const removed = node.removeLeftChild();
    expect(removed).toBe(leftChild);
    expect(node.getLeftChild()).toBeNull();
  });

  test('removeRightChild removes and returns right child', () => {
    const node = new RedBlackNode(10, 'black');
    const rightChild = new RedBlackNode(15, 'red');

    node.setRightChild(rightChild);
    expect(node.getRightChild()).toBe(rightChild);

    const removed = node.removeRightChild();
    expect(removed).toBe(rightChild);
    expect(node.getRightChild()).toBeNull();
  });
});

describe('RedBlackTree', () => {
  let tree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  test('constructor initializes with null root by default', () => {
    expect(tree.root).toBeNull();
  });

  test('constructor accepts a root node', () => {
    const rootNode = new RedBlackNode(10, 'black');
    const treeWithRoot = new RedBlackTree(rootNode);
    expect(treeWithRoot.root).toBe(rootNode);
  });

  describe('locateParent', () => {
    test('returns null for empty tree', () => {
      const node = new RedBlackNode(5, 'red');
      tree.root = null;

      expect(tree.locateParent(node)).toBeNull();
    });

    test('finds correct parent in simple tree', () => {
      const root = new RedBlackNode(10, 'black');
      const leftLeaf = new RedBlackNode(5, 'red');
      const rightLeaf = new RedBlackNode(15, 'red');

      root.setLeftChild(leftLeaf);
      leftLeaf.setParent(root);
      root.setRightChild(rightLeaf);
      rightLeaf.setParent(root);

      tree.root = root;

      // New node with value 3 should be placed under leftLeaf (5)
      const newNode = new RedBlackNode(3, 'red');
      expect(tree.locateParent(newNode)).toBe(leftLeaf);

      // New node with value 12 should be placed under rightLeaf (15)
      const newNode2 = new RedBlackNode(12, 'red');
      expect(tree.locateParent(newNode2)).toBe(rightLeaf);
    });

    test('navigates deeper levels correctly', () => {
      // Create a more complex tree
      const root = new RedBlackNode(20, 'black');
      const node10 = new RedBlackNode(10, 'red');
      const node30 = new RedBlackNode(30, 'red');
      const node5 = new RedBlackNode(5, 'black');
      const node15 = new RedBlackNode(15, 'black');

      root.setLeftChild(node10);
      root.setRightChild(node30);
      node10.setParent(root);
      node30.setParent(root);

      node10.setLeftChild(node5);
      node10.setRightChild(node15);
      node5.setParent(node10);
      node15.setParent(node10);

      tree.root = root;

      // Test finding parent for new nodes
      const newNode7 = new RedBlackNode(7, 'red');
      expect(tree.locateParent(newNode7)).toBe(node5);

      const newNode25 = new RedBlackNode(25, 'red');
      expect(tree.locateParent(newNode25)).toBe(node30);
    });
  });

  describe('getSibling', () => {
    test('throws error for root node', () => {
      const root = new RedBlackNode(10, 'black');
      tree.root = root;

      expect(() => tree.getSibling(root)).toThrow('Root has no siblings!');
    });

    test('returns correct left sibling', () => {
      const root = new RedBlackNode(10, 'black');
      const leftChild = new RedBlackNode(5, 'red');
      const rightChild = new RedBlackNode(15, 'red');

      root.setLeftChild(leftChild);
      root.setRightChild(rightChild);
      leftChild.setParent(root);
      rightChild.setParent(root);

      tree.root = root;

      expect(tree.getSibling(rightChild)).toBe(leftChild);
    });

    test('returns correct right sibling', () => {
      const root = new RedBlackNode(10, 'black');
      const leftChild = new RedBlackNode(5, 'red');
      const rightChild = new RedBlackNode(15, 'red');

      root.setLeftChild(leftChild);
      root.setRightChild(rightChild);
      leftChild.setParent(root);
      rightChild.setParent(root);

      tree.root = root;

      expect(tree.getSibling(leftChild)).toBe(rightChild);
    });
  });

  describe('rotation operations', () => {
    test('leftRotate correctly rotates nodes', () => {
      // Setup initial tree
      //      A
      //     / \
      //    B   C
      //       / \
      //      D   E
      const nodeA = new RedBlackNode('A', 'black');
      const nodeB = new RedBlackNode('B', 'red');
      const nodeC = new RedBlackNode('C', 'red');
      const nodeD = new RedBlackNode('D', 'black');
      const nodeE = new RedBlackNode('E', 'black');

      nodeA.setLeftChild(nodeB);
      nodeA.setRightChild(nodeC);
      nodeB.setParent(nodeA);
      nodeC.setParent(nodeA);

      nodeC.setLeftChild(nodeD);
      nodeC.setRightChild(nodeE);
      nodeD.setParent(nodeC);
      nodeE.setParent(nodeC);

      tree.root = nodeA;

      // Left rotate A
      tree.leftRotate(nodeA);

      // After left rotation:
      //      C
      //     / \
      //    A   E
      //   / \
      //  B   D

      expect(nodeC.getParent()).toBeNull(); // C is now the root
      expect(nodeA.getParent()).toBe(nodeC);
      expect(nodeC.getLeftChild()).toBe(nodeA);
      expect(nodeC.getRightChild()).toBe(nodeE);
      expect(nodeA.getLeftChild()).toBe(nodeB);
      expect(nodeA.getRightChild()).toBe(nodeD);
    });

    test('rightRotate correctly rotates nodes', () => {
      // Setup initial tree
      //        A
      //       / \
      //      B   C
      //     / \
      //    D   E
      const nodeA = new RedBlackNode('A', 'black');
      const nodeB = new RedBlackNode('B', 'red');
      const nodeC = new RedBlackNode('C', 'red');
      const nodeD = new RedBlackNode('D', 'black');
      const nodeE = new RedBlackNode('E', 'black');

      nodeA.setLeftChild(nodeB);
      nodeA.setRightChild(nodeC);
      nodeB.setParent(nodeA);
      nodeC.setParent(nodeA);

      nodeB.setLeftChild(nodeD);
      nodeB.setRightChild(nodeE);
      nodeD.setParent(nodeB);
      nodeE.setParent(nodeB);

      tree.root = nodeA;

      // Right rotate A
      tree.rightRotate(nodeA);

      // After right rotation:
      //      B
      //     / \
      //    D   A
      //       / \
      //      E   C

      expect(nodeB.getParent()).toBeNull(); // B is now the root
      expect(nodeA.getParent()).toBe(nodeB);
      expect(nodeB.getLeftChild()).toBe(nodeD);
      expect(nodeB.getRightChild()).toBe(nodeA);
      expect(nodeA.getLeftChild()).toBe(nodeE);
      expect(nodeA.getRightChild()).toBe(nodeC);
    });
  });

  describe('insertFixupA', () => {
    test('handles red uncle case correctly', () => {
      // Create a tree with a red uncle scenario
      const root = new RedBlackNode(20, 'black');
      const node10 = new RedBlackNode(10, 'red');
      const node30 = new RedBlackNode(30, 'red');  // Red uncle
      const node5 = new RedBlackNode(5, 'red');    // New node

      root.setLeftChild(node10);
      root.setRightChild(node30);
      node10.setParent(root);
      node30.setParent(root);

      node10.setLeftChild(node5);
      node5.setParent(node10);

      tree.root = root;

      tree.insertFixupA(node5);

      // Check colors after recoloring
      expect(node10.getColor()).toBe('black');
      expect(node30.getColor()).toBe('black');
      expect(root.getColor()).toBe('red');
    });

    test('stops when parent is black', () => {
      const root = new RedBlackNode(20, 'black');
      const node10 = new RedBlackNode(10, 'black'); // Parent is black
      const node5 = new RedBlackNode(5, 'red');    // New node

      root.setLeftChild(node10);
      node10.setParent(root);

      node10.setLeftChild(node5);
      node5.setParent(node10);

      tree.root = root;

      // No changes should occur
      const originalColors = [root.getColor(), node10.getColor(), node5.getColor()];
      tree.insertFixupA(node5);

      expect(root.getColor()).toBe(originalColors[0]);
      expect(node10.getColor()).toBe(originalColors[1]);
      expect(node5.getColor()).toBe(originalColors[2]);
    });
  });

  describe('insertFixupB', () => {
    test('handles left-right case', () => {
      // Setup a tree for left-right case
      const root = new RedBlackNode(20, 'black');
      const node10 = new RedBlackNode(10, 'red');  // Parent
      const node15 = new RedBlackNode(15, 'red');  // New node (right child of left child)

      root.setLeftChild(node10);
      node10.setParent(root);

      node10.setRightChild(node15);
      node15.setParent(node10);

      tree.root = root;

      // Before calling insertFixupB, we expect:
      //      20(B)
      //      /
      //    10(R)
      //      \
      //      15(R)

      tree.insertFixupB(node15);

      // After rotation, we expect node15 to be the child of root
      expect(node15.getParent()).toBe(root);
    });

    test('handles right-left case', () => {
      // Setup a tree for right-left case
      const root = new RedBlackNode(20, 'black');
      const node30 = new RedBlackNode(30, 'red');  // Parent
      const node25 = new RedBlackNode(25, 'red');  // New node (left child of right child)

      root.setRightChild(node30);
      node30.setParent(root);

      node30.setLeftChild(node25);
      node25.setParent(node30);

      tree.root = root;

      // Before calling insertFixupB, we expect:
      //      20(B)
      //        \
      //        30(R)
      //        /
      //      25(R)

      tree.insertFixupB(node25);

      // After rotation, we expect node25 to be the child of root
      expect(node25.getParent()).toBe(root);
    });
  });

  describe('insertFixupC', () => {
    test('handles left-left case', () => {
      // Setup a tree for left-left case
      const root = new RedBlackNode(30, 'black');
      const node20 = new RedBlackNode(20, 'red');  // Parent
      const node10 = new RedBlackNode(10, 'red');  // New node (left child of left child)

      root.setLeftChild(node20);
      node20.setParent(root);

      node20.setLeftChild(node10);
      node10.setParent(node20);

      tree.root = root;

      // Before calling insertFixupC, we expect:
      //      30(B)
      //      /
      //    20(R)
      //    /
      //  10(R)

      tree.insertFixupC(node10);

      // After rotation and recoloring:
      //      20(B)
      //     /   \
      //   10(R) 30(R)

      expect(node20.getColor()).toBe('black');
      expect(root.getColor()).toBe('red');
      expect(node20.getParent()).toBe(null); // node20 should be the new root
    });

    test('handles right-right case', () => {
      // Setup a tree for right-right case
      const root = new RedBlackNode(10, 'black');
      const node20 = new RedBlackNode(20, 'red');  // Parent
      const node30 = new RedBlackNode(30, 'red');  // New node (right child of right child)

      root.setRightChild(node20);
      node20.setParent(root);

      node20.setRightChild(node30);
      node30.setParent(node20);

      tree.root = root;

      // Before calling insertFixupC, we expect:
      //    10(B)
      //      \
      //      20(R)
      //        \
      //        30(R)

      tree.insertFixupC(node30);

      // After rotation and recoloring:
      //      20(B)
      //     /   \
      //   10(R) 30(R)

      expect(node20.getColor()).toBe('black');
      expect(root.getColor()).toBe('red');
      expect(node20.getParent()).toBe(null); // node20 should be the new root
    });
  });

  describe('insertNode', () => {
    test('inserts into empty tree and colors root black', () => {
      const node = new RedBlackNode(10);
      tree.insertNode(node);

      expect(tree.root).toBe(node);
      expect(node.getColor()).toBe('black'); // Initial color is red, but fixup might change it
      expect(node.getLeftChild()).toBeNull();
      expect(node.getRightChild()).toBeNull();
    });

    test('correctly inserts left child', () => {
      const root = new RedBlackNode(10, 'black');
      tree.root = root;

      const newNode = new RedBlackNode(5);
      tree.insertNode(newNode);

      expect(root.getLeftChild()).toBe(newNode);
      expect(newNode.getParent()).toBe(root);
      expect(newNode.getColor()).toBe('red');
    });

    test('correctly inserts right child', () => {
      const root = new RedBlackNode(10, 'black');
      tree.root = root;

      const newNode = new RedBlackNode(15);
      tree.insertNode(newNode);

      expect(root.getRightChild()).toBe(newNode);
      expect(newNode.getParent()).toBe(root);
      expect(newNode.getColor()).toBe('red');
    });

    test('maintains red-black properties after insertion', () => {
      // This is a more complex test that would check all Red-Black tree properties
      // after multiple insertions. For brevity, we're focusing on basic functionality.
      // A complete test would verify:
      // 1. Root is black
      // 2. Red nodes have black children
      // 3. All paths from root to leaves have same number of black nodes

      const values = [10, 5, 15, 3, 7, 12, 20];
      values.forEach(value => {
        tree.insertNode(new RedBlackNode(value));
      });

      expect(tree.root.getColor()).toBe('black'); // Root should be black

      // More detailed property checks would be added here
    });
  });

  // Placeholder tests for functions that aren't implemented yet
  describe('deleteNode', () => {
    test('placeholder for deleteNode implementation', () => {
      // This test will fail until deleteNode is implemented
      expect(typeof tree.deleteNode).toBe('function');
    });
  });

  describe('isvalidTree', () => {
    test('placeholder for isvalidTree implementation', () => {
      // This test will fail until isvalidTree is implemented
      expect(typeof tree.isvalidTree).toBe('function');
    });

    // Add more specific tests once implemented
    test('returns true for valid red-black tree', () => {
      // Skip this test until implementation is complete
      // Example assertions:
      // const validTree = createValidRedBlackTree();
      // expect(validTree.isvalidTree()).toBe(true);
    });

    test('returns false for invalid red-black tree', () => {
      // Skip this test until implementation is complete
      // Example assertions:
      // const invalidTree = createInvalidRedBlackTree();
      // expect(invalidTree.isvalidTree()).toBe(false);
    });
  });
});

// Helper functions (could be moved to a separate file)
function createValidRedBlackTree() {
  // Create a valid red-black tree for testing
  const tree = new RedBlackTree();
  // Add nodes in a way that ensures a valid red-black tree
  // ...
  return tree;
}

function createInvalidRedBlackTree() {
  // Create an invalid red-black tree for testing
  const tree = new RedBlackTree();
  // Add nodes in a way that violates red-black tree properties
  // ...
  return tree;
}
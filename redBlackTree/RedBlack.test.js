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
    expect(node.getLeftChild()).toBeNull();
    expect(node.getRightChild()).toBeNull();
    expect(node.parent).toBeNull();
  });

  test('constructor initializes with provided values', () => {
    const parent = new RedBlackNode(10, 'black');
    const leftChild = new RedBlackNode(5, 'red');
    const rightChild = new RedBlackNode(15, 'red');
    const node = new RedBlackNode(7, 'black', leftChild, rightChild, parent);

    expect(node.value).toBe(7);
    expect(node.color).toBe('black');
    expect(node.getLeftChild()).toBe(leftChild);
    expect(node.getRightChild()).toBe(rightChild);
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


});


describe('RedBlackTree Insertion Stress Tests', () => {
  let tree;

  beforeEach(() => {
    tree = new RedBlackTree(); // Assumes RedBlackTree class exists
  });

  // Helper function to check if root is black
  const isRootBlack = (tree) => {
    return tree.root === null || tree.root.getColor() === 'black';
  };

  // Helper function to check if red nodes have black children
  const hasValidRedNodes = (node) => {
    if (node === null) return true;
    if (node.getColor() === 'red') {
      if (node.getLeftChild() && node.getLeftChild().getColor() === 'red') return false;
      if (node.getRightChild() && node.getRightChild().getColor() === 'red') return false;
    }
    return hasValidRedNodes(node.getLeftChild()) && hasValidRedNodes(node.getRightChild());
  };

  // Helper function to check black height consistency
  const checkBlackHeight = (node) => {
    if (node === null) return 1; // Count black height including null leaf
    const leftHeight = checkBlackHeight(node.getLeftChild());
    const rightHeight = checkBlackHeight(node.getRightChild());
    if (leftHeight === -1 || rightHeight === -1 || leftHeight !== rightHeight) {
      return -1; // Invalid black height
    }
    return leftHeight + (node.getColor() === 'black' ? 1 : 0);
  };

  // Test 1: Sequential ascending insertions
  test('maintains properties after ascending sequential insertions', () => {
    const values = Array.from({ length: 20 }, (_, i) => i + 1); // 1 to 20
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1); // Valid black height
  });

  // Test 2: Sequential descending insertions
  test('maintains properties after descending sequential insertions', () => {
    const values = Array.from({ length: 20 }, (_, i) => 20 - i); // 20 to 1
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Test 3: Zig-zag pattern insertions to trigger complex rotations
  test('maintains properties after zig-zag insertions', () => {
    const values = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Test 4: Large random dataset
  test('maintains properties after large random insertions', () => {
    const values = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Test 5: Edge case with extreme values
  test('maintains properties with extreme value insertions', () => {
    const values = [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      0,
      -1000000,
      1000000,
      1,
      -1
    ];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Test 6: Insertions causing left-right and right-left rotations
  test('maintains properties after insertions triggering complex rotations', () => {
    const values = [10, 20, 15]; // Triggers right-left rotation
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    // Add more to trigger left-right rotation
    tree.insertNode(new RedBlackNode(5));
    tree.insertNode(new RedBlackNode(7));

    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });
});

describe('RedBlackTree Deletion Tests', () => {
  let tree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  // Helper functions to verify Red-Black tree properties
  const isRootBlack = (tree) => {
    return tree.root === null || tree.root.getColor() === 'black';
  };

  const hasValidRedNodes = (node) => {
    if (node === null) return true;
    if (node.getColor() === 'red') {
      if (node.getLeftChild() && node.getLeftChild().getColor() === 'red') return false;
      if (node.getRightChild() && node.getRightChild().getColor() === 'red') return false;
    }
    return hasValidRedNodes(node.getLeftChild()) && hasValidRedNodes(node.getRightChild());
  };

  const checkBlackHeight = (node) => {
    if (node === null) return 1; // Count black height including null leaf
    const leftHeight = checkBlackHeight(node.getLeftChild());
    const rightHeight = checkBlackHeight(node.getRightChild());
    if (leftHeight === -1 || rightHeight === -1 || leftHeight !== rightHeight) {
      return -1; // Invalid black height
    }
    return leftHeight + (node.getColor() === 'black' ? 1 : 0);
  };

  // Basic deletion tests
  test('deleteNode should remove a leaf node correctly', () => {
    // Set up a simple tree
    const values = [10, 5, 15];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    tree.deleteNode(5); // Delete a leaf

    expect(tree.findNode(5)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  test('deleteNode should correctly remove a node with one child', () => {
    // Create a tree where 15 has one child (20)
    const values = [10, 5, 15, 20];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    tree.deleteNode(15); // Delete a node with one child

    expect(tree.findNode(15)).toBeNull();
    expect(tree.findNode(20)).not.toBeNull(); // The child should still be in the tree
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  test('deleteNode should correctly remove a node with two children', () => {
    // Create a tree where 10 has two children (5 and 15)
    const values = [10, 5, 15, 3, 7, 12, 20];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    tree.deleteNode(10); // Delete root (has two children)

    expect(tree.findNode(10)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  test('deleteNode should handle the case when node does not exist', () => {

    const values = [10, 5, 15];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    const node = tree.deleteNode(100); // Try to delete a node that doesn't exist
    expect(node).toBe(null)
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  test('deleteNode should maintain properties after deleting the root', () => {
    const values = [10, 5, 15];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    tree.deleteNode(10); // Delete the root

    expect(tree.findNode(10)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Case-specific tests for red-black tree deletion scenarios
  test('deleteNode should handle deleting a red leaf correctly', () => {
    // First, create a controlled tree where we know a specific leaf will be red
    // Insert nodes in a specific order to create a predictable structure
    const rootNode = new RedBlackNode(10, 'black');
    const leftNode = new RedBlackNode(5, 'black');
    const rightNode = new RedBlackNode(15, 'black');
    const redLeaf = new RedBlackNode(3, 'red');

    rootNode.setLeftChild(leftNode);
    rootNode.setRightChild(rightNode);
    leftNode.setParent(rootNode);
    rightNode.setParent(rootNode);
    leftNode.setLeftChild(redLeaf);
    redLeaf.setParent(leftNode);

    tree.root = rootNode;

    // Delete the red leaf
    tree.deleteNode(3);

    expect(tree.findNode(3)).toBeNull();
    expect(leftNode.getLeftChild()).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Complex deletions that would trigger rebalancing
  test('deleteNode should handle complex deletion with rebalancing', () => {
    // Create a more complex tree that will require rebalancing
    const values = [50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Delete multiple nodes in succession
    tree.deleteNode(25);
    expect(tree.findNode(25)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    tree.deleteNode(50);
    expect(tree.findNode(50)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    tree.deleteNode(12);
    expect(tree.findNode(12)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Test deletion scenarios that would trigger double black fixes
  test('deleteNode should correctly fix double black cases', () => {
    // Create a tree where deletion will result in a double black situation
    const values = [20, 10, 30, 5, 15, 25, 40];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Delete nodes that will cause a double black scenario
    tree.deleteNode(5);
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    tree.deleteNode(15);
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    tree.deleteNode(10);
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Stress tests for deletion
  test('should maintain properties after multiple random insertions and deletions', () => {
    // Insert a bunch of values randomly
    const valuesToInsert = Array.from({ length: 50 }, () => Math.floor(Math.random() * 1000));
    const uniqueValues = [...new Set(valuesToInsert)]; // Remove duplicates

    uniqueValues.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Delete half of the values randomly
    const valuesToDelete = uniqueValues.slice(0, Math.floor(uniqueValues.length / 2));

    valuesToDelete.forEach(value => {
      tree.deleteNode(value);
      expect(tree.findNode(value)).toBeNull();
    });

    // Check tree properties still hold
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    // Check that remaining values are still in the tree
    const remainingValues = uniqueValues.filter(val => !valuesToDelete.includes(val));
    remainingValues.forEach(value => {
      expect(tree.findNode(value)).not.toBeNull();
    });
  });

  // Edge cases
  test('deleteNode should handle deleting the last node', () => {
    tree.insertNode(new RedBlackNode(10));
    tree.deleteNode(10);

    expect(tree.root).toBeNull();
  });

  test('deleteNode should do nothing on empty tree', () => {
    const node = tree.deleteNode(10);

    expect(node).toBeNull();
    expect(tree.root).toBeNull();
  });

  // Tests for specific edge cases in fixDoubleBlack
  test('fixDoubleBlack should handle sibling with red child cases correctly', () => {
    // Create a specific tree structure to test the sibling with red child case
    // This requires careful construction to create a predictable tree
    // where we can test the red sibling/nephew scenarios

    // First, let's create a tree where deletion will lead to a black sibling
    // with a red outer nephew
    const values = [20, 10, 30, 5, 15, 25, 40, 27];
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Verify initial structure
    expect(tree.findNode(20)).not.toBeNull();
    expect(tree.findNode(10)).not.toBeNull();
    expect(tree.findNode(5)).not.toBeNull();

    // Delete a node that will trigger the case we want to test
    tree.deleteNode(5);

    expect(tree.findNode(5)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);

    // Now delete another node to trigger inner nephew scenario
    tree.deleteNode(15);

    expect(tree.findNode(15)).toBeNull();
    expect(isRootBlack(tree)).toBe(true);
    expect(hasValidRedNodes(tree.root)).toBe(true);
    expect(checkBlackHeight(tree.root)).not.toBe(-1);
  });

  // Add a test for multiple deletions in ascending order
  test('maintains properties after multiple ascending deletions', () => {
    const values = Array.from({ length: 20 }, (_, i) => i + 1); // 1 to 20
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Delete in ascending order
    for (let i = 1; i <= 10; i++) {
      tree.deleteNode(i);
      expect(tree.findNode(i)).toBeNull();
      expect(isRootBlack(tree)).toBe(true);
      expect(hasValidRedNodes(tree.root)).toBe(true);
      expect(checkBlackHeight(tree.root)).not.toBe(-1);
    }
  });

  // Add a test for multiple deletions in descending order
  test('maintains properties after multiple descending deletions', () => {
    const values = Array.from({ length: 20 }, (_, i) => i + 1); // 1 to 20
    values.forEach(value => {
      tree.insertNode(new RedBlackNode(value));
    });

    // Delete in descending order
    for (let i = 20; i > 10; i--) {
      tree.deleteNode(i);
      expect(tree.findNode(i)).toBeNull();
      expect(isRootBlack(tree)).toBe(true);
      expect(hasValidRedNodes(tree.root)).toBe(true);
      expect(checkBlackHeight(tree.root)).not.toBe(-1);
    }
  });
});
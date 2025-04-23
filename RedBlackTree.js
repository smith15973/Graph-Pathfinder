class RedBlackTree {
    constructor(rootNode = null) {
        this.root = rootNode;
    }

    getRoot() {
        return this.root;
    }

    reset() {
        this.root = null;
    }

    locateParent(node) {
        let parent = null;
        let traversalNode = this.root;
        while (traversalNode !== null) {
            parent = traversalNode;
            if (node.value < traversalNode.value) {
                traversalNode = traversalNode.getLeftChild();
            } else {
                traversalNode = traversalNode.getRightChild();
            }
        }
        return parent;
    }

    getSibling(node) {
        if (node.parent === null) {
            throw new Error("Root has no siblings!");
        }
        const parent = node.parent;
        return parent.getLeftChild() === node ? parent.getRightChild() : parent.getLeftChild();
    }

    insertFixupA(node) {
        while (node !== this.root && node.getParent().getColor() === 'red') {
            const grandparent = node.getParent().getParent();
            if (!grandparent) break;

            const isParentLeftChild = grandparent.getLeftChild() === node.getParent();
            const uncle = isParentLeftChild ? grandparent.getRightChild() : grandparent.getLeftChild();

            // Case A: Uncle is red
            if (uncle && uncle.getColor() === 'red') {
                node.getParent().setColor('black');
                uncle.setColor('black');
                grandparent.setColor('red');
                node = grandparent; // Move up to continue checking
            } else {
                // Uncle is black or null - break to handle in cases B and C
                break;
            }
        }
        return node;
    }

    insertFixupB(node) {
        if (node === this.root || node.getParent() === null) return node;
        if (node.getParent().getColor() === 'black') return node;

        const parent = node.getParent();
        const grandparent = parent.getParent();
        if (!grandparent) return node;

        const isParentLeftChild = grandparent.getLeftChild() === parent;

        // Case B: Node is an inner grandchild - need rotation to make it outer
        if (isParentLeftChild && node === parent.getRightChild()) {
            this.leftRotate(parent);
            return parent; // Return the original parent which is now the child
        } else if (!isParentLeftChild && node === parent.getLeftChild()) {
            this.rightRotate(parent);
            return parent; // Return the original parent which is now the child
        }

        return node; // No change needed
    }

    insertFixupC(node) {
        if (node === this.root || node.getParent() === null) return;
        if (node.getParent().getColor() === 'black') return;

        const parent = node.getParent();
        const grandparent = parent.getParent();
        if (!grandparent) return;

        const isParentLeftChild = grandparent.getLeftChild() === parent;

        // Case C: Node is an outer grandchild - rotate grandparent
        if (isParentLeftChild && node === parent.getLeftChild()) {
            this.rightRotate(grandparent);
            parent.setColor('black');
            grandparent.setColor('red');
        } else if (!isParentLeftChild && node === parent.getRightChild()) {
            this.leftRotate(grandparent);
            parent.setColor('black');
            grandparent.setColor('red');
        }
    }

    insertFixup(node) {
        node = this.insertFixupA(node);
        node = this.insertFixupB(node);
        this.insertFixupC(node);
        this.root.setColor('black');
    }


    leftRotate(node) {
        const rightChild = node.getRightChild();
        if (!rightChild) return; // Cannot rotate

        const parent = node.getParent();

        // Update parent links
        rightChild.setParent(parent);
        if (!parent) {
            this.root = rightChild;
        } else if (parent.getLeftChild() === node) {
            parent.setLeftChild(rightChild);
        } else {
            parent.setRightChild(rightChild);
        }

        // Move rightChild's left subtree to node's right subtree
        const rightLeftChild = rightChild.getLeftChild();
        node.setRightChild(rightLeftChild);
        if (rightLeftChild) {
            rightLeftChild.setParent(node);
        }

        // Put node as rightChild's left child
        rightChild.setLeftChild(node);
        node.setParent(rightChild);
    }

    rightRotate(node) {
        const leftChild = node.getLeftChild();
        if (!leftChild) return; // Cannot rotate

        const parent = node.getParent();

        // Update parent links
        leftChild.setParent(parent);
        if (!parent) {
            this.root = leftChild;
        } else if (parent.getLeftChild() === node) {
            parent.setLeftChild(leftChild);
        } else {
            parent.setRightChild(leftChild);
        }

        // Move leftChild's right subtree to node's left subtree
        const leftRightChild = leftChild.getRightChild();
        node.setLeftChild(leftRightChild);
        if (leftRightChild) {
            leftRightChild.setParent(node);
        }

        // Put node as leftChild's right child
        leftChild.setRightChild(node);
        node.setParent(leftChild);
    }

    insertNode(node) {
        const parentNode = this.locateParent(node);
        node.setParent(parentNode);
        if (parentNode === null) {
            this.root = node;
        } else if (node.value < parentNode.value) {
            parentNode.setLeftChild(node);
        } else {
            parentNode.setRightChild(node);
        }
        node.setLeftChild(null);
        node.setRightChild(null);
        node.setColor('red');
        this.insertFixup(node);
    }

    findNode(value) {
        let traversalNode = this.root;
        while (traversalNode && traversalNode.getValue() !== value) {
            if (value < traversalNode.getValue()) {
                traversalNode = traversalNode.getLeftChild();
            } else {
                traversalNode = traversalNode.getRightChild();
            }
        }
        return traversalNode;
    }

    deleteNode(value) {
        // Find the node to delete
        const nodeToDelete = this.findNode(value);
        if (!nodeToDelete) {
            alert('Element does not Exist');
            return;
        }

        // Save if the node to be deleted is black (will need fixing if true)
        const isBlack = nodeToDelete.getColor() === 'black';

        // Case 1: Node has two children
        if (nodeToDelete.getLeftChild() && nodeToDelete.getRightChild()) {
            // Find successor (smallest node in right subtree)
            const successor = this.findMinimum(nodeToDelete.getRightChild());

            // Copy successor value to the node
            nodeToDelete.setValue(successor.getValue());

            // We'll delete the successor node directly instead of recursing
            this.removeNodeDirectly(successor);

            // Fix Red-Black properties if successor was black
            if (successor.getColor() === 'black') {
                this.fixDoubleBlack(null, successor.getParent());
            }
        }
        // Case 2: Node has at most one child
        else {
            this.removeNodeDirectly(nodeToDelete);

            // Fix Red-Black properties if deleted node was black
            if (isBlack) {
                const replacement = nodeToDelete.getLeftChild() || nodeToDelete.getRightChild();
                if (replacement && replacement.getColor() === 'red') {
                    // Just color the replacement black and we're done
                    replacement.setColor('black');
                } else {
                    this.fixDoubleBlack(replacement, nodeToDelete.getParent());
                }
            }
        }

        // Ensure root is black
        if (this.root) {
            this.root.setColor('black');
        }
    }

    // Helper to directly remove a node without recursion
    removeNodeDirectly(node) {
        // Determine the replacement (child if any)
        const replacement = node.getLeftChild() || node.getRightChild();

        // Update parent pointers
        if (node === this.root) {
            this.root = replacement;
            if (replacement) {
                replacement.setParent(null);
            }
        } else {
            const parent = node.getParent();
            if (parent.getLeftChild() === node) {
                parent.setLeftChild(replacement);
            } else {
                parent.setRightChild(replacement);
            }

            if (replacement) {
                replacement.setParent(parent);
            }
        }
    }

    // Fix the "double black" problem in red-black trees
    fixDoubleBlack(node, parent) {
        if (!parent) return;

        // Determine if node is left or right child
        const isLeftChild = parent.getLeftChild() === node;
        let sibling = isLeftChild ? parent.getRightChild() : parent.getLeftChild();

        // Case 1: Sibling is RED
        if (sibling && sibling.getColor() === 'red') {
            parent.setColor('red');
            sibling.setColor('black');

            if (isLeftChild) {
                this.leftRotate(parent);
            } else {
                this.rightRotate(parent);
            }

            // Update sibling after rotation
            sibling = isLeftChild ? parent.getRightChild() : parent.getLeftChild();
        }

        // Case 2: Sibling is BLACK with two BLACK children
        const leftNephewBlack = !sibling?.getLeftChild() || sibling.getLeftChild().getColor() === 'black';
        const rightNephewBlack = !sibling?.getRightChild() || sibling.getRightChild().getColor() === 'black';

        if (leftNephewBlack && rightNephewBlack) {
            // Color sibling red
            if (sibling) sibling.setColor('red');

            // If parent is red, color it black and we're done
            if (parent.getColor() === 'red') {
                parent.setColor('black');
            }
            // If parent is black, it becomes double black, recurse upward
            else {
                this.fixDoubleBlack(parent, parent.getParent());
            }
            return;
        }

        // Case 3: Sibling is BLACK with at least one RED child
        if (sibling) {
            // Determine if red nephew is on the outer or inner side
            const outerNephewRed = isLeftChild ?
                (sibling.getRightChild() && sibling.getRightChild().getColor() === 'red') :
                (sibling.getLeftChild() && sibling.getLeftChild().getColor() === 'red');

            const innerNephewRed = isLeftChild ?
                (sibling.getLeftChild() && sibling.getLeftChild().getColor() === 'red') :
                (sibling.getRightChild() && sibling.getRightChild().getColor() === 'red');

            // Case 3a: Outer nephew is RED
            if (outerNephewRed) {
                // Sibling gets parent's color
                sibling.setColor(parent.getColor());
                // Parent becomes black
                parent.setColor('black');

                // Outer nephew becomes black
                if (isLeftChild) {
                    if (sibling.getRightChild()) sibling.getRightChild().setColor('black');
                    this.leftRotate(parent);
                } else {
                    if (sibling.getLeftChild()) sibling.getLeftChild().setColor('black');
                    this.rightRotate(parent);
                }
            }
            // Case 3b: Inner nephew is RED
            else if (innerNephewRed) {
                // Get the inner nephew
                const innerNephew = isLeftChild ? sibling.getLeftChild() : sibling.getRightChild();

                // Nephew gets parent's color
                innerNephew.setColor(parent.getColor());
                // Parent becomes black
                parent.setColor('black');

                // Double rotation
                if (isLeftChild) {
                    this.rightRotate(sibling);
                    this.leftRotate(parent);
                } else {
                    this.leftRotate(sibling);
                    this.rightRotate(parent);
                }
            }
        }
    }


    // Find minimum value node in a subtree
    findMinimum(node) {
        let current = node;
        while (current.getLeftChild()) {
            current = current.getLeftChild();
        }
        return current;
    }

    // Find maximum value node in a subtree
    findMaximum(node) {
        let current = node;
        while (current.getRightChild()) {
            current = current.getRightChild();
        }
        return current;
    }
}

class RedBlackNode {
    constructor(value = null, color = null, leftChild = null, rightChild = null, parent = null) {
        this.value = value;
        this.color = color;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.parent = parent;
    }

    getLeftChild() {
        return this.leftChild;
    }

    getRightChild() {
        return this.rightChild;
    }

    setLeftChild(leftChild = null) {
        this.leftChild = leftChild;
    }

    setRightChild(rightChild = null) {
        this.rightChild = rightChild;
    }

    removeLeftChild() {
        const leftChild = this.leftChild;
        this.leftChild = null;
        return leftChild;
    }

    removeRightChild() {
        const rightChild = this.rightChild;
        this.rightChild = null;
        return rightChild;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }

    getParent() {
        return this.parent;
    }

    setParent(parent) {
        this.parent = parent;
    }
}

// module.exports = { RedBlackNode, RedBlackTree };
// Export for Node.js (CommonJS)
// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
// module.exports = { RedBlackNode, RedBlackTree };
// }

// Export for browsers (global scope)
export { RedBlackNode, RedBlackTree };
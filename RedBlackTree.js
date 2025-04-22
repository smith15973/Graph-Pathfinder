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

    deleteNode() {

    }


    isvalidTree() {

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

    isLeaf() {
        return this.leftChild === null && this.rightChild === null;
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
class RedBlackTree {
    constructor(rootNode = null) {
        this.root = rootNode;
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
        while (node !== this.root && node.getParent().getColor() !== 'black') {
            const parentSibling = this.getSibling(node.getParent());
            if (parentSibling.getColor() === 'black') return;
            node.getParent().setColor('black');
            parentSibling.setColor('black');
            node = node.getParent().getParent();
            node.setColor('red');
        }
    }

    insertFixupB(node) {
        if (node === this.root || node.getParent() === null) return;
        if (node.getParent().getColor() === 'black') return;
        
        const parent = node.getParent();
        const grandparent = parent.getParent();
        if (!grandparent) return; // Handle case when there's no grandparent
        
        // Case: node is outer grandchild - no rotation needed here
        
        // Case: node is inner grandchild - needs rotation to make it outer
        if (node === parent.getRightChild() && parent === grandparent.getLeftChild()) {
            this.leftRotate(parent);
            // Now the old parent is the child of node
            // For fixupC to work correctly, we return the original parent
            // return parent;
        } else if (node === parent.getLeftChild() && parent === grandparent.getRightChild()) {
            this.rightRotate(parent);
            // Same logic as above
            // return parent;
        }
        
        // return node; // Return the original node if no changes were made
    }
    /*
    insertFixupB(node) {
        if (node === this.root && node.getParent().getColor() === 'black') return;
        const parent = node.getParent();
        const grandparent = parent.getParent();
        if (node === parent.getRightChild() && parent === grandparent.getLeftChild()) {
            node = parent;
            this.leftRotate(parent);
        } else if (node === parent.getLeftChild() && parent === grandparent.getRightChild()) {
            node = parent;
            this.rightRotate(parent);
        }
    }
     */

    insertFixupC(node) {
        if (node === this.root || node.getParent().getColor() === 'black') {
            return;
        }
        const parent = node.getParent();
        const grandparent = parent.getParent();
        if (node === parent.getLeftChild() && parent === grandparent.getLeftChild()) {
            this.rightRotate(grandparent);
            parent.setColor('black');
            grandparent.setColor('red');
        } else if (node === parent.getRightChild() && parent === grandparent.getRightChild()) {
            this.leftRotate(grandparent);
            parent.setColor('black');
            grandparent.setColor('red');
        }
    }

    insertFixup(node) {
        this.insertFixupA(node)
        this.insertFixupB(node)
        this.insertFixupC(node)
        this.root.setColor('black');
    }

    leftRotate(node) {
        const parent = node.getParent();
        const rightChild = node.getRightChild();

        //change parent child
        if (parent) {
            parent.getLeftChild() === node ? parent.setLeftChild(rightChild) : parent.setRightChild(rightChild);
        }

        //set right child to the parent
        rightChild.setParent(parent);

        //set the rotated node's right child to be the left node of its current right
        node.setRightChild(rightChild.getLeftChild());

        //set rotated node's parent to its right child
        node.setParent(rightChild);

        //set the right childs left child to be the original rotated node
        rightChild.setLeftChild(node);

    }

    rightRotate(node) {
        const parent = node.getParent();
        const leftChild = node.getLeftChild();

        //change parent child
        if (parent) {
            parent.getRightChild() === node ? parent.setRightChild(leftChild) : parent.setLeftChild(leftChild);
        }

        //set left child to the parent
        leftChild.setParent(parent);

        //set the rotated node's left child to be the right node of its current left
        node.setLeftChild(leftChild.getRightChild());

        //set rotated node's parent to its left child
        node.setParent(leftChild);

        //set the right childs left child to be the original rotated node
        leftChild.setRightChild(node);
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

module.exports = { RedBlackNode, RedBlackTree };
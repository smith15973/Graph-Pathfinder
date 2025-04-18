class RedBlackTree {
    constructor(rootNode = null) {
        this.root = rootNode;
    }

    locateParent(node) {
        let parent = null;
        let traversalNode = this.root;
        while (!traversalNode.isLeaf()) {
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

    insertFixup(node) {

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
import { ArrayDataSource, SelectionModel } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { expand } from "@nova-ui/bits";


interface FoodNode {
    name: string;
    children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
    {
        name: "Vegetables",
        children: [
            {
                name: "Green",
                children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
            },
            {
                name: "Orange",
                children: [{ name: "Pumpkins" }, { name: "Carrots" }],
            },
            {
                name: "Red",
            },
        ],
    },
    {
        name: "Fruit",
        children: [
            { name: "Apple" },
            { name: "Banana" },
            { name: "Fruit loops" },
        ],
    },
    {
        name: "Meat",
    },
];


@Component({
    selector: "nui-tree-checkbox-example",
    templateUrl: "tree-checkbox.example.component.html",
    styleUrls: ["tree-checkbox.example.component.less"],
    host: { id: "nui-tree-checkbox-example" },
    animations: [expand],
})
export class TreeCheckboxExampleComponent {
    public treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    public dataSource = new ArrayDataSource(TREE_DATA);
    public selectionModel = new SelectionModel<FoodNode>(true);

    public hasChild = (_: number, node: FoodNode): boolean => !!node?.children?.length;

    /** Whether all the descendants of the node are selected. */
    public descendantsAllSelected(node: FoodNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => this.selectionModel.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    public descendantsPartiallySelected(node: FoodNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.selectionModel.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the branch selection. Select/deselect all the descendants node */
    public branchItemSelectionToggle(node: FoodNode): void {
        this.selectionModel.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.selectionModel.isSelected(node)
            ? this.selectionModel.select(...descendants)
            : this.selectionModel.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.selectionModel.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf item selection. Check all the parents to see if they changed */
    public leafItemSelectionToggle(node: FoodNode): void {
        this.selectionModel.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /** Checks all the parents when a leaf node is selected/unselected */
    private checkAllParentsSelection(node: FoodNode): void {
        let parent: FoodNode | undefined = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    private checkRootNodeSelection(node: FoodNode): void {
        const nodeSelected = this.selectionModel.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.length > 0 && descendants.every(child => this.selectionModel.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.selectionModel.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.selectionModel.select(node);
        }
    }

    /** Get the parent node of a node */
    private getParentNode(node: FoodNode): FoodNode | undefined {
        let parent: FoodNode | undefined;

        // Don't need to get parent if node on the 0 level
        if (TREE_DATA.find(n => n === node)) {
            return;
        }

        const search = (n: FoodNode): FoodNode | undefined => {
            if (parent || !n.children) {
                return;
            }
            if (n.children.find(i => i === node)) {
                parent = n;
                return;
            }
            return n.children.find(search);
        };

        // invoke search on the level 0 items
        TREE_DATA.forEach(search);

        if (!parent) {
            throw new Error("Parent wasn't found");
        }

        return parent;
    }
}

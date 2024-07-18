import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";

const { View } = ReactNative;

const unpatch = after("render", View, (_, res) => {
    // Function to recursively traverse React tree and replace "-" with " "
    const traverseAndReplace = (node: any) => {
        if (typeof node === "string") {
            return node.replace(/-/g, " ");
        } else if (Array.isArray(node)) {
            return node.map(traverseAndReplace);
        } else if (typeof node === "object" && node !== null) {
            const newNode: any = { ...node };
            if (newNode.children) {
                newNode.children = traverseAndReplace(newNode.children);
            }
            return newNode;
        }
        return node;
    };

    // Find the node containing channel name text
    const textChannel = findInReactTree(res, r =>
        r?.props?.children?.props?.children === "channel-name"
    );

    if (!textChannel) return;

    // Replace "-" with " " in the children of the found node
    const updatedChildren = traverseAndReplace(textChannel.props.children);

    // Update the node with the modified children
    textChannel.props.children = updatedChildren;

    return res;
});

export const onUnload = () => unpatch();

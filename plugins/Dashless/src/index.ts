import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";

const { View } = ReactNative;

const unpatch = after("render", View, (_, res) => {
    // Find the parent TextChannel component
    const parentTextChannel = findInReactTree(res, r => (
        r?.props?.children &&
        r.props.children.type?.name === "TextChannel"
    ));

    if (!parentTextChannel) return;

    // Function to recursively modify children
    const modifyChildren = (node) => {
        if (typeof node === "string") {
            return node.replace(/-/g, " ");
        } else if (Array.isArray(node)) {
            return node.map(modifyChildren);
        } else if (node && typeof node === "object") {
            // Check if this node is a TextChannel and modify children if necessary
            if (node.type?.name === "TextChannel" && node.props?.children) {
                node.props.children = modifyChildren(node.props.children);
            }
            // Recursively traverse other props
            Object.keys(node).forEach(key => {
                if (node[key] && typeof node[key] === "object") {
                    node[key] = modifyChildren(node[key]);
                }
            });
        }
        return node;
    };

    // Modify children under the parent TextChannel component
    parentTextChannel.props.children = modifyChildren(parentTextChannel.props.children);

    return res; // Return the modified tree
});

export const onUnload = () => unpatch();

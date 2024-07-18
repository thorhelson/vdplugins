import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";

const { View } = ReactNative;

const unpatch = after("render", View, (_, res) => {
    // Find TextChannel components
    const textChannels = findInReactTree(res, r => (
        r?.props?.children &&
        r.props.children.type?.name === "TextChannel"
    ));

    if (!textChannels) return;

    // Function to recursively traverse and modify children
    const traverseAndModify = (component) => {
        if (component.props.children && typeof component.props.children === "string") {
            component.props.children = component.props.children.replace(/-/g, " ");
        }

        // Recursively traverse child components
        if (component.props.children && typeof component.props.children === "object") {
            React.Children.forEach(component.props.children, child => {
                traverseAndModify(child);
            });
        }
    };

    // Traverse through each TextChannel component found
    textChannels.forEach(textChannel => {
        traverseAndModify(textChannel);
    });

    return res; // Return the modified tree
});

export const onUnload = () => unpatch();

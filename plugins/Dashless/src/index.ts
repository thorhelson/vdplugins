import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";

const { View } = ReactNative;

const unpatch = after("render", View, (_, res) => {
    const anonymousForwardRefs = findInReactTree(res, r => (
        typeof r?.props?.children === "string" && r.props.children.includes("-")
    ));
    
    if (!anonymousForwardRefs) return;
    
    anonymousForwardRefs.forEach(anonymousRef => {
        anonymousRef.props.children = anonymousRef.props.children.replace(/-/g, " ");
    });
    
    return res; // Return the modified result
});

export const onUnload = () => unpatch();

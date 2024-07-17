// https://github.com/ssense1337/enmity-plugins/blob/main/Dashless/src/index.tsx
import { ReactNative } from "@vendetta/metro/common"
import { after } from "@vendetta/patcher"
import { findInReactTree } from "@vendetta/utils"

const { View } = ReactNative

const unpatch = after("render", View, (_: any, res: any) => {
    const textChannel = findInReactTree(res, (r: any) => r?.props?.channel?.name && r?.props?.hasOwnProperty?.("isRulesChannel"))
    if (!textChannel) return
    after("type", textChannel.type, (_: any, res: any) => {
        const textChannelName = findInReactTree(res, (r: any) => typeof r?.children === "string")
        if (!textChannelName) return
        textChannelName.children = textChannelName.children.replace(/-/g, " ")
        return res
    })
    unpatch()
})

export const onUnload = () => unpatch()

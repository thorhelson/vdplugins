import { before, after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findByProps } from "@vendetta/metro"
import { React } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import RawPage from "./RawPage"
import { findInReactTree } from "@vendetta/utils"

const LazyActionSheet = findByProps("openLazy", "hideActionSheet")
const Navigation = findByProps("push", "pushLazy", "pop")
const DiscordNavigator = findByProps("getRenderCloseButton")
const { default: Navigator, getRenderCloseButton } = DiscordNavigator
const { FormRow, FormIcon } = Forms

const unpatch = before("openLazy", LazyActionSheet, ([component, key, msg]) => {
    const message = msg?.message
    if (key !== "MessageLongPressActionSheet" || !message) return
    component.then(instance => {
        const unpatch = after("default", instance, (_, component) => {
            React.useEffect(() => () => { unpatch() }, [])
            const buttons = findInReactTree(component, x => x?.[0]?.type?.name === "ButtonRow")
            if (!buttons) return

            const navigator = () => (
                <Navigator
                    initialRouteName="RawPage"
                    goBackOnBackPress
                    screens={{
                        RawPage: {
                            title: "ViewRaw",
                            headerLeft: getRenderCloseButton(() => Navigation.pop()),
                            render: () => <RawPage message={message} />
                        }
                    }}
                />
            )

            buttons.push(
                <FormRow
                    label="View Raw"
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_chat_bubble_16px")} />}
                    onPress={() => {
                        LazyActionSheet.hideActionSheet()
                        Navigation.push(navigator)
                    }}
                />
            )
        })
    })
})

export const onUnload = () => unpatch()

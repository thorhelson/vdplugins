(function(o,r,n,t){"use strict";var s;const i=r.findByProps("setShouldSyncAppearanceSettings"),d=r.findByProps("canUseClientThemes"),a=r.findByProps("updateBackgroundGradientPreset"),c=r.findByStoreName("ExperimentStore");(s=t.storage).isEnabled??(s.isEnabled=!1),i.setShouldSyncAppearanceSettings(!1),t.storage.theme&&t.storage.isEnabled&&a.updateBackgroundGradientPreset(t.storage.theme);const u=[n.instead("setShouldSyncAppearanceSettings",i,function(){return!1}),n.instead("canUseClientThemes",d,function(){return!0}),n.after("getUserExperimentDescriptor",c,function(e,l){let[p]=e;if(p==="2023-02_client_themes_mobile"&&l?.bucket)return{type:"user",revision:1,population:0,bucket:1,override:!0}}),n.after("updateMobilePendingThemeIndex",a,function(e){t.storage.isEnabled=e[0]>1}),n.after("updateBackgroundGradientPreset",a,function(e){t.storage.theme=e[0]})],f=function(){for(const e of u)e()};return o.onUnload=f,o})({},vendetta.metro,vendetta.patcher,vendetta.plugin);

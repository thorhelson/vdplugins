(function(e,o,c,i){"use strict";const{View:d}=o.ReactNative,p=c.after("render",d,function(s,t){const r=i.findInReactTree(t,function(n){return n?.props?.children&&typeof n.props.children=="string"&&n.props.children.includes("-")});if(r)return r.forEach(function(n){n.props.children=n.props.children.replace(/-/g," ")}),t}),a=function(){return p()};return e.onUnload=a,e})({},vendetta.metro.common,vendetta.patcher,vendetta.utils);

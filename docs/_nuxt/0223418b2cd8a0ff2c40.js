(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{199:function(e,t,r){"use strict";r.r(t);r(5),r(2),r(4);var n=r(0),c=(r(3),r(1),r(33),r(45),r(14)),o=r(100);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}var f={data:function(){return{counter:1}},fetch:function(e){return Object(c.a)(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.store,t.next=3,Promise.all([r.dispatch("sheet/getSheetsData")]);case 3:case"end":return t.stop()}}),t)})))()},computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(o.b)({users:"sheet/users"})),methods:{clicked:function(){this.counter+=1}}},O=r(49),component=Object(O.a)(f,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("b-container",{staticClass:"mt-3"},[r("h1",[e._v("Kabuka for ACNH")]),e._v(" "),r("b-card",{attrs:{title:"members"}},[r("div",{staticClass:"container"},[r("ul",e._l(e.users,(function(t){return r("li",{key:t.id},[r("span",[e._v(e._s(t.id)+" "+e._s(t.name))])])})),0),e._v(" "),r("button",{on:{click:e.clicked}},[e._v("data_test")]),e._v(" "),r("span",[e._v(e._s(e.counter))])])])],1)}),[],!1,null,null,null);t.default=component.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{221:function(e,t,r){"use strict";r.r(t);r(5),r(2),r(3),r(1),r(4);var n=r(0),c=(r(46),r(17)),o=r(99);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}var l={data:function(){return{}},fetch:function(e){return Object(c.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.store;case 1:case"end":return t.stop()}}),t)})))()},computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(o.b)({users_row:"sheet/users"}),{users:function(){return this.users_row}}),methods:{clicked:function(){this.$store.dispatch("sheet/getUsers")}}},_=r(52),component=Object(_.a)(l,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("b-container",{staticClass:"mt-3"},[r("h1",[e._v("Kabuka for ACNH")]),e._v(" "),r("b-card",{attrs:{title:"members"}},[r("div",{staticClass:"container"},[r("ul",e._l(e.users,(function(t){return r("li",{key:t.id},[r("span",[e._v(e._s(t.id))]),e._v(" "),r("span",[e._v(e._s(t.name))]),e._v(" "),r("span",[e._v(e._s(t["Island Name"]))]),e._v(" "),r("span",[e._v(e._s(t.fruits))]),e._v(" "),r("span",[e._v(e._s(t.code))])])})),0),e._v(" "),r("button",{on:{click:e.clicked}},[e._v("fetch_member")])])])],1)}),[],!1,null,null,null);t.default=component.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6023719c"],{"1b2a":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dailynews-wrapper"},[n("div",{staticClass:"top-wrapper"},[n("div",{staticClass:"header"},[t._v("Daily news ทั้งหมด")]),n("div",{staticClass:"search-wrapper"},[n("button",{attrs:{type:"submit"},on:{click:function(e){return t.getAddDailynewPage()}}},[t._v("เพิ่ม Daily News ในระบบ")])])]),n("table",{staticClass:"dailynews-table"},[t._m(0),t.dailynews.length>0?n("tbody",t._l(t.dailynews,(function(e,i){return n("tr",{key:i},[n("td",{staticStyle:{"text-align":"center"}},[t._v(t._s(100*(t.page-1)+i+1))]),n("td",{staticStyle:{"text-align":"left"}},[n("img",{staticStyle:{"border-radius":"5px"},attrs:{src:null!=e.dn_image?e.dn_image:a("cf05"),width:"60px"}})]),e.topic.length>40?n("td",{staticStyle:{"text-align":"left"}},[t._v("                          \n                    "+t._s(e.topic.substr(0,40)+"...")+"\n                ")]):t._e(),e.topic.length<40?n("td",{staticStyle:{"text-align":"left"}},[t._v(t._s(e.topic)+"  ")]):t._e(),e.header.length>40?n("td",{staticStyle:{"text-align":"left"}},[t._v("                          \n                    "+t._s(e.header.substring(0,40)+"...")+"\n                ")]):t._e(),e.header.length<40?n("td",{staticStyle:{"text-align":"left"}},[t._v(t._s(e.header)+" ")]):t._e(),n("td",{staticClass:"button-timming-td",staticStyle:{"text-align":"center"}},[t._v(" "+t._s(e.add_dtm?t.getTotalTimeMedicine(e.add_dtm):"-"))]),n("td",{staticClass:"button-td",staticStyle:{"text-align":"center"}},[n("button",{staticClass:"warning-dailynews",on:{click:function(a){return t.$router.push("/dailynews/"+e.dn_id)}}},[t._v("\n                        แก้ไข \n                    ")])])])})),0):t._e()]),n("paginate",{attrs:{"page-count":t.totalPage,"prev-text":"ก่อนหน้า","next-text":"ต่อไป","container-class":"pagination","page-class":"pagination-page","prev-class":"prev-page","next-class":"next-page","active-class":"active-page","click-handler":t.changePage,"force-page":t.page}})],1)},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",[a("tr",[a("th",{staticStyle:{width:"5%"}},[t._v("No.")]),a("th",{staticStyle:{width:"23.75%"}}),a("th",{staticStyle:{width:"23.75%"}},[t._v("topic")]),a("th",{staticStyle:{width:"23.75%"}},[t._v("header")]),a("th",{staticStyle:{width:"23.75%"}},[t._v("แก้ไขเมื่อวันที่")]),a("th",{staticStyle:{width:"5‬%"}})])])}],s=a("a24b"),c=a("c1df"),l=a.n(c),r={created:function(){this.getDailyNews(),this.reload()},data:function(){return{dailynews:[],totalPage:1,searchType:"name",searchText:""}},beforeMount:function(){this.reload()},computed:{page:function(){return this.$route.query.page?this.$route.query.page:1}},methods:{moment:l.a,getTotalTimeMedicine:function(t){return l()(t,"YYYY-MM-DD HH:mm:ss").fromNow()},reload:function(){location.refresh()},getDailyNews:function(){var t=this;s["a"].getDailynewsByPageId(this.page).then((function(e){t.dailynews=e.dailynews,t.totalPage=parseInt(e.summary.total)}))},changePage:function(t){this.$router.push("/dailynews?page=".concat(t)),this.getMembers()},getAddDailynewPage:function(){this.$router.push("/dailynews/".concat(null))}}},d=r,o=(a("ad9b"),a("2877")),u=Object(o["a"])(d,n,i,!1,null,null,null);e["default"]=u.exports},a24b:function(t,e,a){"use strict";var n=a("883d");e["a"]={getDailynewsByPageId:function(t){return n["b"].api.get("/dailynews/page/".concat(t)).then((function(t){return t.data}))},deleteDailynews:function(t){return n["b"].api.delete("/dailynews/".concat(t)).then((function(t){return t.data}))},getDailynewsById:function(t){return console.log(t),n["b"].api.get("/dailynews/".concat(t)).then((function(t){return t.data}))},updateDailynews:function(t,e){return n["b"].api.patch("/dailynews/".concat(t),e).then((function(t){return t.data}))},addDailynews:function(t){return n["b"].api.post("/dailynews",t).then((function(t){return t.data}))}}},ad9b:function(t,e,a){"use strict";var n=a("f91f"),i=a.n(n);i.a},cf05:function(t,e,a){t.exports=a.p+"img/logo.e55f94a9.png"},f91f:function(t,e,a){}}]);
/* Zugangssperre für Arbeitsbuch, Programm und Lexikon */
(function(){const inn=()=>!!ls.g("kr_login",null),ask=()=>window.openTr&&window.openTr();
const po=window.openPd;if(po)window.openPd=function(){if(!inn()){ask();return}return po.apply(this,arguments)};
const nav=document.querySelector("nav.tabs");if(nav)nav.addEventListener("click",e=>{const b=e.target.closest('button[data-t="lex"]');if(b&&!inn()){e.stopImmediatePropagation();e.preventDefault();ask()}},true);
const tb=document.getElementById("krtb");if(tb)tb.onclick=ask;
const pb=document.getElementById("pdo");if(pb)pb.addEventListener("click",e=>{if(!inn()){e.stopImmediatePropagation();e.preventDefault();ask()}},true);
})();

/* Kompatibilität für ältere iPhones und iPads (Safari vor iOS 15.4):
   rüstet <dialog> mit showModal(), close(), open, Escape und Hintergrund-Klick nach.
   Auf aktuellen Geräten tut diese Datei nichts. */
(function(){
  var D=window.HTMLDialogElement;
  if(D&&D.prototype&&typeof D.prototype.showModal==="function")return;
  var html=document.documentElement,stack=[],Z=2147483000;
  html.classList.add("nodlg");
  var st=document.createElement("style");
  st.textContent="html.nodlg dialog:not([open]){display:none!important}"+
    "html.nodlg dialog[open]{position:fixed;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);margin:0;max-height:94vh;max-width:100vw;overflow:auto;-webkit-overflow-scrolling:touch}"+
    "html.nodlg .dlgbd{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(8,4,14,.86)}"+
    "html.nodlg.dlgopen,html.nodlg.dlgopen body{overflow:hidden}";
  document.head.appendChild(st);
  function fire(el,type,cancelable){var e;try{e=new Event(type,{cancelable:!!cancelable})}catch(x){e=document.createEvent("Event");e.initEvent(type,false,!!cancelable)}return el.dispatchEvent(e)}
  function sync(){html.classList.toggle("dlgopen",stack.length>0)}
  function patch(dl){
    if(dl.__dlg)return;dl.__dlg=true;var bd=null;
    Object.defineProperty(dl,"open",{configurable:true,get:function(){return dl.hasAttribute("open")},set:function(v){if(v)dl.setAttribute("open","");else dl.removeAttribute("open")}});
    dl.returnValue="";
    dl.show=function(){dl.setAttribute("open","")};
    dl.showModal=function(){
      if(dl.hasAttribute("open"))return;
      bd=document.createElement("div");bd.className="dlgbd";
      var z=Z+stack.length*2;bd.style.zIndex=z;dl.style.zIndex=z+1;
      bd.addEventListener("click",function(){if(fire(dl,"cancel",true))dl.close()});
      /* wie die oberste Ebene echter Browser: Fenster ans Ende von <body>, damit nichts darüber liegt */
      if(dl.parentNode!==document.body)document.body.appendChild(dl);
      document.body.insertBefore(bd,dl);dl.setAttribute("open","");stack.push(dl);sync();
      var f=dl.querySelector("[autofocus],button,input,select,textarea,a[href]");
      if(f)try{f.focus({preventScroll:true})}catch(x){}
    };
    dl.close=function(v){
      if(!dl.hasAttribute("open"))return;
      if(v!==undefined)dl.returnValue=v;
      dl.removeAttribute("open");dl.style.zIndex="";
      if(bd&&bd.parentNode)bd.parentNode.removeChild(bd);bd=null;
      var i=stack.indexOf(dl);if(i>-1)stack.splice(i,1);sync();
      fire(dl,"close",false);
    };
  }
  var all=document.getElementsByTagName("dialog");
  for(var i=0;i<all.length;i++)patch(all[i]);
  /* später eingefügte Fenster ebenfalls nachrüsten */
  if(window.MutationObserver)new MutationObserver(function(){for(var i=0;i<all.length;i++)patch(all[i])}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener("keydown",function(e){
    if((e.key==="Escape"||e.key==="Esc")&&stack.length){var top=stack[stack.length-1];if(fire(top,"cancel",true))top.close()}
  });
})();

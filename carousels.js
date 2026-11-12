// Source geometry normalized from the 640 px Figma presentation to 375 px.
function carouselAsset(file){const path='assets/design/'+file;return typeof ASSETS!=='undefined'?ASSETS[path]:path;}
function makeCarousel(el,label){
 el.classList.add('horizontal-carousel');el.setAttribute('aria-label',label);el.setAttribute('role','region');el.tabIndex=0;
 el.querySelectorAll('img').forEach(img=>img.draggable=false);
 let gesture=null,lastDrag=0;
 el.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:el.scrollLeft,moved:false};});
 el.addEventListener('pointermove',e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(!gesture.moved&&Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}if(Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*1.6){gesture.moved=true;lastDrag=Date.now();el.setPointerCapture(e.pointerId);el.classList.add('is-dragging');}if(gesture.moved){e.preventDefault();el.scrollLeft=gesture.left-dx;}});
 const finish=()=>{if(gesture?.moved)lastDrag=Date.now();gesture=null;el.classList.remove('is-dragging');};
 el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',finish);
 el.addEventListener('click',e=>{if(Date.now()-lastDrag<250){e.preventDefault();e.stopImmediatePropagation();}},true);
 el.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>=Math.abs(e.deltaX)/1.6){e.preventDefault();(el.closest('#discovery')||sc).scrollTop+=e.deltaY;return;}if(Math.abs(e.deltaX)<3){e.preventDefault();return;}const before=el.scrollLeft;el.scrollLeft+=e.deltaX*.7;if(el.scrollLeft!==before)e.preventDefault();},{passive:false});
 el.addEventListener('keydown',e=>{if(e.target!==el)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();el.scrollBy({left:e.key==='ArrowRight'?180:-180,behavior:'smooth'});}});
}


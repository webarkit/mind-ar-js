(()=>{var t={508:(t,e,r)=>{const{resize:a}=r(140);t.exports={buildImageList:t=>{const e=[];let r=28/Math.min(t.width,t.height);for(;;)if(e.push(r),r*=Math.pow(2,1/3),r>=.95){r=1;break}e.push(r),e.reverse();const s=[];for(let r=0;r<e.length;r++)t.width,e[r],t.height,e[r],s.push(Object.assign(a({image:t,ratio:e[r]}),{scale:e[r]}));return s}}},589:(t,e,r)=>{const{Cumsum:a}=r(535),s=22,i=({image:t,cx:e,cy:r,sdThresh:a,imageDataCumsum:i,imageDataSqrCumsum:o})=>{if(e-s<0||e+s>=t.width)return null;if(r-s<0||r+s>=t.height)return null;const l=2025;let h=i.query(e-s,r-s,e+s,r+s);h/=l;let u=o.query(e-s,r-s,e+s,r+s);return u-=2*h*i.query(e-s,r-s,e+s,r+s),u+=l*h*h,u/l<a*a?null:(u=Math.sqrt(u),u)},o=t=>{const{image:e,cx:r,cy:a,vlen:i,tx:o,ty:l,imageDataCumsum:h,imageDataSqrCumsum:u}=t,{data:n,width:m,height:c}=e,f=s;if(r-f<0||r+f>=m)return null;if(a-f<0||a+f>=c)return null;let g=h.query(r-f,a-f,r+f,a+f),d=u.query(r-f,a-f,r+f,a+f),p=0,w=(a-f)*m+(r-f),M=(l-f)*m+(o-f),y=m-45;for(let t=0;t<45;t++){for(let t=0;t<45;t++)p+=n[w]*n[M],w+=1,M+=1;w+=y,M+=y}let x=h.query(o-f,l-f,o+f,l+f);x/=2025,p-=x*g;let q=d-g*g/2025;return 0==q?null:(q=Math.sqrt(q),1*p/(i*q))};t.exports={extract:t=>{const{data:e,width:r,height:l,scale:h}=t,u=[r*l];for(let t=0;t<u.length;t++)u[t]=!1;const n=new Float32Array(e.length);for(let t=0;t<r;t++)n[t]=-1,n[r*(l-1)+t]=-1;for(let t=0;t<l;t++)n[t*r]=-1,n[t*r+r-1]=-1;for(let t=1;t<r-1;t++)for(let a=1;a<l-1;a++){let s=t+r*a,i=0,o=0;for(let t=-1;t<=1;t++)i+=e[s+r*t+1]-e[s+r*t-1],o+=e[s+r+t]-e[s-r+t];i/=768,o/=768,n[s]=Math.sqrt((i*i+o*o)/2)}const m=new Uint32Array(1e3);for(let t=0;t<1e3;t++)m[t]=0;const c=[-1,1,-r,r];let f=0;for(let t=1;t<r-1;t++)for(let e=1;e<l-1;e++){let a=t+r*e,s=!0;for(let t=0;t<c.length;t++)if(n[a]<=n[a+c[t]]){s=!1;break}if(s){let t=Math.floor(1e3*n[a]);t>999&&(t=999),t<0&&(t=0),m[t]+=1,f+=1,u[a]=!0}}const g=.02*r*l;let d=999,p=0;for(;d>=0&&(p+=m[d],!(p>g));)d--;for(let t=0;t<u.length;t++)u[t]&&1e3*n[t]<d&&(u[t]=!1);const w=[];for(let t=0;t<e.length;t++)w[t]=e[t]*e[t];const M=new a(e,r,l),y=new a(w,r,l),x=new Float32Array(e.length);for(let e=0;e<r;e++)for(let a=0;a<l;a++){const s=a*r+e;if(!u[s]){x[s]=1;continue}const l=i({image:t,cx:e,cy:a,sdThresh:5,imageDataCumsum:M,imageDataSqrCumsum:y});if(null===l){x[s]=1;continue}let h=-1;for(let r=-10;r<=10;r++){for(let s=-10;s<=10;s++){if(s*s+r*r<=4)continue;const i=o({image:t,cx:e+s,cy:a+r,vlen:l,tx:e,ty:a,imageDataCumsum:M,imageDataSqrCumsum:y});if(null!==i&&i>h&&(h=i,h>.95))break}if(h>.95)break}x[s]=h}return(t=>{let{image:e,featureMap:r,templateSize:a,searchSize:s,occSize:l,maxSimThresh:h,minSimThresh:u,sdThresh:n,imageDataCumsum:m,imageDataSqrCumsum:c}=t;const{data:f,width:g,height:d,scale:p}=e;l=Math.floor(Math.min(e.width,e.height)/10);const w=3*(2*a+1),M=Math.floor(g/w),y=Math.floor(d/w);let x=Math.floor(g/l)*Math.floor(d/l)+M*y;const q=[],C=new Float32Array(f.length);for(let t=0;t<C.length;t++)C[t]=r[t];let S=0;for(;S<x;){let t=h,r=-1,f=-1;for(let e=0;e<d;e++)for(let a=0;a<g;a++)C[e*g+a]<t&&(t=C[e*g+a],r=a,f=e);if(-1===r)break;const p=i({image:e,cx:r,cy:f,sdThresh:0,imageDataCumsum:m,imageDataSqrCumsum:c});if(null===p){C[f*g+r]=1;continue}if(p/(2*a+1)<n){C[f*g+r]=1;continue}let w=1,M=-1;for(let a=-s;a<=s;a++){for(let i=-s;i<=s;i++){if(i*i+a*a>s*s)continue;if(0===i&&0===a)continue;const l=o({image:e,vlen:p,cx:r+i,cy:f+a,tx:r,ty:f,imageDataCumsum:m,imageDataSqrCumsum:c});if(null!==l){if(l<w&&(w=l,w<u&&w<t))break;if(l>M&&(M=l,M>.99))break}}if(w<u&&w<t||M>.99)break}if(w<u&&w<t||M>.99)C[f*g+r]=1;else{q.push({x:r,y:f}),S+=1;for(let t=-l;t<=l;t++)for(let e=-l;e<=l;e++)f+t<0||f+t>=d||r+e<0||r+e>=g||(C[(f+t)*g+(r+e)]=1)}}return q})({image:t,featureMap:x,templateSize:s,searchSize:2,occSize:16,maxSimThresh:.9,minSimThresh:.55,sdThresh:8,imageDataCumsum:M,imageDataSqrCumsum:y})}}},535:t=>{t.exports={Cumsum:class{constructor(t,e,r){this.cumsum=[];for(let t=0;t<r;t++){this.cumsum.push([]);for(let r=0;r<e;r++)this.cumsum[t].push(0)}this.cumsum[0][0]=t[0];for(let r=1;r<e;r++)this.cumsum[0][r]=this.cumsum[0][r-1]+t[r];for(let a=1;a<r;a++)this.cumsum[a][0]=this.cumsum[a-1][0]+t[a*e];for(let a=1;a<r;a++)for(let r=1;r<e;r++)this.cumsum[a][r]=t[a*e+r]+this.cumsum[a-1][r]+this.cumsum[a][r-1]-this.cumsum[a-1][r-1]}query(t,e,r,a){let s=this.cumsum[a][r];return e>0&&(s-=this.cumsum[e-1][r]),t>0&&(s-=this.cumsum[a][t-1]),t>0&&e>0&&(s+=this.cumsum[e-1][t-1]),s}}}},140:t=>{t.exports={downsampleBilinear:({image:t})=>{const{data:e,width:r,height:a}=t,s=Math.floor(r/2),i=Math.floor(a/2),o=new Float32Array(s*i),l=[0,1,r,r+1];for(let t=0;t<i;t++)for(let a=0;a<s;a++){let i=2*t*r+2*a,h=0;for(let t=0;t<l.length;t++)h+=e[i+l[t]];h*=.25,o[t*s+a]=h}return{data:o,width:s,height:i}},upsampleBilinear:({image:t,padOneWidth:e,padOneHeight:r})=>{const{width:a,height:s,data:i}=t,o=2*t.width+(e?1:0),l=2*t.height+(r?1:0),h=new Float32Array(o*l);for(let t=0;t<o;t++){const e=.5*t-.25;let r=Math.floor(e),u=Math.ceil(e);r<0&&(r=0),u>=a&&(u=a-1);for(let n=0;n<l;n++){const l=.5*n-.25;let m=Math.floor(l),c=Math.ceil(l);m<0&&(m=0),c>=s&&(c=s-1);const f=(u-e)*(c-l)*i[m*a+r]+(u-e)*(l-m)*i[c*a+r]+(e-r)*(c-l)*i[m*a+u]+(e-r)*(l-m)*i[c*a+u];h[n*o+t]=f}}return{data:h,width:o,height:l}},resize:({image:t,ratio:e})=>{const r=Math.round(t.width*e),a=Math.round(t.height*e),s=new Uint8Array(r*a);for(let i=0;i<r;i++){let o=Math.round(1*i/e),l=Math.round(1*(i+1)/e)-1;l>=t.width&&(l=t.width-1);for(let h=0;h<a;h++){let a=Math.round(1*h/e),u=Math.round(1*(h+1)/e)-1;u>=t.height&&(u=t.height-1);let n=0,m=0;for(let e=o;e<=l;e++)for(let r=a;r<=u;r++)n+=1*t.data[r*t.width+e],m+=1;s[h*r+i]=Math.floor(n/m)}}return{data:s,width:r,height:a}}}}},e={};function r(a){if(e[a])return e[a].exports;var s=e[a]={exports:{}};return t[a](s,s.exports,r),s.exports}(()=>{const{extract:t}=r(589),{buildImageList:e}=r(508);onmessage=t=>{const{data:r}=t;if("compile"===r.type){const{targetImages:t}=r,s=50/t.length;let i=0;const o=[];for(let r=0;r<t.length;r++){const l=t[r],h=e(l),u=s/h.length,n=a(h,(t=>{i+=u,postMessage({type:"progress",percent:i})}));o.push(n)}postMessage({type:"compileDone",list:o})}};const a=(e,r)=>{const a=[];for(let s=0;s<e.length;s++){const i=e[s],o=t(i),l={scale:i.scale,width:i.width,height:i.height,points:o};a.push(l),r(s)}return a}})()})();
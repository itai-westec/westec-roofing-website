'use strict';
const form=document.getElementById('lead-request');
const button=form.querySelector('button[type="submit"]');
const message=document.getElementById('mock-message');
const phone=form.querySelector('input[name="phone"]');
phone.inputMode='tel';
phone.autocomplete='tel-national';
phone.placeholder='(323) 250-3883';
phone.pattern='\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}';
phone.title='Enter your 10-digit phone number, including the area code, without +1.';
function formatPhone(value){
 let digits=value.replace(/\D/g,'');
 if(digits.length===11&&digits.startsWith('1'))digits=digits.slice(1);
 digits=digits.slice(0,10);
 if(digits.length<=3)return digits?'('+digits:'';
 if(digits.length<=6)return '('+digits.slice(0,3)+') '+digits.slice(3);
 return '('+digits.slice(0,3)+') '+digits.slice(3,6)+'-'+digits.slice(6);
}
phone.addEventListener('input',()=>{
 const previous=phone.value,position=phone.selectionStart??previous.length;
 const atEnd=position===previous.length;
 const before=previous.slice(0,position).replace(/\D/g,'').length;
 phone.value=formatPhone(previous);
 let cursor=phone.value.length;
 if(!atEnd){let count=0;cursor=0;while(cursor<phone.value.length&&count<before){if(/\d/.test(phone.value[cursor]))count++;cursor++;}}
 phone.setSelectionRange(cursor,cursor);
 phone.setCustomValidity('');
});
phone.addEventListener('invalid',()=>phone.setCustomValidity('Please enter all 10 digits of your phone number.'));
const service=document.documentElement.dataset.service;
const startedAt=Date.now(),requestId=crypto.randomUUID();
let ready=false,busy=false;
// Tracking is optional: blocked scripts must never interrupt lead capture.
let pixelReady=false,leadTracked=false;
function setupPixel(config){
 if(pixelReady||!config.live||!config.trackingEnabled||navigator.globalPrivacyControl===true)return;
 const pixelId=String(config.pixelId||'');
 if(!/^[0-9]+$/.test(pixelId))return;
 try{
 !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
 if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
 s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
 window.fbq('set','autoConfig',false,pixelId);
 window.fbq('init',pixelId);
 window.fbq('track','PageView');
 pixelReady=true;
 }catch{/* Lead capture remains available if tracking is blocked. */}
}
function trackSavedLead(result){
 if(!pixelReady||leadTracked||result.preview!==false||!result.reference||navigator.globalPrivacyControl===true)return;
 try{
 window.fbq('track','Lead',{content_name:service==='repair'?'Roof Repair':'Roof Replacement'}, {eventID:result.reference});
 leadTracked=true;
 }catch{/* A tracking error must not cause a duplicate form submission. */}
}
function show(text,error=false){message.hidden=false;message.textContent=text;message.style.color=error?'#943e2a':'#163c39';message.setAttribute('role',error?'alert':'status');}
fetch('/api/config?service='+service).then(r=>{if(!r.ok)throw Error();return r.json()}).then(config=>{
 const bar=document.querySelector('.offer-progress');
 bar.style.setProperty('--reserved-percent',(100*config.reserved/config.total)+'%');
 const labels=document.querySelector('.availability>div');
 labels.querySelector('b').textContent=config.reserved+'/'+config.total+' spots reserved';
 labels.querySelector('strong').textContent=Math.max(0,config.total-config.reserved)+' remaining';
 document.getElementById('preview-notice').hidden=config.live;
 ready=true;button.disabled=false;
 setupPixel(config);
}).catch(()=>show('The form is unavailable. Please refresh or call (323) 250-3883.',true));
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!ready||busy)return;
 busy=true;button.disabled=true;const label=button.textContent;button.textContent='Saving your request…';message.hidden=true;
 const fields=Object.fromEntries(new FormData(form));
 const params=new URLSearchParams(location.search);
 const attribution=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','campaign_id','adset_id','ad_id','fbclid'].map(k=>[k,params.get(k)||'']));
 try{
 const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,service,startedAt,requestId,attribution})});
 const result=await response.json();
 if(!response.ok)throw Error(result.error||'Unable to save your request.');
 trackSavedLead(result);
 if(result.preview){
 show('Test saved. It was not sent to Monday or Meta, and no spot was reserved.');
 button.textContent='Test Saved';form.querySelectorAll('input').forEach(input=>input.disabled=true);
 }else{
 const card=document.getElementById('lead-form');
 const thanks=document.createElement('h2');thanks.textContent='Thank you for reaching out.';
 const followup=document.createElement('p');followup.textContent='A WesTec rep will be reaching out shortly.';
 const urgent=document.createElement('p');urgent.append('Urgent? Call us 24/7 at ');
 const call=document.createElement('a');call.href='tel:+13232503883';call.textContent='(323) 250-3883';call.style.color='#163c39';call.style.fontWeight='700';call.style.textDecoration='underline';urgent.append(call);
 card.replaceChildren(thanks,followup,urgent);card.setAttribute('role','status');card.tabIndex=-1;card.focus({preventScroll:true});
 }

 }catch(error){show(error.message||'Please try again or call (323) 250-3883.',true);button.disabled=false;button.textContent=label;}
 finally{busy=false;}
});

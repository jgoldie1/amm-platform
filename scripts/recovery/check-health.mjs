const origin=process.env.FAITHVERSE_HEALTH_URL;
if(!origin) {console.log('Health URL is not configured; no production health claim.');process.exit(0)}
const url=new URL(origin);
if(url.protocol!=='https:'||url.username||url.password)throw Error('HTTPS URL required');
const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),10000);
try {
 const result=await fetch(url,{signal:controller.signal,redirect:'error',cache:'no-store'});
 if(!result.ok)throw Error('HTTP '+result.status);
 console.log('Health check passed for configured endpoint');
} finally {clearTimeout(timeout)}

#!/usr/bin/env node
// LOCAL TEST ONLY. No production credentials. Outputs short-lived tokens to terminal.
import { createHmac, randomUUID } from 'node:crypto';
const url=process.env.LIVEKIT_URL||'ws://127.0.0.1:7880';
const key=process.env.LIVEKIT_API_KEY||'devkey';
const secret=process.env.LIVEKIT_API_SECRET||'secret';
if(!/^wss?:\/\//.test(url)||secret.length<6)throw Error('Invalid local LiveKit configuration');
if(process.env.NODE_ENV==='production'||process.env.VERCEL||process.env.CI)throw Error('Local test tokens cannot be minted in hosted environments');
const room='tryamm-local-'+randomUUID();
function token(role){
 const b64=(obj)=>Buffer.from(JSON.stringify(obj)).toString('base64url');
 const now=Math.floor(Date.now()/1000);
 const grant={room,roomJoin:true,canSubscribe:true,canPublish:role==='host',canPublishData:role==='host'};
 const input=b64({alg:'HS256',typ:'JWT'})+'.'+b64({iss:key,sub:role+'-'+randomUUID(),iat:now,nbf:now-5,exp:now+600,video:grant});
 return input+'.'+createHmac('sha256',secret).update(input).digest('base64url');
}
console.log(JSON.stringify({url,room,hostToken:token('host'),viewerToken:token('viewer'),warning:'Development-only credentials and tokens; never use on a public server'},null,2));

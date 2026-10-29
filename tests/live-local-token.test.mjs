import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHmac } from 'node:crypto';
const path=new URL('../scripts/live/local-room-tokens.mjs',import.meta.url);
function run(env={}){return spawnSync(process.execPath,[path.pathname],{encoding:'utf8',env:{...process.env,CI:'',VERCEL:'',NODE_ENV:'test',LIVEKIT_URL:'ws://127.0.0.1:7880',...env}})}
function decode(jwt){const [h,p,s]=jwt.split('.');const data=JSON.parse(Buffer.from(p,'base64url').toString());const valid=createHmac('sha256','secret').update(h+'.'+p).digest('base64url')===s;return {data,valid}}
test('host and viewer tokens are short lived, signed and role fenced',()=>{const p=run();assert.equal(p.status,0,p.stderr);const result=JSON.parse(p.stdout);const host=decode(result.hostToken),viewer=decode(result.viewerToken);assert.equal(host.valid,true);assert.equal(viewer.valid,true);assert.equal(host.data.video.room,viewer.data.video.room);assert.equal(host.data.video.canPublish,true);assert.equal(viewer.data.video.canPublish,false);assert.equal(viewer.data.video.canPublishData,false);assert.ok(host.data.exp-host.data.iat<=600);assert.ok(viewer.data.exp-viewer.data.iat<=600);assert.notEqual(host.data.sub,viewer.data.sub)});
test('local token generation refuses production environment',()=>{const r=run({NODE_ENV:'production'});assert.notEqual(r.status,0);assert.match(r.stderr,/cannot be minted/)});
test('local token generation refuses CI context',()=>{const r=run({CI:'true'});assert.notEqual(r.status,0);assert.match(r.stderr,/cannot be minted/)});
test('local token generation rejects malformed websocket URL',()=>{const r=run({LIVEKIT_URL:'https://bad.example'});assert.notEqual(r.status,0);assert.match(r.stderr,/Invalid local LiveKit configuration/)});

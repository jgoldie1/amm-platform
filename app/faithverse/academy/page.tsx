'use client';
import {useState} from 'react';
const letters=[
 {name:'Aleph',glyph:'𐤀',meaning:'Ox-head association',note:'A proposed early pictographic association; pronunciation and chronology vary.'},
 {name:'Bet',glyph:'𐤁',meaning:'House association',note:'Compare forms across dated inscriptions; do not assume a single uniform ancient alphabet.'},
 {name:'Gimel',glyph:'𐤂',meaning:'Historical letter form',note:'Learn the shape and its position; proposed pictographic meanings are disputed.'},
 {name:'Dalet',glyph:'𐤃',meaning:'Door association',note:'Treat symbolic readings as interpretation rather than the lexical meaning of a word.'},
 {name:'He',glyph:'𐤄',meaning:'Historical letter form',note:'Letter shape and sound values developed across scripts and eras.'}
] as const;
export default function Academy(){
 const [i,setI]=useState(0); const [show,setShow]=useState(false);
 const item=letters[i];
 return <main style={{maxWidth:820,margin:'auto',padding:24,fontFamily:'system-ui',lineHeight:1.7}}>
 <a href="/faithverse">← FaithVerse</a><h1>Paleo-Hebrew Academy — First Lesson</h1>
 <p>Explore five early Hebrew letter forms. These are educational introductions, not claims about one universal historical pronunciation. Check dated epigraphic and academic sources when doing advanced research.</p>
 <section aria-labelledby="letter" style={{border:'2px solid #7766a5',padding:22,borderRadius:16}}>
 <h2 id="letter">{i+1} of {letters.length}: {item.name}</h2>
 <p aria-label={item.name+' letter'} style={{fontSize:90,margin:0,lineHeight:1.4}}>{item.glyph}</p>
 <button type="button" onClick={()=>setShow(v=>!v)} style={{minHeight:52,padding:12}} aria-expanded={show}>{show?'Hide teaching note':'Show teaching note'}</button>
 {show&&<div><p><strong>Study cue:</strong> {item.meaning}</p><p>{item.note}</p></div>}
 </section><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:14}}>
 <button type="button" disabled={i===0} onClick={()=>{setI(v=>v-1);setShow(false)}} style={{minHeight:52,padding:12}}>Previous letter</button>
 <button type="button" disabled={i===letters.length-1} onClick={()=>{setI(v=>v+1);setShow(false)}} style={{minHeight:52,padding:12}}>Next letter</button>
 </div><p>Research links: <a href="https://www.britannica.com/topic/Hebrew-alphabet" target="_blank" rel="noopener noreferrer">Hebrew alphabet overview</a>. Interactive voice lessons, quizzes, accounts and certifications are not yet enabled.</p>
 </main>
}
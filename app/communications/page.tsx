import { getRecoveredProduct } from '@/lib/recovered-products';

const channels=[
  ['In-App','ready for shared Omni messaging architecture'],
  ['WhatsApp','requires Meta/WhatsApp Business credentials'],
  ['SMS','requires messaging provider credentials'],
  ['Email','requires transactional email provider credentials'],
  ['Push','requires web/mobile push configuration'],
  ['Telegram','provider bot/app credentials required'],
];

export default function CommunicationsPage(){
  const product=getRecoveredProduct('whatsapp')!;
  return <main className="container">
    <div className="kicker">Omni Communications</div>
    <h1 style={{fontSize:'4rem'}}>One conversation layer. Multiple channels.</h1>
    <p className="muted">Messages are routed by user, organization, conversation, service and channel so WhatsApp does not become a disconnected second account system.</p>
    <div className="grid grid-3">{channels.map(([name,status])=><article className="card" key={name}><h2>{name}</h2><p className="muted">{status}</p></article>)}</div>
    <section className="card" style={{marginTop:16}}><h2>{product.name}</h2><p className="muted">{product.summary}</p>{product.capabilities.map(x=><span className="pill" key={x}>{x}</span>)}</section>
  </main>;
}

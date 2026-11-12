import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createContactHandler } from '../api/contact-lead';
// Cualquier acceso de red que no use el fetch inyectado hace fallar la prueba.
beforeEach(() => vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Red real prohibida en tests')))));
afterEach(() => vi.unstubAllGlobals());
const data = {name:'Persona de prueba',company:'Empresa sintética',email:'persona@example.invalid',team_size:'2-5 reclutadores',work_mode:'consultora'};
function setup(secret?: string, apiKey: string | undefined = 'synthetic-test-key') {
  let time = 0;
  const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}',{status:200}));
  const logger = {warn:vi.fn(),error:vi.fn()};
  const handler = createContactHandler({env:{RESEND_API_KEY:apiKey,TURNSTILE_SECRET_KEY:secret},fetchImpl,now:()=>time,logger});
  const call = async (body:unknown=data, method='POST', ip='192.0.2.1') => {
    const res = {code:0,body:undefined as unknown,headers:{} as Record<string,string>,
      setHeader(key:string,value:string){this.headers[key]=value;return this;},
      status(code:number){this.code=code;return this;},json(body:unknown){this.body=body;},end(){},
    };
    await handler({body,method,headers:{host:'www.fuentehr.com','x-forwarded-for':ip}},res);
    return res;
  };
  const payloads = () => fetchImpl.mock.calls.filter(([url])=>url==='https://api.resend.com/emails').map(([,init])=>JSON.parse(String(init?.body)));
  return {call,fetchImpl,logger,payloads,advance:(ms:number)=>{time+=ms;}};
}
describe('contact-lead sin red real',()=>{
  it('envía al contacto correcto, mantiene CC y solo después responde al solicitante',async()=>{
    const ctx=setup();const res=await ctx.call();expect(res.code).toBe(200);
    expect(ctx.payloads()).toEqual([
      expect.objectContaining({from:'FuenteHR <noreply@notificaciones.fuentepy.com>',to:['contacto@fuentehr.com'],cc:['frodriguez@fuentepy.com','mdominguez@fuentepy.com'],reply_to:data.email}),
      expect.objectContaining({from:'Equipo FuenteHR <comercial@notificaciones.fuentepy.com>',to:[data.email],reply_to:'contacto@fuentehr.com',subject:expect.stringContaining('dentro de las próximas 24 horas hábiles')}),
    ]);
    expect(ctx.logger.warn).toHaveBeenCalledOnce();
    for(const payload of ctx.payloads()){expect(payload.html).toContain('FuenteHR / FUENTEPY S.A.');expect(payload.html).toContain('solicitaste una demo en fuentehr.com');}
  });
  it.each([
    {},{...data,name:''},{...data,company:'  '},{...data,email:'invalid'},
    {...data,name:'a'.repeat(121)},{...data,company:'a'.repeat(161)},
    {...data,email:`${'a'.repeat(190)}@example.invalid`},{...data,phone:'a'.repeat(41)},
    {...data,message:'a'.repeat(1501)},{...data,team_size:'unlimited'},
    {...data,work_mode:'inventado'},{...data,turnstile_token:'a'.repeat(2049)},
    {...data,role:'admin'},null,[],42,'{malformed',
  ])('rechaza datos inválidos o campos extra, sin enviar %#',async body=>{
    const ctx=setup();expect((await ctx.call(body)).code).toBe(400);expect(ctx.fetchImpl).not.toHaveBeenCalled();
  });
  it('acepta una consulta mínima y los campos opcionales vacíos',async()=>{
    const ctx=setup();expect((await ctx.call({name:'Prueba',company:'Empresa',email:'p@example.invalid',work_mode:''})).code).toBe(200);
  });
  it('acepta body JSON string válido',async()=>{const ctx=setup();expect((await ctx.call(JSON.stringify(data))).code).toBe(200);});
  it('honeypot lleno devuelve ok sin notificación, autorespuesta ni verificación',async()=>{
    const ctx=setup('synthetic-secret');expect(await ctx.call({...data,website:'spam'})).toMatchObject({code:200,body:{ok:true}});expect(ctx.fetchImpl).not.toHaveBeenCalled();
  });
  it('elimina saltos de línea y controles del asunto y escapa HTML del cuerpo',async()=>{
    const ctx=setup();await ctx.call({...data,name:'<b>Persona</b>\r\nOtra',company:'<Empresa>\r\nBcc: alguien\u2028fin',message:'<script>bad</script>\nTexto'});
    const [notification,reply]=ctx.payloads();expect(notification.subject).not.toMatch(/[\r\n\u2028]/);
    expect(notification.subject).toBe('Solicitud de demo FuenteHR — <Empresa> Bcc: alguien fin');
    expect(notification.html).toContain('&lt;Empresa&gt;');expect(notification.html).not.toContain('<script>');expect(reply.html).not.toContain('<b>');
  });
  it.each(['OPTIONS','GET'])('no agrega CORS permisivo para %s',async method=>{
    const ctx=setup();const res=await ctx.call(data,method);expect(res.code).toBe(method==='OPTIONS'?204:405);
    expect(Object.keys(res.headers).some(h=>h.toLowerCase().startsWith('access-control'))).toBe(false);expect(ctx.fetchImpl).not.toHaveBeenCalled();
  });
  it('POST tampoco agrega CORS',async()=>{const ctx=setup();expect((await ctx.call()).headers['Access-Control-Allow-Origin']).toBeUndefined();});
  it('sin clave de Resend da un error genérico y no envía',async()=>{
    const ctx=setup(undefined,'');const res=await ctx.call();expect(res.code).toBe(500);expect(JSON.stringify(res.body)).not.toContain('RESEND');expect(ctx.fetchImpl).not.toHaveBeenCalled();
  });
  it('fallo de notificación no manda autorespuesta ni expone el error',async()=>{
    const ctx=setup();ctx.fetchImpl.mockResolvedValue(new Response('secret-provider-detail',{status:403}));const res=await ctx.call();
    expect(res.code).toBe(500);expect(JSON.stringify(res.body)).not.toMatch(/secret|Resend|403/);expect(ctx.fetchImpl).toHaveBeenCalledOnce();expect(ctx.logger.error).toHaveBeenCalled();
  });
  it('fallo de red no expone el mensaje del proveedor al cliente',async()=>{
    const ctx=setup();ctx.fetchImpl.mockRejectedValue(new Error('private-provider-detail'));expect((await ctx.call()).body).toEqual({ok:false,error:'No pudimos enviar tu solicitud. Probá de nuevo más tarde.'});
  });
  it('no declara éxito si falla la autorespuesta después de notificar',async()=>{
    const ctx=setup();ctx.fetchImpl.mockResolvedValueOnce(new Response('{}')).mockResolvedValueOnce(new Response('{}',{status:503}));expect((await ctx.call()).code).toBe(500);expect(ctx.payloads()).toHaveLength(2);
  });
});
describe('Turnstile opcional',()=>{
  it('con secreto y sin token no envía nada',async()=>{const ctx=setup('synthetic-secret');expect((await ctx.call()).code).toBe(400);expect(ctx.fetchImpl).not.toHaveBeenCalled();});
  it.each([
    {success:false},{success:true,hostname:'wrong.invalid',action:'contact-lead'},
    {success:true,hostname:'www.fuentehr.com',action:'wrong'},
  ])('rechaza verificación inválida %#',async result=>{
    const ctx=setup('synthetic-secret');ctx.fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify(result)));expect((await ctx.call({...data,turnstile_token:'token'})).code).toBe(400);expect(ctx.payloads()).toHaveLength(0);
  });
  it('verifica token, host y acción antes de notificación y autorespuesta',async()=>{
    const ctx=setup('synthetic-secret');ctx.fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify({success:true,hostname:'www.fuentehr.com',action:'contact-lead'})));
    expect((await ctx.call({...data,turnstile_token:'synthetic-token'})).code).toBe(200);
    expect(ctx.fetchImpl.mock.calls[0][0]).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    expect(ctx.fetchImpl.mock.calls[0][1]?.body?.toString()).toBe('secret=synthetic-secret&response=synthetic-token');
    expect(ctx.payloads()).toHaveLength(2);expect(ctx.logger.warn).not.toHaveBeenCalled();
  });
  it('falla cerrado si el servicio no responde',async()=>{
    const ctx=setup('synthetic-secret');ctx.fetchImpl.mockRejectedValueOnce(new Error('network'));expect((await ctx.call({...data,turnstile_token:'token'})).code).toBe(500);expect(ctx.payloads()).toHaveLength(0);
  });
});
describe('límites en memoria',()=>{
  it('rechaza el cuarto intento por correo ignorando mayúsculas',async()=>{
    const ctx=setup();for(let i=0;i<3;i++)expect((await ctx.call()).code).toBe(200);
    expect((await ctx.call({...data,email:data.email.toUpperCase()},'POST','192.0.2.2')).code).toBe(429);expect(ctx.payloads()).toHaveLength(6);
  });
  it('rechaza el sexto intento por IP aunque cambie el correo',async()=>{
    const ctx=setup();for(let i=0;i<5;i++)expect((await ctx.call({...data,email:`persona${i}@example.invalid`})).code).toBe(200);
    expect((await ctx.call({...data,email:'another@example.invalid'})).code).toBe(429);expect(ctx.payloads()).toHaveLength(10);
  });
  it('las ventanas se vencen por separado y permiten nuevos intentos',async()=>{
    const ctx=setup();for(let i=0;i<3;i++)await ctx.call();ctx.advance(600001);
    expect((await ctx.call()).code).toBe(429);ctx.advance(3000000);expect((await ctx.call()).code).toBe(200);
  });
});

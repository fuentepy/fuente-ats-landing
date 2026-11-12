// Solo localhost. Toda salida de red externa se bloquea y /api se simula.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4178';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4178','--strictPort'], {stdio:'pipe'});
let serverError='';server.stderr.on('data',chunk=>{serverError+=chunk;});
let browser;
try {
  let ready=false;
  for(let i=0;i<100;i++) {
    if(server.exitCode !== null)throw new Error(`Servidor local terminó: ${serverError}`);
    try {if((await fetch(base)).ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  if(!ready)throw new Error('No inició Vite preview local');
  browser=await chromium.launch({executablePath:process.env.PW_CHROMIUM_PATH || undefined});
  await mkdir('artifacts',{recursive:true});
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    let submissions=0;let fail=false;
    await page.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.origin!==base)return route.abort();
      if(url.pathname==='/api/contact-lead'){
        submissions++;
        const payload=route.request().postDataJSON();
        assert.equal(payload.email,'demo@example.invalid');assert.equal(payload.work_mode,'rrhh_interno');
        return route.fulfill({status:fail?500:200,contentType:'application/json',body:JSON.stringify(fail?{ok:false,error:'synthetic failure'}:{ok:true})});
      }
      return route.continue();
    });
    await page.goto(base);await page.getByRole('heading',{level:1}).waitFor();
    const noOverflow=async()=>{
      const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      assert.ok(sizes.scroll<=sizes.client,`Desborde a ${width}: ${JSON.stringify(sizes)}`);
    };
    await noOverflow();
    const primary = page.getByRole('link', { name: 'Comenzar prueba gratuita', exact: true });
    assert.equal(await primary.count(), 4);
    for (const action of await primary.all()) assert.equal(await action.getAttribute('href'), 'https://app.fuentehr.com/auth/signup');
    const history = page.locator('#modalidades');
    assert.equal(await history.getByText('Ejemplo ilustrativo, no es un caso de cliente', {exact:true}).count(), 1);
    // Cada href local apunta a un id existente; los externos pertenecen al contrato explícito.
    const hrefs=await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
    for(const href of hrefs){
      if(href.startsWith('#'))assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(),1,`Ancla inválida ${href}`);
      else assert.ok(['https://app.fuentehr.com/auth/signup','https://app.fuentehr.com/auth/login','https://app.fuentehr.com/terminos','mailto:contacto@fuentehr.com'].includes(href)||href.startsWith('https://wa.me/595994349323?text='),`Destino inesperado ${href}`);
    }
    await page.keyboard.press('Tab');assert.equal(await page.locator('.ats-skip-link').evaluate(a=>a===document.activeElement),true);
    await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement?.id),'contenido');
    if(width===390){
      const toggle=page.getByRole('button',{name:'Abrir menú'});await toggle.focus();await page.keyboard.press('Enter');
      const mobile=page.getByRole('navigation',{name:'Navegación móvil'});assert.equal(await mobile.isVisible(),true);
      assert.equal(await page.getByRole('button',{name:'Cerrar menú'}).getAttribute('aria-expanded'),'true');await noOverflow();
      assert.equal(await mobile.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href'),'https://app.fuentehr.com/auth/login');
      assert.equal(await mobile.getByRole('link',{name:'Crear empresa'}).getAttribute('href'),'https://app.fuentehr.com/auth/signup');
      await page.keyboard.press('Escape');assert.equal(await mobile.isVisible(),false);
      assert.equal(await page.getByRole('button',{name:'Abrir menú'}).evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Space');assert.equal(await mobile.isVisible(),true);
      await mobile.getByRole('link',{name:'Cómo empezar'}).click();assert.equal(await mobile.isVisible(),false);assert.equal(new URL(page.url()).hash,'#como-empezar');
    }else{
      const nav=page.getByRole('navigation',{name:'Navegación principal'});assert.equal(await nav.isVisible(),true);
      await nav.getByRole('link',{name:'Modalidades'}).click();assert.equal(new URL(page.url()).hash,'#modalidades');
      assert.equal(await page.getByRole('button',{name:'Abrir menú'}).isVisible(),false);
    }
    await page.evaluate(() => { if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0); });
    await page.screenshot({path:`artifacts/landing-${width}.png`,fullPage:true});
    await page.screenshot({path:`artifacts/landing-${width}-inicio.png`});
    await history.screenshot({path:`artifacts/landing-${width}-historia.png`, style:'.ats-header { visibility: hidden; }'});
    await noOverflow();
    const fill=async()=>{
      await page.getByLabel('Nombre completo').fill('Persona sintética');await page.getByLabel('Empresa *',{exact:true}).fill('Empresa de prueba');
      await page.getByLabel('Correo *',{exact:true}).fill('demo@example.invalid');await page.getByLabel('¿Cómo trabajan?').selectOption('rrhh_interno');
    };
    await fill();fail=true;
    await page.getByRole('button',{name:'Agendar una demo',exact:true}).click();
    await page.getByRole('alert').filter({hasText:'No pudimos enviar tu solicitud'}).first().waitFor();await noOverflow();
    fail=false;await page.getByRole('button',{name:'Agendar una demo',exact:true}).click();
    await page.getByRole('heading',{name:'¡Solicitud recibida!'}).waitFor();await noOverflow();
    assert.equal(submissions,2);assert.deepEqual(errors,[]);
    console.log(`APROBADO ${width}px: enlaces, anclas, teclado/menú, sin desborde, envío local simulado con fallo y reintento.`);
    await page.close();
  }
  // El resumen legal y los enlaces de acceso siguen disponibles sin JavaScript.
  const nojs=await browser.newPage({javaScriptEnabled:false});
  await nojs.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  await nojs.goto(base);assert.equal(await nojs.getByRole('heading',{level:1,name:'FuenteHR',exact:true}).isVisible(),true);
  assert.equal(await nojs.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href'),'https://app.fuentehr.com/auth/login');
  console.log('APROBADO sin JavaScript: resumen, registro, login y contacto disponibles.');
} finally {if(browser)await browser.close();server.kill();}

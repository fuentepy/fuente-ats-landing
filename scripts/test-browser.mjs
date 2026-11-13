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
    const hero=page.locator('#inicio');await hero.getByRole('img').evaluate(img=>img.decode());
    assert.equal(await page.getByRole('heading',{level:1}).count(),1);
    assert.ok((await hero.getByRole('img').boundingBox()).y<900,'El producto aparece desde la primera pantalla');
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
    const showcase=page.locator('#producto');
    const tablist=showcase.getByRole('tablist',{name:'Pantallas de FuenteHR'});
    const tabs=tablist.getByRole('tab');
    const panels=showcase.getByRole('tabpanel',{includeHidden:true});
    const screens=[
      {id:'tablero',label:'Tablero de postulaciones',file:'tablero'},
      {id:'portal',label:'Portal del cliente',file:'portal-cliente'},
      {id:'solicitudes',label:'Solicitudes de las áreas',file:'solicitudes-rrhh'},
    ];
    assert.equal(await tabs.count(),3);assert.equal(await panels.count(),3);
    const verifyScreen=async(index,focused=false)=>{
      for(let i=0;i<screens.length;i++){
        assert.equal(await tabs.nth(i).getAttribute('aria-selected'),String(i===index));
        assert.equal(await tabs.nth(i).getAttribute('tabindex'),i===index?'0':'-1');
        assert.equal(await panels.nth(i).evaluate(el=>el.hidden),i!==index);
        assert.equal(await panels.nth(i).isVisible(),i===index);
        assert.equal(await tabs.nth(i).getAttribute('aria-controls'),await panels.nth(i).getAttribute('id'));
        assert.equal(await panels.nth(i).getAttribute('aria-labelledby'),await tabs.nth(i).getAttribute('id'));
      }
      if(focused){
        assert.equal(await tabs.nth(index).evaluate(el=>el===document.activeElement),true);
        assert.notEqual(await tabs.nth(index).evaluate(el=>getComputedStyle(el).outlineStyle),'none');
      }
      const img=panels.nth(index).getByRole('img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
      assert.ok(await img.evaluate(el=>el.naturalWidth>0));
      const suffix=width===390?'movil-900':'1600';
      assert.ok((await img.evaluate(el=>el.currentSrc)).endsWith(`/capturas/${screens[index].file}-oscuro-${suffix}.webp`));
      await noOverflow();
    };
    for(let i=0;i<screens.length;i++){
      await tablist.getByRole('tab',{name:screens[i].label,exact:true}).click();await verifyScreen(i);
      await showcase.screenshot({path:`artifacts/showcase-${width}-${screens[i].id}.png`,style:'.ats-header { visibility: hidden !important; }'});
      const enlarge=panels.nth(i).getByRole('button',{name:`Ampliar captura: ${screens[i].label}`,exact:true});
      await enlarge.focus();await page.keyboard.press('Enter');
      const viewer=page.getByRole('dialog',{name:screens[i].label,exact:true});await viewer.waitFor();
      const close=viewer.getByRole('button',{name:'Cerrar captura'});
      assert.equal(await viewer.getByRole('region',{name:'Captura ampliada'}).evaluate(el=>el.scrollLeft===0&&el.scrollTop===0),true);
      assert.equal(await close.evaluate(el=>el===document.activeElement),true);
      const largeImage=viewer.getByRole('img');await largeImage.evaluate(img=>img.decode());
      assert.ok((await largeImage.evaluate(img=>img.currentSrc)).endsWith(`${screens[i].file}-oscuro-1600.webp`));
      await noOverflow();
      await page.keyboard.press('Tab');assert.equal(await viewer.getByRole('region',{name:'Captura ampliada'}).evaluate(el=>el===document.activeElement),true);
      if(width===390){await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.ats-capture-scroll').scrollLeft>0);}
      if(i===0)await page.screenshot({path:`artifacts/landing-${width}-captura-ampliada.png`});
      await page.keyboard.press('Escape');assert.equal(await viewer.isVisible(),false);
      assert.equal(await enlarge.evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Space');await viewer.waitFor();
      assert.equal(await viewer.getByRole('region',{name:'Captura ampliada'}).evaluate(el=>el.scrollLeft===0&&el.scrollTop===0),true);
      await close.click();assert.equal(await viewer.isVisible(),false);
    }
    await tabs.nth(2).focus();
    for(const [key,index] of [['Home',0],['End',2],['ArrowRight',0],['ArrowLeft',2],['ArrowLeft',1],['ArrowLeft',0],['ArrowRight',1],['ArrowRight',2],['Home',0]]){
      await page.keyboard.press(key);await verifyScreen(index,true);
    }
    await page.keyboard.press('Tab');assert.equal(await panels.nth(0).evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Shift+Tab');assert.equal(await tabs.nth(0).evaluate(el=>el===document.activeElement),true);
    const modeDetails=page.locator('#modalidades .ats-mode-detail');
    assert.equal(await modeDetails.count(),2);
    for(const detail of await modeDetails.all()){
      assert.equal(await detail.evaluate(el=>el.open),false);
      const summary=detail.locator('summary');await summary.focus();await page.keyboard.press('Enter');
      assert.equal(await detail.evaluate(el=>el.open),true);assert.equal(await detail.locator('ol').isVisible(),true);await noOverflow();
      await page.keyboard.press('Space');assert.equal(await detail.evaluate(el=>el.open),false);
    }
    for(const detail of await page.locator('#funciones .ats-feature-card details').all()){
      assert.equal(await detail.evaluate(el=>el.open),false);await detail.locator('summary').click();
      assert.equal(await detail.locator('p').isVisible(),true);await detail.locator('summary').click();
    }
    const conditions=page.locator('.ats-trial-detail');assert.equal(await conditions.evaluate(el=>el.open),false);
    await conditions.locator('summary').focus();await page.keyboard.press('Enter');
    assert.equal(await conditions.getByText('La prueba gratuita no se convierte automáticamente',{exact:false}).isVisible(),true);
    await noOverflow();await page.keyboard.press('Space');assert.equal(await conditions.evaluate(el=>el.open),false);
    await page.evaluate(() => { if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0); });
    await page.screenshot({path:`artifacts/landing-${width}.png`,fullPage:true});
    await page.screenshot({path:`artifacts/landing-${width}-inicio.png`});
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
    console.log(`APROBADO ${width}px: 3 pestañas por clic y teclado, imágenes responsive cargadas, enlaces, anclas, menú, ampliación accesible, desplegables, sin desborde y formulario local simulado.`);
    await page.close();
  }
  for(const width of [320,768,1024]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.route('**/*',route=>new URL(route.request().url()).origin===base&&route.request().method()==='GET'?route.continue():route.abort());
    await page.goto(base);await page.getByRole('heading',{level:1}).waitFor();
    await page.locator('#inicio img').evaluate(img=>img.decode());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:`artifacts/landing-${width}-inicio.png`});
    console.log(`APROBADO responsive ${width}px: portada y navegación sin desborde.`);await page.close();
  }
  // El resumen legal y los enlaces de acceso siguen disponibles sin JavaScript.
  const nojs=await browser.newPage({javaScriptEnabled:false});
  await nojs.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  await nojs.goto(base);assert.equal(await nojs.getByRole('heading',{level:1,name:'FuenteHR',exact:true}).isVisible(),true);
  assert.equal(await nojs.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href'),'https://app.fuentehr.com/auth/login');
  console.log('APROBADO sin JavaScript: resumen, registro, login y contacto disponibles.');
} finally {if(browser)await browser.close();server.kill();}

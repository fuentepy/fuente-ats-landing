// Exclusivamente localhost. Red externa bloqueada; /api siempre simulado.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:4178';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4178','--strictPort'],{stdio:'pipe'});
let serverError='';server.stderr.on('data',chunk=>{serverError+=chunk;});
let browser;
const screens=[
  {id:'tablero',label:'Tablero de postulaciones',file:'tablero'},
  {id:'portal',label:'Portal del cliente',file:'portal-cliente'},
  {id:'solicitudes',label:'Solicitudes de las áreas',file:'solicitudes-rrhh'},
];
const destinations=['https://app.fuentehr.com/auth/signup','https://app.fuentehr.com/auth/login','https://app.fuentehr.com/terminos','mailto:contacto@fuentehr.com'];
async function blockExternal(page,localHandler){
  await page.route('**/*',route=>{
    if(new URL(route.request().url()).origin!==base)return route.abort();
    return localHandler?localHandler(route):route.continue();
  });
}
async function noOverflow(page){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desborde horizontal');}
async function verifyControlNote(page,theme,width){
  const note=page.locator('.ats-control-note'),detail=note.locator('details'),heading=note.getByRole('heading',{level:3});
  assert.equal(await detail.evaluate(el=>el.open),false);
  await note.scrollIntoViewIfNeeded();
  const measure=()=>note.evaluate(el=>{const h=el.querySelector('h3').getBoundingClientRect(),outer=el.getBoundingClientRect();return {width:h.width,top:h.top-outer.top};});
  const before=await measure();
  const summary=detail.locator('summary');await summary.focus();await page.keyboard.press('Enter');
  const paragraph=detail.locator('p');await paragraph.waitFor();
  await note.screenshot({path:`artifacts/control-note-${theme}-${width}-open.png`,style:'.ats-header { visibility:hidden !important; }'});
  const after=await measure();
  assert.ok(Math.abs(before.width-after.width)<=1,`El detalle cambió el ancho del título: ${before.width} -> ${after.width} (${theme}, ${width}px)`);
  assert.ok(Math.abs(before.top-after.top)<=1,'El título saltó al expandir el detalle');
  assert.ok(await note.evaluate(el=>[...el.querySelectorAll('h3,ul,details,p')].every(child=>{const r=child.getBoundingClientRect(),outer=el.getBoundingClientRect();return r.left>=outer.left&&r.right<=outer.right;})),'Contenido fuera del aviso');
  assert.ok(await paragraph.evaluate(el=>el.scrollWidth<=el.clientWidth),'Texto recortado dentro del aviso');
  await noOverflow(page);await page.keyboard.press('Space');
  assert.equal(await detail.evaluate(el=>el.open),false);
  assert.equal(await summary.evaluate(el=>el===document.activeElement),true);
}
async function assertTheme(page,theme){
  await page.waitForFunction(theme=>document.documentElement.getAttribute('data-web-theme')===theme,theme);
  const logo=theme==='light'?'/logo-fuentehr-light.png':'/logo-fuentehr.png';
  await page.waitForFunction(logo=>[...document.querySelectorAll('.ats-nav-bar img,.ats-footer img')].length===2&&[...document.querySelectorAll('.ats-nav-bar img,.ats-footer img')].every(img=>img.getAttribute('src')===logo),logo);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),theme);
  if(await page.locator('[data-sonner-toaster]').count())await page.waitForFunction(theme=>document.querySelector('[data-sonner-toaster]')?.getAttribute('data-theme')===theme,theme);
}
try{
  let ready=false;
  for(let i=0;i<100;i++){
    if(server.exitCode!==null)throw new Error(`Servidor local terminó: ${serverError}`);
    try{if((await fetch(base)).ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  if(!ready)throw new Error('No inició el servidor local');
  browser=await chromium.launch({executablePath:process.env.PW_CHROMIUM_PATH||undefined});
  await mkdir('artifacts',{recursive:true});
  for(const theme of ['dark','light'])for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    await page.addInitScript(theme=>{localStorage.setItem('fuentehr-web-theme',theme);localStorage.setItem('fuentepy-theme','light');},theme);
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    let submissions=0,fail=false,expectedMode='rrhh_interno';
    await blockExternal(page,route=>{
      const url=new URL(route.request().url());
      if(url.pathname==='/api/contact-lead'){
        submissions++;const payload=route.request().postDataJSON();
        assert.equal(payload.email,'demo@example.invalid');assert.equal(payload.work_mode,expectedMode);
        assert.equal(payload.team_size,'2-5 reclutadores');
        return route.fulfill({status:fail?500:200,contentType:'application/json',body:JSON.stringify(fail?{ok:false,error:'synthetic failure'}:{ok:true})});
      }
      return route.continue();
    });
    await page.goto(base);await page.getByRole('heading',{level:1}).waitFor();await assertTheme(page,theme);await noOverflow(page);
    assert.equal(await page.getByRole('heading',{level:1}).count(),1);
    assert.equal((await page.locator('#inicio h1').innerText()).replace(/\s+/g,' ').trim(),'Tu selección, en un solo lugar.');
    await page.locator('#inicio img').evaluate(img=>img.decode());
    for(const element of ['.ats-theme-toggle','.ats-nav-toggle','.ats-header-login']){
      const control=page.locator(element);
      if(await control.isVisible())assert.ok(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44;}),`Control fuera de pantalla: ${element}`);
    }
    const hrefs=await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
    for(const href of hrefs){
      if(href.startsWith('#'))assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(),1,`Ancla inválida ${href}`);
      else assert.ok(destinations.includes(href)||href.startsWith('https://wa.me/595994349323?text='),`Destino inesperado ${href}`);
    }
    await page.keyboard.press('Tab');assert.equal(await page.locator('.ats-skip-link').evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement?.id),'contenido');
    if(width===390){
      const toggle=page.getByRole('button',{name:'Abrir menú'});await toggle.focus();await page.keyboard.press('Enter');
      const nav=page.getByRole('navigation',{name:'Navegación móvil'});assert.equal(await nav.isVisible(),true);
      assert.equal(await nav.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href'),destinations[1]);
      assert.equal(await nav.getByRole('link',{name:'Crear empresa'}).getAttribute('href'),destinations[0]);
      await noOverflow(page);await page.keyboard.press('Escape');assert.equal(await nav.isVisible(),false);
      assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Space');await nav.getByRole('link',{name:'Cómo empezar'}).click();assert.equal(await nav.isVisible(),false);
      assert.equal(new URL(page.url()).hash,'#como-empezar');
    }else{
      const nav=page.getByRole('navigation',{name:'Navegación principal'});await nav.getByRole('link',{name:'Modalidades'}).click();
      assert.equal(new URL(page.url()).hash,'#modalidades');
    }
    const showcase=page.locator('#producto'),tablist=showcase.getByRole('tablist',{name:'Pantallas de FuenteHR'});
    const tabs=tablist.getByRole('tab'),panels=showcase.getByRole('tabpanel',{includeHidden:true});
    assert.equal(await tabs.count(),3);assert.equal(await panels.count(),3);
    const verify=async(index,focused=false)=>{
      for(let i=0;i<3;i++){
        assert.equal(await tabs.nth(i).getAttribute('aria-selected'),String(i===index));
        assert.equal(await tabs.nth(i).getAttribute('tabindex'),i===index?'0':'-1');
        assert.equal(await panels.nth(i).evaluate(el=>el.hidden),i!==index);
        assert.equal(await panels.nth(i).isVisible(),i===index);
        assert.equal(await tabs.nth(i).getAttribute('aria-controls'),await panels.nth(i).getAttribute('id'));
        assert.equal(await panels.nth(i).getAttribute('aria-labelledby'),await tabs.nth(i).getAttribute('id'));
      }
      if(focused){assert.equal(await tabs.nth(index).evaluate(el=>el===document.activeElement),true);assert.notEqual(await tabs.nth(index).evaluate(el=>getComputedStyle(el).outlineStyle),'none');}
      const img=panels.nth(index).getByRole('img');await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());
      assert.ok(await img.evaluate(img=>img.naturalWidth>0));
      assert.ok((await img.evaluate(img=>img.currentSrc)).endsWith(`${screens[index].file}-oscuro-${width===390?'movil-900':'1600'}.webp`));await noOverflow(page);
    };
    for(let i=0;i<3;i++){
      await tabs.nth(i).click();await verify(i);
      await showcase.screenshot({path:`artifacts/showcase-${theme}-${width}-${screens[i].id}.png`,style:'.ats-header { visibility:hidden !important; }'});
      const enlarge=panels.nth(i).getByRole('button',{name:`Ampliar captura: ${screens[i].label}`,exact:true});await enlarge.focus();await page.keyboard.press('Enter');
      const viewer=page.getByRole('dialog',{name:screens[i].label,exact:true});await viewer.waitFor();
      const close=viewer.getByRole('button',{name:'Cerrar captura'}),scroll=viewer.getByRole('region',{name:'Captura ampliada'});
      assert.equal(await close.evaluate(el=>el===document.activeElement),true);
      assert.equal(await scroll.evaluate(el=>el.scrollLeft===0&&el.scrollTop===0),true);
      await viewer.getByRole('img').evaluate(img=>img.decode());await page.keyboard.press('Tab');assert.equal(await scroll.evaluate(el=>el===document.activeElement),true);
      if(width===390){await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.ats-capture-scroll').scrollLeft>0);}
      await noOverflow(page);if(i===0)await page.screenshot({path:`artifacts/zoom-${theme}-${width}.png`});
      await page.keyboard.press('Escape');assert.equal(await viewer.isVisible(),false);assert.equal(await enlarge.evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Space');await viewer.waitFor();assert.equal(await scroll.evaluate(el=>el.scrollLeft===0&&el.scrollTop===0),true);await close.click();
    }
    await tabs.nth(2).focus();
    for(const [key,index] of [['Home',0],['End',2],['ArrowRight',0],['ArrowLeft',2],['ArrowLeft',1],['ArrowLeft',0],['ArrowRight',1],['ArrowRight',2],['Home',0]]){await page.keyboard.press(key);await verify(index,true);}
    await page.keyboard.press('Tab');assert.equal(await panels.nth(0).evaluate(el=>el===document.activeElement),true);
    await page.keyboard.press('Shift+Tab');assert.equal(await tabs.nth(0).evaluate(el=>el===document.activeElement),true);
    for(const detail of await page.locator('#modalidades details,#funciones details').all()){
      assert.equal(await detail.evaluate(el=>el.open),false);await detail.locator('summary').focus();await page.keyboard.press('Enter');
      assert.equal(await detail.evaluate(el=>el.open),true);await noOverflow(page);await page.keyboard.press('Space');assert.equal(await detail.evaluate(el=>el.open),false);
    }
    await verifyControlNote(page,theme,width);
    const conditions=page.locator('#prueba-gratuita details');await conditions.locator('summary').click();assert.equal(await conditions.evaluate(el=>el.open),true);await conditions.locator('summary').click();
    await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo(0,0);});
    await page.screenshot({path:`artifacts/landing-${theme}-${width}.png`,fullPage:true,animations:'disabled'});
    await page.screenshot({path:`artifacts/landing-${theme}-${width}-inicio.png`,animations:'disabled'});
    const themeButton=page.getByRole('button',{name:theme==='dark'?'Usar modo claro':'Usar modo oscuro'});
    await themeButton.focus();await page.keyboard.press('Space');await assertTheme(page,theme==='dark'?'light':'dark');
    assert.equal(await page.evaluate(()=>localStorage.getItem('fuentepy-theme')),'light');
    await page.keyboard.press('Enter');await assertTheme(page,theme);
    await page.getByLabel('Nombre completo').fill('Persona sintética');await page.getByLabel('Empresa *',{exact:true}).fill('Empresa de prueba');await page.getByLabel('Correo *',{exact:true}).fill('demo@example.invalid');
    const optional=page.locator('.ats-form-extra');assert.equal(await optional.evaluate(el=>el.open),false);
    assert.equal(await page.getByLabel('¿Cómo trabajan?').isVisible(),false);await optional.locator('summary').focus();await page.keyboard.press('Enter');
    await page.getByLabel('¿Cómo trabajan?').selectOption('rrhh_interno');await page.keyboard.press('Tab');
    fail=true;await page.getByRole('button',{name:'Agendar una demo',exact:true}).click();await page.getByRole('alert').filter({hasText:'No pudimos enviar tu solicitud'}).first().waitFor();await page.locator('[data-sonner-toaster]').waitFor({state:'attached'});await page.locator('[data-sonner-toast][data-type="error"]').first().waitFor();await assertTheme(page,theme);await noOverflow(page);
    fail=false;await page.getByRole('button',{name:'Agendar una demo',exact:true}).click();await page.getByRole('heading',{name:'¡Solicitud recibida!'}).waitFor();assert.equal(submissions,2);
    // También se puede enviar sin abrir ni completar información opcional.
    expectedMode='';await page.reload();await page.getByRole('heading',{level:1}).waitFor();await assertTheme(page,theme);
    await page.getByLabel('Nombre completo').fill('Persona sintética');await page.getByLabel('Empresa *',{exact:true}).fill('Empresa de prueba');await page.getByLabel('Correo *',{exact:true}).fill('demo@example.invalid');
    assert.equal(await page.locator('.ats-form-extra').evaluate(el=>el.open),false);
    await page.getByRole('button',{name:'Agendar una demo',exact:true}).click();await page.getByRole('heading',{name:'¡Solicitud recibida!'}).waitFor();assert.equal(submissions,3);
    assert.deepEqual(errors,[]);console.log(`APROBADO ${theme} ${width}px: tema, logos, navegación, 3 pestañas, ampliación, teclado, desplegables, formulario opcional y fallo/reintento locales.`);await page.close();
  }
  for(const theme of ['dark','light'])for(const width of [320,768,1024]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.addInitScript(theme=>localStorage.setItem('fuentehr-web-theme',theme),theme);await blockExternal(page);
    await page.goto(base);await page.getByRole('heading',{level:1}).waitFor();await assertTheme(page,theme);await noOverflow(page);
    await verifyControlNote(page,theme,width);
    for(const control of await page.locator('.ats-header-actions > *').all())if(await control.isVisible())assert.ok(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));
    await page.screenshot({path:`artifacts/landing-${theme}-${width}-inicio.png`,animations:'disabled'});console.log(`APROBADO responsive ${theme} ${width}px.`);await page.close();
  }
  // Persistencia, clave independiente y ausencia de escritura predeterminada.
  const preferenceContext=await browser.newContext();const preference=await preferenceContext.newPage();await blockExternal(preference);await preference.goto(base);await preference.getByRole('heading',{level:1}).waitFor();await assertTheme(preference,'dark');
  assert.equal(await preference.evaluate(()=>localStorage.getItem('fuentehr-web-theme')),null);
  await preference.evaluate(()=>localStorage.setItem('fuentepy-theme','light'));
  await preference.getByRole('button',{name:'Usar modo claro'}).click();await preference.reload();await preference.getByRole('heading',{level:1}).waitFor();await assertTheme(preference,'light');
  assert.equal(await preference.evaluate(()=>localStorage.getItem('fuentehr-web-theme')),'light');assert.equal(await preference.evaluate(()=>localStorage.getItem('fuentepy-theme')),'light');
  await preference.getByRole('button',{name:'Usar modo oscuro'}).click();await preference.reload();await preference.getByRole('heading',{level:1}).waitFor();await assertTheme(preference,'dark');const mirror=await preference.context().newPage();await blockExternal(mirror);await mirror.goto(base);await mirror.getByRole('heading',{level:1}).waitFor();
  await mirror.getByRole('button',{name:'Usar modo claro'}).click();await assertTheme(preference,'light');
  await mirror.getByRole('button',{name:'Usar modo oscuro'}).click();await assertTheme(preference,'dark');
  await mirror.close();await preferenceContext.close();console.log('APROBADO persistencia, sincronización entre pestañas y aislamiento de la preferencia del ATS.');
  // Primer fondo antes de React, incluso con el bundle demorado.
  for(const saved of ['dark','light',null,'invalid']){
    const page=await browser.newPage();if(saved!==null)await page.addInitScript(value=>localStorage.setItem('fuentehr-web-theme',value),saved);
    let release;const gate=new Promise(resolve=>{release=resolve;});
    await blockExternal(page,async route=>{const u=new URL(route.request().url());if(u.pathname.startsWith('/assets/')&&u.pathname.endsWith('.js'))await gate;return route.continue();});
    try{
      await page.goto(base,{waitUntil:'commit'});const expected=saved==='light'?'light':'dark';
      await page.waitForFunction(expected=>{const root=document.documentElement;return root.getAttribute('data-web-theme')===expected&&getComputedStyle(root).backgroundColor===(expected==='light'?'rgb(255, 255, 255)':'rgb(9, 17, 13)');},expected);
      assert.equal(await page.locator('#root').innerHTML(),'');assert.equal(await page.evaluate(()=>localStorage.getItem('fuentehr-web-theme')),saved);
      release();await page.getByRole('heading',{level:1}).waitFor();await assertTheme(page,expected);console.log(`APROBADO primer fondo con preferencia ${saved??'ausente'}.`);
    }finally{release();await page.close();}
  }
  const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{value:{getItem(){throw new Error('Blocked');},setItem(){throw new Error('Blocked');}}}));await blockExternal(blocked);
  await blocked.goto(base);await blocked.getByRole('heading',{level:1}).waitFor();await assertTheme(blocked,'dark');await blocked.getByRole('button',{name:'Usar modo claro'}).click();await assertTheme(blocked,'light');await blocked.close();console.log('APROBADO almacenamiento bloqueado: tema utilizable durante la visita.');
  const animated=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await blockExternal(animated);await animated.goto(base);await animated.getByRole('heading',{level:1}).waitFor();
  await animated.waitForFunction(()=>document.querySelector('.landing-ats').classList.contains('ats-motion'));
  for(const item of await animated.locator('.ats-reveal').all()){
    await item.scrollIntoViewIfNeeded();const handle=await item.elementHandle();await animated.waitForFunction(el=>getComputedStyle(el).opacity==='1',handle);
  }
  await animated.close();console.log('APROBADO aparición al hacer scroll con movimiento habilitado.');
  const nojs=await browser.newPage({javaScriptEnabled:false});await blockExternal(nojs);await nojs.goto(base);
  assert.equal(await nojs.getByRole('heading',{level:1,name:'FuenteHR',exact:true}).isVisible(),true);assert.equal(await nojs.getByRole('link',{name:'Iniciar sesión'}).getAttribute('href'),destinations[1]);await nojs.close();console.log('APROBADO resumen y acceso sin JavaScript.');
}finally{if(browser)await browser.close();server.kill();}

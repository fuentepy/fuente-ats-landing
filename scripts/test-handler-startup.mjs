// Compila con tsc e importa el JS emitido con Node ESM, sin loaders de Vitest/Vite.
import { mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'fuentehr-handler-esm-'));
try {
  const compilation = spawnSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'),
    '-p', join(root, 'tsconfig.api.json'), '--noEmit', 'false', '--rootDir', root, '--outDir', output],
    {cwd:root,encoding:'utf8'});
  if (compilation.status !== 0) throw new Error(`tsc falló:\n${compilation.stdout}${compilation.stderr}`);
  await writeFile(join(output,'package.json'), '{"type":"module"}');
  // Simula las dependencias disponibles de un paquete instalado, sin resolver imports locales.
  await symlink(join(root,'node_modules'), join(output,'node_modules'), 'dir');
  const handlerUrl = pathToFileURL(join(output, 'api/contact-lead.js')).href;
  const probe = join(output, 'probe.mjs');
  await writeFile(probe, `
    import assert from 'node:assert/strict';
    globalThis.fetch = () => { throw new Error('Red real prohibida en prueba de arranque'); };
    const {default: handler} = await import(${JSON.stringify(handlerUrl)});
    for (const [method,expected] of [['OPTIONS',204],['GET',405]]) {
      const response = {code:0,headers:{},body:undefined,ended:false,
        setHeader(k,v){this.headers[k]=v;}, status(code){this.code=code;return this;},
        json(body){this.body=body;}, end(){this.ended=true;}};
      await handler({method,headers:{}},response);
      assert.equal(response.code,expected);
      assert.ok(!Object.keys(response.headers).some(k=>k.toLowerCase().startsWith('access-control-')));
      if(method==='GET') assert.deepEqual(response.body,{ok:false,error:'Método no permitido.'});
      else assert.equal(response.ended,true);
      console.log(method + ' ' + expected + ': aprobado, sin CORS permisivo');
    }
    console.log('Arranque Node ESM nativo: aprobado');
  `);
  const result = spawnSync(process.execPath, [probe], {cwd:output,encoding:'utf8',
    env:{...process.env,RESEND_API_KEY:'',TURNSTILE_SECRET_KEY:''}});
  process.stdout.write(result.stdout ?? ''); process.stderr.write(result.stderr ?? '');
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally { await rm(output,{recursive:true,force:true}); }

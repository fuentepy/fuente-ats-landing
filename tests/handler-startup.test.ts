import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
it('el JS compilado arranca con Node ESM nativo y atiende OPTIONS/GET sin red',()=>{
  const output=execFileSync(process.execPath,['scripts/test-handler-startup.mjs'],{encoding:'utf8',timeout:45000});
  expect(output).toContain('Arranque Node ESM nativo: aprobado');
  expect(output).toContain('OPTIONS 204: aprobado, sin CORS permisivo');
  expect(output).toContain('GET 405: aprobado, sin CORS permisivo');
},60000);

import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { contactSchema as clientSchema, RESPONSE_PROMISE as clientPromise } from '../src/lib/contact-schema';
import { contactSchema as serverSchema, RESPONSE_PROMISE as serverPromise } from '../api/contact-lead';
const valid = { name:'Persona sintética',company:'Empresa de prueba',email:'persona@example.invalid' };
const email200 = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.invalid`;
const cases: [string,unknown,boolean][] = [
  ['mínimo válido',valid,true],
  ['campos opcionales ausentes', {...valid,phone:undefined,message:undefined},true],
  ['transformaciones y escape previo al envío',{...valid,name:'  Persona\r\nOtra  ',company:' Empresa\u2028Prueba ',email:' persona@example.invalid ',message:' texto '},true],
  ['nombre vacío',{...valid,name:''},false],['nombre solo controles',{...valid,name:'\r\n'},false],
  ['empresa vacía',{...valid,company:''},false],['empresa espacios',{...valid,company:'  '},false],
  ['sin nombre',{company:valid.company,email:valid.email},false],
  ['sin empresa',{name:valid.name,email:valid.email},false],
  ['sin correo',{name:valid.name,company:valid.company},false],
  ['correo inválido',{...valid,email:'not-email'},false],['correo vacío',{...valid,email:''},false],
  ['correo null',{...valid,email:null},false],['correo 200',{...valid,email:email200},true],
  ['correo 201',{...valid,email:`${email200}x`},false],
  ['campo extra',{...valid,role:'admin'},false],['objeto null',null,false],['array',[],false],['texto','payload',false],
  ['equipo vacío',{...valid,team_size:''},false],['equipo desconocido',{...valid,team_size:'100'},false],
  ['equipo null',{...valid,team_size:null},false],['modalidad desconocida',{...valid,work_mode:'otra'},false],
  ['modalidad null',{...valid,work_mode:null},false],['nombre número',{...valid,name:42},false],
];
for (const [field,max] of [['name',120],['company',160],['phone',40],['message',1500],['website',200],['turnstile_token',2048]] as const) {
  cases.push([`${field} límite ${max}`,{...valid,[field]:'a'.repeat(max)},true]);
  cases.push([`${field} excede ${max}`,{...valid,[field]:'a'.repeat(max+1)},false]);
}
for (const field of ['phone','message','website','turnstile_token'] as const) {
  cases.push([`${field} vacío`,{...valid,[field]:''},true]);
  cases.push([`${field} tipo incorrecto`,{...valid,[field]:1},false]);
}
for (const team_size of ['1 reclutador','2-5 reclutadores','6-15 reclutadores','Más de 15']) cases.push([`equipo ${team_size}`,{...valid,team_size},true]);
for (const work_mode of ['','consultora','rrhh_interno']) cases.push([`modalidad ${work_mode || 'sin elegir'}`,{...valid,work_mode},true]);
describe('paridad de validación cliente y servidor autocontenido',()=>{
  it.each(cases)('%s',(_label,input,accepted)=>{
    const client=clientSchema.safeParse(input),server=serverSchema.safeParse(input);
    expect(client.success).toBe(accepted);expect(server.success).toBe(accepted);
    if(client.success && server.success)expect(server.data).toEqual(client.data);
    if(!client.success && !server.success)expect(server.error.issues).toEqual(client.error.issues);
  });
  it('mantiene la misma promesa de respuesta sin alterar correos',()=>{expect(serverPromise).toBe(clientPromise);});
});
it('el endpoint no importa módulos relativos, ni estáticos ni dinámicos',()=>{
  const source=ts.createSourceFile('contact-lead.ts',readFileSync('api/contact-lead.ts','utf8'),ts.ScriptTarget.Latest,true);
  const relative:string[]=[];
  function inspect(node:ts.Node){
    if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith('.'))relative.push(node.moduleSpecifier.text);
    if(ts.isCallExpression(node) && (node.expression.kind===ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression)&&node.expression.text==='require'))){
      const first=node.arguments[0];if(first && ts.isStringLiteralLike(first)&&first.text.startsWith('.'))relative.push(first.text);
    }
    ts.forEachChild(node,inspect);
  }
  inspect(source);expect(relative).toEqual([]);
});

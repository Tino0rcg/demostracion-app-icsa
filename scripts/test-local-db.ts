import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabase } from '../src/lib/supabase';

async function testLocalDb() {
  console.log("=== INICIANDO PRUEBAS DE BASE DE DATOS LOCAL ===");

  // 1. Probar login de admin
  console.log("\n1. Probando consulta de usuario Administrador...");
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role, rut, password')
    .eq('email', 'admin@icsa.cl')
    .eq('password', 'admin123')
    .single();

  if (userError || !user) {
    console.error("FALLÓ consulta de admin:", userError);
    process.exit(1);
  }
  console.log("ÉXITO: Usuario encontrado:", user.name, `(${user.email}) - Rol:`, user.role);

  // 2. Probar clientes precargados
  console.log("\n2. Probando listado de clientes...");
  const { data: clients, error: clientErr } = await supabase
    .from('clients')
    .select('*')
    .order('nombrecliente', { ascending: true });

  if (clientErr) {
    console.error("FALLÓ consulta de clientes:", clientErr);
    process.exit(1);
  }
  console.log(`ÉXITO: ${clients?.length} clientes encontrados:`, clients.map((c: any) => c.nombrecliente).join(', '));

  // 3. Probar herramientas precargadas
  console.log("\n3. Probando listado de herramientas...");
  const { data: tools, error: toolErr } = await supabase
    .from('herramientas')
    .select('*')
    .order('nombre', { ascending: true });

  if (toolErr) {
    console.error("FALLÓ consulta de herramientas:", toolErr);
    process.exit(1);
  }
  console.log(`ÉXITO: ${tools?.length} herramientas encontradas:`, tools.map((t: any) => t.nombre).join(', '));

  // 4. Probar inserción de OT de prueba
  console.log("\n4. Probando creación de orden de trabajo...");
  const testOtId = 'TEST-OT-' + Date.now();
  const { error: insertErr } = await supabase
    .from('ordenes')
    .insert({
      id: testOtId,
      folio: 10001,
      clientname: 'Cliente de Prueba',
      status: 'Pending',
      description: 'Prueba de funcionamiento 100% local'
    });

  if (insertErr) {
    console.error("FALLÓ inserción de OT:", insertErr);
    process.exit(1);
  }
  console.log("ÉXITO: OT de prueba creada con ID:", testOtId);

  // 5. Consultar la OT creada
  console.log("\n5. Consultando OT creada...");
  const { data: createdOt, error: getOtErr } = await supabase
    .from('ordenes')
    .select('*')
    .eq('id', testOtId)
    .single();

  if (getOtErr || !createdOt) {
    console.error("FALLÓ obtención de OT creada:", getOtErr);
    process.exit(1);
  }
  console.log("ÉXITO: OT recuperada correctamente con descripción:", createdOt.description);

  // 6. Eliminar la OT de prueba
  console.log("\n6. Limpiando OT de prueba...");
  const { error: delErr } = await supabase
    .from('ordenes')
    .delete()
    .eq('id', testOtId);

  if (delErr) {
    console.error("FALLÓ eliminación de OT:", delErr);
    process.exit(1);
  }
  console.log("ÉXITO: OT de prueba eliminada limpiamente.");

  console.log("\n=======================================================");
  console.log("¡TODAS LAS PRUEBAS DE LA BASE DE DATOS LOCAL PASARON EXITOSAMENTE!");
  console.log("=======================================================");
}

testLocalDb().catch(err => {
  console.error("Error fatal en pruebas:", err);
  process.exit(1);
});

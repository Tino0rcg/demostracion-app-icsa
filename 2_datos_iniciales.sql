-- ==============================================================================
-- PARTE 2: CARGA DE DATOS SEMILLA (EJECUTAR DESPUÉS DE PARTE 1)
-- ==============================================================================

-- A. USUARIOS
INSERT INTO public.users (id, email, password, name, role, rut) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@icsa.cl', 'admin123', 'Ramiro Contreras', 'Administrador', '16.890.123-4'),
('a0000000-0000-0000-0000-000000000002', 'supervisor@icsa.cl', 'supervisor123', 'Carlos Muñoz', 'Supervisor', '15.432.876-1'),
('a0000000-0000-0000-0000-000000000003', 'prevencion@icsa.cl', 'prevencion123', 'Patricia Fuentes', 'Prevención', '14.567.890-2')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- B. PERSONAL TÉCNICO
INSERT INTO public.personnel (id, nombre_t, rut_t, email, rol_t, telefono_t, cargo_t, vehiculo_t, patente_t, estado_t) VALUES
('a0000000-0000-0000-0000-000000000001', 'Ramiro Contreras', '16.890.123-4', 'admin@icsa.cl', 'Administrador', '+56 9 8765 4321', 'Jefe de Operaciones', 'Camioneta Toyota Hilux', 'KJ-78-90', 'Activo'),
('a0000000-0000-0000-0000-000000000002', 'Carlos Muñoz', '15.432.876-1', 'supervisor@icsa.cl', 'Supervisor', '+56 9 7654 3210', 'Supervisor de Faenas', 'Camioneta Mitsubishi L200', 'LP-45-12', 'Activo'),
('a0000000-0000-0000-0000-000000000003', 'Patricia Fuentes', '14.567.890-2', 'prevencion@icsa.cl', 'Prevención', '+56 9 6543 2109', 'Encargada de Prevención de Riesgos', 'Vehículo Corporativo', 'RT-22-33', 'Activo')
ON CONFLICT (id) DO NOTHING;

-- C. CLIENTES CORPORATIVOS
INSERT INTO public.clients (id, nombrecliente, rutcliente, telefonocliente, emailclientes, direccioncliente, comunacliente, razonsocial, estadocliente) VALUES
('c0000000-0000-0000-0000-000000000001', 'ICSA Minería & Energía SpA', '76.543.210-K', '+56 2 2890 1000', 'faenas@icsamineria.cl', 'Av. Vitacura 2670, Of. 801', 'Las Condes', 'ICSA Minería SpA', 'Activo'),
('c0000000-0000-0000-0000-000000000002', 'Entel Infraestructura Chile', '96.806.000-4', '+56 2 2360 0123', 'redes.terreno@entel.cl', 'Av. Costanera Sur 2760', 'Las Condes', 'Entel PCS Telecomunicaciones S.A.', 'Activo'),
('c0000000-0000-0000-0000-000000000003', 'Movistar Empresas SpA', '76.123.456-7', '+56 2 2690 4000', 'soporte.b2b@movistar.cl', 'Plaza Baquedano 44', 'Providencia', 'Telefónica Chile S.A.', 'Activo'),
('c0000000-0000-0000-0000-000000000004', 'Codelco División Andina', '61.704.000-K', '+56 34 249 2000', 'contratos.telecom@codelco.cl', 'Camino Internacional s/n', 'Los Andes', 'Corporación Nacional del Cobre', 'Activo')
ON CONFLICT (id) DO NOTHING;

-- D. PROYECTOS DE FAENA
INSERT INTO public.projects (id, name, status, clientid, clientname, startdate, enddate, teamnames, summary) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Tendido y Fusión Troncal 48 Hilos - Faena Minera Centinela',
  'active',
  'c0000000-0000-0000-0000-000000000001',
  'ICSA Minería & Energía SpA',
  '2026-03-01T08:00:00Z',
  '2026-04-30T18:00:00Z',
  '["Carlos Muñoz (Supervisor)", "Ramiro Contreras"]'::JSONB,
  'Despliegue de red de fibra óptica monomodo para sensores IOT y cámaras perimetrales.'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Modernización de Nodos y Antenas 5G Sector Oriente',
  'active',
  'c0000000-0000-0000-0000-000000000002',
  'Entel Infraestructura Chile',
  '2026-02-15T09:00:00Z',
  '2026-03-31T18:00:00Z',
  '["Carlos Muñoz (Supervisor)"]'::JSONB,
  'Conexión de radiobases con fibra óptica pre-conectorizada y medición de potencia óptica.'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Cableado Estructurado y Data Center Corporativo Torre Las Condes',
  'active',
  'c0000000-0000-0000-0000-000000000003',
  'Movistar Empresas SpA',
  '2026-03-05T08:30:00Z',
  '2026-05-15T18:00:00Z',
  '["Ramiro Contreras", "Carlos Muñoz"]'::JSONB,
  'Instalación de 12 racks de servidores, peinado de cables Cat 6A y rotulado bajo norma TIA-606.'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Monitoreo Sísmico y Fibras Subterráneas Mina Subterránea',
  'active',
  'c0000000-0000-0000-0000-000000000004',
  'Codelco División Andina',
  '2026-01-10T08:00:00Z',
  '2026-02-28T18:00:00Z',
  '["Carlos Muñoz (Supervisor)"]'::JSONB,
  'Cierre y certificación técnica del anillo óptico de seguridad interior mina.'
)
ON CONFLICT (id) DO NOTHING;

-- E. INVENTARIO DE HERRAMIENTAS
INSERT INTO public.herramientas (id, nombre, marca, modelo, serie, codigointerno, categoria, estado, asignadoa, imageurl, descripcion, notas) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'Fusionadora de Fibra Óptica 90S+',
  'Fujikura',
  '90S+ Core Alignment',
  'FUS-90S-8921',
  'FUS-001',
  'Instrumental Óptico',
  'En Terreno',
  'Carlos Muñoz',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'Alineación por núcleo en 4 ejes con calibración de arco en tiempo real.',
  'Retirada con firma digital para faena Minera Centinela.'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'Certificador OTDR OptiFiber Pro',
  'Fluke Networks',
  'OFP-100-M/S',
  'FLK-OTDR-4512',
  'OTDR-002',
  'Certificación',
  'Disponible',
  NULL,
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  'Reflectómetro óptico monomodo/multimodo con mapeo de eventos EventMap.',
  'Calibración al día (vigente hasta Dic 2026).'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'Medidor de Potencia y Fuente Láser',
  'EXFO',
  'MAX-720C',
  'EXF-PM-9021',
  'OPM-003',
  'Medición',
  'Disponible',
  NULL,
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'Medición de atenuación óptica en longitudes de onda 1310/1490/1550/1625 nm.',
  'En pañol central listo para despacho.'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'Cortadora de Precisión CT50',
  'Fujikura',
  'CT50 High Precision',
  'CT50-3341',
  'CLEAV-004',
  'Herramienta Manual',
  'En Terreno',
  'Ramiro Contreras',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  'Cuchilla rotativa motorizada con conectividad Bluetooth para 60.000 cortes.',
  'Asignada a vehículo técnico Patente KJ-78-90.'
),
(
  'd0000000-0000-0000-0000-000000000005',
  'Taladro Percutor Inalámbrico 20V Max',
  'DeWalt',
  'DCD996B XR Brushless',
  'DWT-20V-7811',
  'TAL-005',
  'Herramienta Eléctrica',
  'Disponible',
  NULL,
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  'Motor sin carbones de 3 velocidades con mandril metálico para hormigón.',
  'Incluye 2 baterías de 5Ah y cargador rápido.'
),
(
  'd0000000-0000-0000-0000-000000000006',
  'Escalera Dieléctrica Telescópica 24P',
  'Werner',
  'D6224-2 Fibra de Vidrio',
  'ESC-WER-1120',
  'ESC-006',
  'Seguridad en Altura',
  'En Terreno',
  'Carlos Muñoz',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'Escalera de fibra de vidrio no conductora de electricidad, capacidad 136 kg.',
  'Inspeccionada con cinta trimestral de seguridad.'
),
(
  'd0000000-0000-0000-0000-000000000007',
  'Generador Inverter Silencioso 2200W',
  'Honda',
  'EU22i',
  'HND-GEN-9912',
  'GEN-007',
  'Generación Eléctrica',
  'Disponible',
  NULL,
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  'Generador inverter de onda sinusoidal pura para instrumental electrónico delicado.',
  'Revisión técnica de 50 horas realizada.'
),
(
  'd0000000-0000-0000-0000-000000000008',
  'Identificador de Fibra Activa OFI',
  'Grandway',
  'OFI-3 Optical Traffic',
  'GRD-OFI-6644',
  'OFI-008',
  'Instrumental Óptico',
  'Disponible',
  NULL,
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  'Detección no destructiva de señales ópticas en fibras vivas.',
  'En estuche protector rígido.'
)
ON CONFLICT (id) DO NOTHING;

-- F. MOVIMIENTOS DE HERRAMIENTAS
INSERT INTO public.tool_movements (id, toolid, toolname, action, responsible, comment, status) VALUES
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Fusionadora de Fibra Óptica 90S+', 'Asignación', 'Carlos Muñoz', 'Retiro para faena en Minera Centinela.', 'Verificado'),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'Cortadora de Precisión CT50', 'Asignación', 'Ramiro Contreras', 'Asignada a camioneta de soporte técnico.', 'Verificado')
ON CONFLICT (id) DO NOTHING;

-- G. ÓRDENES DE TRABAJO ACTIVAS
INSERT INTO public.ordenes (id, folio, projectid, clientid, clientname, clientrut, clientphone, clientemail, branch, address, status, description, tipotrabajo, techname, techrut, startdate, iscert, islabeled) VALUES
('ot-1042', 1042, 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'ICSA Minería & Energía SpA', '76.543.210-K', '+56 2 2890 1000', 'faenas@icsamineria.cl', 'Planta Concentradora', 'Km 45 Camino a Sierra Gorda', 'En Proceso', 'Fusión de 24 hilos en mufa subterránea y empalme a bandeja de rack principal.', 'Fusión Fibra Óptica', 'Carlos Muñoz', '15.432.876-1', '2026-03-10T08:00:00Z', true, true),
('ot-1043', 1043, 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Entel Infraestructura Chile', '96.806.000-4', '+56 2 2360 0123', 'redes.terreno@entel.cl', 'Sitio Celular Oriente 14', 'Av. Vitacura 5400', 'Firmada en Terreno', 'Montaje de distribuidor óptico ODF y pruebas de atenuación con reflectómetro.', 'Certificación Óptica', 'Ramiro Contreras', '16.890.123-4', '2026-03-11T09:30:00Z', true, true),
('ot-1044', 1044, 'b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Movistar Empresas SpA', '76.123.456-7', '+56 2 2690 4000', 'soporte.b2b@movistar.cl', 'Edificio Corporativo Piso 12', 'Plaza Baquedano 44', 'Pendiente', 'Tendido de canaleta perimetral y peinado de 48 enlaces Cat 6A en rack.', 'Cableado Estructurado', 'Carlos Muñoz', '15.432.876-1', '2026-03-12T08:30:00Z', false, true)
ON CONFLICT (id) DO NOTHING;

-- H. HISTORIAL DE ÓRDENES
INSERT INTO public.historial (id, folio, projectid, clientid, clientname, clientrut, clientphone, clientemail, branch, address, status, description, tipotrabajo, techname, techrut, startdate, iscert, islabeled, isprojectsummary) VALUES
('ot-1039', 1039, 'b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Codelco División Andina', '61.704.000-K', '+56 34 249 2000', 'contratos.telecom@codelco.cl', 'Túnel Interior Mina Nivel 3', 'Camino Internacional s/n', 'Completado', 'Acta Final de Entrega: Empalme y certificación de anillo óptico de monitoreo sísmico.', 'Certificación Óptica', 'Carlos Muñoz', '15.432.876-1', '2026-02-20T08:00:00Z', true, true, true),
('ot-1040', 1040, 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Entel Infraestructura Chile', '96.806.000-4', '+56 2 2360 0123', 'redes.terreno@entel.cl', 'Estación Base Providencia', 'Av. Andrés Bello 2100', 'Completado', 'Reemplazo de latiguillos monomodo y limpieza de conectores con microscopio digital.', 'Mantenimiento Preventivo', 'Ramiro Contreras', '16.890.123-4', '2026-02-26T10:00:00Z', true, true, false)
ON CONFLICT (id) DO NOTHING;

-- I. PREGUNTAS HPT
INSERT INTO public.hpt_questions (category, item_key, label, order_index) VALUES
('recursos', 'personal', '¿Se cuenta con el personal necesario y entrenado según el procedimiento de trabajo ICSA?', 1),
('recursos', 'equipos', '¿Se cuenta con los Equipos, Herramientas necesarias, y estos se encuentran en buen estado de uso?', 2),
('recursos', 'materiales', '¿Se dispone de los materiales, repuestos e insumos necesarios?', 3),
('recursos', 'coordinacionC', '¿Se realizó coordinaciones necesarias con cliente para acceder a las zonas de trabajo?', 4),
('recursos', 'bloqueo', '¿Se coordinó bloqueo de seguridad y/o líneas (Eléctricas, Hidráulicas, etc.)?', 5),
('recursos', 'permisoC', '¿Se solicitó el permiso de ingreso al personal de prevención de riesgos cliente?', 6)
ON CONFLICT (category, item_key) DO NOTHING;

INSERT INTO public.hpt_questions (category, item_key, label, order_index) VALUES
('riesgos', 'aprisionamiento', 'Aprisionamiento por tableros, máquinas o equipos en movimiento.', 1),
('riesgos', 'atrapamiento', 'Atrapamiento de extremidades por objetos o canalizaciones.', 2),
('riesgos', 'caidaMismo', 'Caída al mismo nivel por superficies irregulares, agua o cables sueltos.', 3),
('riesgos', 'caidaDistinto', 'Caída a distinto nivel desde andamios, escalas o techumbres (> 1.5 m).', 4),
('riesgos', 'energiaE', 'Contacto con energía eléctrica en tableros generales o líneas energizadas.', 5),
('riesgos', 'temperaturas', 'Exposición a temperaturas extremas (calor en faena o frío interior mina).', 6),
('riesgos', 'golpeadoC', 'Golpeado con o contra herramientas, perfiles o estructuras metálicas.', 7),
('riesgos', 'atropellado', 'Atropellado por maquinaria pesada, camionetas o grúas horquilla.', 8),
('riesgos', 'sobreesfuerzo', 'Sobreesfuerzo por levantamiento manual de cargas pesadas (> 25 kg).', 9),
('riesgos', 'incendioE', 'Riesgo de amago de incendio, chispas o deflagración eléctrica.', 10)
ON CONFLICT (category, item_key) DO NOTHING;

INSERT INTO public.hpt_questions (category, item_key, label, order_index) VALUES
('medidas', 'limpiesa', 'El área de trabajo está limpia, ordenada y con accesos expeditos.', 1),
('medidas', 'iluminacion', 'El área dispone de la iluminación requerida para la tarea a realizar.', 2),
('medidas', 'electricas', 'Las instalaciones y alargadores eléctricos portátiles están en buen estado.', 3),
('medidas', 'delimitada', 'Está delimitada la zona de trabajo con conos y cinta de peligro.', 4),
('medidas', 'eppAdecuado', 'Se verifica la utilización de los EPP adecuados y en buen estado de conservación.', 5),
('medidas', 'arnes', 'Se utiliza arnés de seguridad con doble cabo de vida sobre 1.5 m de altura.', 6),
('medidas', 'extintor', 'Se dispone de extintor PQS de 6 o 10 kg operativo y vigente en el área.', 7)
ON CONFLICT (category, item_key) DO NOTHING;

INSERT INTO public.hpt_questions (category, item_key, label, order_index) VALUES
('epp', 'casco', 'Casco de Seguridad con Barbiquejo', 1),
('epp', 'lentes', 'Lentes de Seguridad con Filtro UV', 2),
('epp', 'calzado', 'Calzado de Seguridad Dieléctrico', 3),
('epp', 'guantes', 'Guantes de Cabritilla / Nitrilo', 4),
('epp', 'chaleco', 'Chaleco Reflectante de Alta Visibilidad', 5),
('epp', 'arnesY', 'Arnés de Seguridad con Cabo de Vida tipo Y', 6),
('epp', 'protectorSolar', 'Protector Solar FPS 50+', 7),
('epp', 'auditivo', 'Protector Auditivo tipo Fono / Tapón', 8)
ON CONFLICT (category, item_key) DO NOTHING;

-- J. REGISTRO DEMO HPT
INSERT INTO public.hpt (id, folio, projectid, projectname, supervisorname, supervisorrut, trabajorealizar, status, firmasupervisor) VALUES
('f0000000-0000-0000-0000-000000000001', 501, 'b0000000-0000-0000-0000-000000000001', 'Tendido y Fusión Troncal 48 Hilos - Faena Minera Centinela', 'Carlos Muñoz', '15.432.876-1', 'Ingreso a cámaras subterráneas y tendido de cable óptico con arnés y detector de gases.', 'Firmado', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
ON CONFLICT (id) DO NOTHING;

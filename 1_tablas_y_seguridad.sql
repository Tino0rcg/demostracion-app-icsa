-- ==============================================================================
-- PARTE 1: CREACIÓN DE TABLAS, RLS Y PERMISOS (EJECUTAR PRIMERO)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- A. Usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Técnico',
  rut TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombrecliente TEXT NOT NULL,
  rutcliente TEXT UNIQUE NOT NULL,
  telefonocliente TEXT,
  emailclientes TEXT,
  direccioncliente TEXT,
  comunacliente TEXT,
  razonsocial TEXT,
  estadocliente TEXT DEFAULT 'Activo',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. Personal
CREATE TABLE IF NOT EXISTS public.personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_t TEXT NOT NULL,
  rut_t TEXT UNIQUE NOT NULL,
  email TEXT,
  rol_t TEXT NOT NULL,
  telefono_t TEXT,
  cargo_t TEXT,
  vehiculo_t TEXT,
  patente_t TEXT,
  estado_t TEXT DEFAULT 'Activo',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  clientid UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  clientname TEXT,
  startdate TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  enddate TIMESTAMPTZ,
  teamnames JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. Órdenes de Trabajo Activas
CREATE TABLE IF NOT EXISTS public.ordenes (
  id TEXT PRIMARY KEY,
  folio BIGINT,
  projectid UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  clientid UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  clientname TEXT NOT NULL,
  clientrut TEXT,
  clientphone TEXT,
  clientemail TEXT,
  branch TEXT,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'En Proceso',
  description TEXT,
  tipotrabajo TEXT,
  techname TEXT,
  techrut TEXT,
  startdate TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  iscert BOOLEAN DEFAULT false,
  islabeled BOOLEAN DEFAULT false,
  photourls JSONB DEFAULT '[]'::jsonb,
  firmacliente TEXT,
  firmatecnico TEXT,
  rut_validador TEXT,
  token_firma TEXT,
  token_expira TIMESTAMPTZ,
  email_notificacion_enviado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. Historial de Órdenes Finalizadas
CREATE TABLE IF NOT EXISTS public.historial (
  id TEXT PRIMARY KEY,
  folio BIGINT,
  projectid UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  clientid UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  clientname TEXT NOT NULL,
  clientrut TEXT,
  clientphone TEXT,
  clientemail TEXT,
  branch TEXT,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'Completado',
  description TEXT,
  tipotrabajo TEXT,
  techname TEXT,
  techrut TEXT,
  startdate TIMESTAMPTZ,
  closedat TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  iscert BOOLEAN DEFAULT false,
  islabeled BOOLEAN DEFAULT false,
  photourls JSONB DEFAULT '[]'::jsonb,
  firmacliente TEXT,
  firmatecnico TEXT,
  rut_validador TEXT,
  isprojectsummary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- G. Herramientas
CREATE TABLE IF NOT EXISTS public.herramientas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  serie TEXT UNIQUE NOT NULL,
  codigointerno TEXT UNIQUE,
  categoria TEXT NOT NULL,
  estado TEXT DEFAULT 'Disponible',
  asignadoa TEXT,
  imageurl TEXT,
  descripcion TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- H. Movimientos de Herramientas
CREATE TABLE IF NOT EXISTS public.tool_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  toolid UUID REFERENCES public.herramientas(id) ON DELETE CASCADE,
  toolname TEXT NOT NULL,
  action TEXT NOT NULL,
  responsible TEXT NOT NULL,
  comment TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- I. HPT (Seguridad Laboral)
CREATE TABLE IF NOT EXISTS public.hpt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio BIGINT,
  projectid UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  projectname TEXT,
  supervisorname TEXT NOT NULL,
  supervisorrut TEXT,
  trabajorealizar TEXT NOT NULL,
  status TEXT DEFAULT 'Borrador',
  respuestas JSONB DEFAULT '{}'::jsonb,
  firmasupervisor TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- J. Trabajadores HPT
CREATE TABLE IF NOT EXISTS public.hpt_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hpt_id UUID REFERENCES public.hpt(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  rut TEXT NOT NULL,
  firma TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- K. Preguntas Dinámicas HPT
CREATE TABLE IF NOT EXISTS public.hpt_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  item_key TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  UNIQUE(category, item_key)
);

-- L. Charlas 5 Minutos
CREATE TABLE IF NOT EXISTS public.capacitaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio BIGINT,
  fecha TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  tema TEXT NOT NULL,
  relator TEXT NOT NULL,
  relator_rut TEXT,
  duracion_minutos INTEGER DEFAULT 5,
  observaciones TEXT,
  firma_relator TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- M. Asistentes Charlas
CREATE TABLE IF NOT EXISTS public.capacitacion_asistentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacitacion_id UUID REFERENCES public.capacitaciones(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  rut TEXT NOT NULL,
  firma TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SEGURIDAD RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.herramientas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpt ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpt_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hpt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacitacion_asistentes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public All Users" ON public.users;
CREATE POLICY "Public All Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Clients" ON public.clients;
CREATE POLICY "Public All Clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Personnel" ON public.personnel;
CREATE POLICY "Public All Personnel" ON public.personnel FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Projects" ON public.projects;
CREATE POLICY "Public All Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Ordenes" ON public.ordenes;
CREATE POLICY "Public All Ordenes" ON public.ordenes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Historial" ON public.historial;
CREATE POLICY "Public All Historial" ON public.historial FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Herramientas" ON public.herramientas;
CREATE POLICY "Public All Herramientas" ON public.herramientas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Tool Movements" ON public.tool_movements;
CREATE POLICY "Public All Tool Movements" ON public.tool_movements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All HPT" ON public.hpt;
CREATE POLICY "Public All HPT" ON public.hpt FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All HPT Questions" ON public.hpt_questions;
CREATE POLICY "Public All HPT Questions" ON public.hpt_questions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public All Capacitaciones" ON public.capacitaciones;
CREATE POLICY "Public All Capacitaciones" ON public.capacitaciones FOR ALL USING (true) WITH CHECK (true);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

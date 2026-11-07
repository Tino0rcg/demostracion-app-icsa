import fs from 'fs';
import path from 'path';

export interface LocalDbSchema {
  users: any[];
  clients: any[];
  personnel: any[];
  projects: any[];
  ordenes: any[];
  historial: any[];
  herramientas: any[];
  tool_movements: any[];
  hpt: any[];
  hpt_workers: any[];
  capacitaciones: any[];
  capacitacion_asistentes: any[];
  [key: string]: any[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'local-db.json');

const INITIAL_SEED: LocalDbSchema = {
  users: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@icsa.cl",
      password: "admin123",
      name: "Administrador ICSA",
      role: "Admin",
      rut: "11.111.111-1",
      signatureurl: "",
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString()
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      email: "supervisor@icsa.cl",
      password: "supervisor123",
      name: "Supervisor Terreno",
      role: "Supervisor",
      rut: "22.222.222-2",
      signatureurl: "",
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString()
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      email: "prevencion@icsa.cl",
      password: "prevencion123",
      name: "Prevención de Riesgos",
      role: "Prevencionista",
      rut: "33.333.333-3",
      signatureurl: "",
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString()
    }
  ],
  personnel: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      nombre_t: "Administrador ICSA",
      rut_t: "11.111.111-1",
      email: "admin@icsa.cl",
      rol_t: "Admin",
      telefono_t: "+56 9 1111 1111",
      cargo_t: "Administrador General",
      estado_t: "Activo",
      createdat: new Date().toISOString()
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      nombre_t: "Supervisor Terreno",
      rut_t: "22.222.222-2",
      email: "supervisor@icsa.cl",
      rol_t: "Supervisor",
      telefono_t: "+56 9 2222 2222",
      cargo_t: "Supervisor de Terreno",
      estado_t: "Activo",
      createdat: new Date().toISOString()
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      nombre_t: "Prevención de Riesgos",
      rut_t: "33.333.333-3",
      email: "prevencion@icsa.cl",
      rol_t: "Prevencionista",
      telefono_t: "+56 9 3333 3333",
      cargo_t: "Prevencionista de Riesgos",
      estado_t: "Activo",
      createdat: new Date().toISOString()
    }
  ],
  clients: [
    {
      id: "c1111111-1111-1111-1111-111111111111",
      nombrecliente: "Entel S.A.",
      rutcliente: "96.806.000-4",
      telefonocliente: "+56 9 1234 5678",
      emailclientes: "contacto@entel.cl",
      direccioncliente: "Av. Costanera Sur 2760, Las Condes",
      comunacliente: "Las Condes",
      razonsocial: "Empresa Nacional de Telecomunicaciones S.A.",
      estadocliente: "Activo",
      createdat: new Date().toISOString()
    },
    {
      id: "c2222222-2222-2222-2222-222222222222",
      nombrecliente: "Movistar Chile",
      rutcliente: "76.123.456-7",
      telefonocliente: "+56 9 8765 4321",
      emailclientes: "operaciones@movistar.cl",
      direccioncliente: "Av. Providencia 111, Providencia",
      comunacliente: "Providencia",
      razonsocial: "Telefónica Móviles Chile S.A.",
      estadocliente: "Activo",
      createdat: new Date().toISOString()
    }
  ],
  projects: [
    {
      id: "p1111111-1111-1111-1111-111111111111",
      name: "Modernización Red de Datos Central",
      status: "Active",
      clientid: "c1111111-1111-1111-1111-111111111111",
      clientname: "Entel S.A.",
      startdate: new Date().toISOString(),
      teamids: [
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002"
      ],
      teamnames: ["Administrador ICSA", "Supervisor Terreno"],
      summary: "Proyecto piloto para cableado estructurado e infraestructura.",
      hiddenby: [],
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString()
    }
  ],
  ordenes: [],
  historial: [],
  herramientas: [
    {
      id: "h1111111-1111-1111-1111-111111111111",
      nombre: "Certificador de Red Fluke DSX-5000",
      marca: "Fluke Networks",
      modelo: "DSX-5000",
      serie: "FLK-987654",
      codigointerno: "HERR-001",
      categoria: "Electrónica",
      estado: "Disponible",
      asignadoa: null,
      notas: "Calibración al día.",
      createdat: new Date().toISOString()
    },
    {
      id: "h2222222-2222-2222-2222-222222222222",
      nombre: "Fusionadora de Fibra Óptica",
      marca: "Fujikura",
      modelo: "70S+",
      serie: "FUJ-33211",
      codigointerno: "HERR-002",
      categoria: "Electrónica",
      estado: "Disponible",
      asignadoa: null,
      notas: "Incluye cuchilla de precisión.",
      createdat: new Date().toISOString()
    },
    {
      id: "h3333333-3333-3333-3333-333333333333",
      nombre: "Escalera Dieléctrica de Tijera 8 Peldaños",
      marca: "Cuprum",
      modelo: "Fibra de Vidrio",
      serie: "CUP-08P",
      codigointerno: "HERR-003",
      categoria: "Altura",
      estado: "Disponible",
      asignadoa: null,
      notas: "Inspección de zapatas y peldaños OK.",
      createdat: new Date().toISOString()
    }
  ],
  tool_movements: [],
  hpt: [],
  hpt_workers: [],
  capacitaciones: [],
  capacitacion_asistentes: []
};

// In-memory cache synced with disk
let cachedDb: LocalDbSchema | null = null;

function loadDb(): LocalDbSchema {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      console.log("[LOCAL_DB] Inicializando base de datos local con datos semilla...");
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
      cachedDb = JSON.parse(JSON.stringify(INITIAL_SEED));
      return cachedDb!;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    cachedDb = JSON.parse(content);
    // Ensure all tables exist
    for (const key of Object.keys(INITIAL_SEED)) {
      if (!cachedDb![key]) {
        cachedDb![key] = [];
      }
    }
    return cachedDb!;
  } catch (err) {
    console.error("[LOCAL_DB] Error cargando local-db.json:", err);
    cachedDb = JSON.parse(JSON.stringify(INITIAL_SEED));
    return cachedDb!;
  }
}

function saveDb(): void {
  if (!cachedDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(cachedDb, null, 2), 'utf-8');
  } catch (err) {
    console.error("[LOCAL_DB] Error guardando local-db.json:", err);
  }
}

// Case-insensitive record field getter
function getField(obj: any, fieldName: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  if (fieldName in obj) return obj[fieldName];
  const targetLower = fieldName.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === targetLower) {
      return obj[k];
    }
  }
  return undefined;
}

export class LocalQueryBuilder implements PromiseLike<{ data: any; error: any }> {
  private tableName: string;
  private action: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  private payload: any = null;
  private upsertOptions: any = null;
  private filters: Array<(item: any) => boolean> = [];
  private orderConfig: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;
  private isSingle: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*'): this {
    if (this.action !== 'insert' && this.action !== 'update' && this.action !== 'upsert' && this.action !== 'delete') {
      this.action = 'select';
    }
    return this;
  }

  insert(data: any | any[]): this {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data: any): this {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  upsert(data: any | any[], options?: { onConflict?: string }): this {
    this.action = 'upsert';
    this.payload = data;
    this.upsertOptions = options;
    return this;
  }

  delete(): this {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: any): this {
    this.filters.push((item) => {
      const val = getField(item, column);
      if (val === undefined && value === null) return true;
      return val === value;
    });
    return this;
  }

  neq(column: string, value: any): this {
    this.filters.push((item) => {
      const val = getField(item, column);
      return val !== value;
    });
    return this;
  }

  in(column: string, values: any[]): this {
    this.filters.push((item) => {
      const val = getField(item, column);
      return Array.isArray(values) && values.includes(val);
    });
    return this;
  }

  not(column: string, operator: string, value: any): this {
    if (operator === 'in') {
      let list: string[] = [];
      if (typeof value === 'string') {
        // e.g. '("Completed", "Completado")'
        list = value
          .replace(/[()"]/g, '')
          .split(',')
          .map((s) => s.trim());
      } else if (Array.isArray(value)) {
        list = value;
      }
      this.filters.push((item) => {
        const val = getField(item, column);
        return !list.includes(String(val));
      });
    } else if (operator === 'eq') {
      this.filters.push((item) => getField(item, column) !== value);
    }
    return this;
  }

  contains(column: string, arrayValue: any[]): this {
    this.filters.push((item) => {
      const val = getField(item, column);
      if (Array.isArray(val)) {
        return arrayValue.every((v) => val.includes(v));
      }
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            return arrayValue.every((v) => parsed.includes(v));
          }
        } catch {
          return arrayValue.every((v) => val.includes(String(v)));
        }
      }
      return false;
    });
    return this;
  }

  or(conditionsStr: string): this {
    // Examples: 'projectid.is.null,projectid.eq.""'
    const parts = conditionsStr.split(',').map((p) => p.trim());
    this.filters.push((item) => {
      return parts.some((part) => {
        const sub = part.split('.');
        const col = sub[0];
        const op = sub[1];
        const targetVal = sub.slice(2).join('.');

        const actual = getField(item, col);

        if (op === 'is' && targetVal === 'null') {
          return actual === null || actual === undefined || actual === '';
        }
        if (op === 'eq') {
          const cleaned = targetVal.replace(/['"]/g, '');
          return actual === cleaned || (cleaned === '' && !actual);
        }
        return false;
      });
    });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = { ascending: true }): this {
    this.orderConfig = {
      column,
      ascending: options.ascending !== false
    };
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  single(): this {
    this.isSingle = true;
    return this;
  }

  private execute(): { data: any; error: any } {
    const db = loadDb();
    if (!db[this.tableName]) {
      db[this.tableName] = [];
    }
    const table = db[this.tableName];

    switch (this.action) {
      case 'insert': {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload];
        for (const item of items) {
          const copy = { ...item };
          if (!copy.id) {
            copy.id = crypto.randomUUID();
          }
          table.push(copy);
        }
        saveDb();
        return { data: this.payload, error: null };
      }

      case 'upsert': {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload];
        const conflictKey = this.upsertOptions?.onConflict || 'id';

        for (const item of items) {
          const val = getField(item, conflictKey);
          const existingIdx = table.findIndex((r) => getField(r, conflictKey) === val);
          if (existingIdx >= 0) {
            table[existingIdx] = { ...table[existingIdx], ...item };
          } else {
            const copy = { ...item };
            if (!copy.id) copy.id = crypto.randomUUID();
            table.push(copy);
          }
        }
        saveDb();
        return { data: this.payload, error: null };
      }

      case 'update': {
        let updatedCount = 0;
        for (let i = 0; i < table.length; i++) {
          const matches = this.filters.every((fn) => fn(table[i]));
          if (matches) {
            table[i] = { ...table[i], ...this.payload };
            updatedCount++;
          }
        }
        saveDb();
        return { data: this.payload, error: null };
      }

      case 'delete': {
        const initialLen = table.length;
        db[this.tableName] = table.filter((row) => !this.filters.every((fn) => fn(row)));
        saveDb();
        return { data: null, error: null };
      }

      case 'select':
      default: {
        let results = table.filter((row) => this.filters.every((fn) => fn(row)));

        if (this.orderConfig) {
          const { column, ascending } = this.orderConfig;
          results.sort((a, b) => {
            const valA = getField(a, column);
            const valB = getField(b, column);
            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return ascending ? -1 : 1;
            if (valB === undefined || valB === null) return ascending ? 1 : -1;
            if (typeof valA === 'number' && typeof valB === 'number') {
              return ascending ? valA - valB : valB - valA;
            }
            return ascending
              ? String(valA).localeCompare(String(valB))
              : String(valB).localeCompare(String(valA));
          });
        }

        if (this.limitCount !== null) {
          results = results.slice(0, this.limitCount);
        }

        if (this.isSingle) {
          if (results.length === 0) {
            return {
              data: null,
              error: {
                message: 'JSON object requested, multiple (or no) rows returned',
                code: 'PGRST116',
                details: '0 rows returned'
              }
            };
          }
          return { data: results[0], error: null };
        }

        return { data: results, error: null };
      }
    }
  }

  // Promise-like resolution (allows `await supabase.from(...)`)
  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const res = this.execute();
    return Promise.resolve(res).then(onfulfilled, onrejected);
  }
}

export const localSupabase = {
  from(tableName: string) {
    return new LocalQueryBuilder(tableName);
  }
};

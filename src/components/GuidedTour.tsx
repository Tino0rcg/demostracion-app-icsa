"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GuidedTourProps {
  onTabChange?: (tab: string) => void;
}

// Module-level guard to ensure the tour auto-launches strictly once per browser session
let tourHasAutoLaunched = false;

function waitForDOMElement(selector: string, timeout = 2500): Promise<Element | null> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") return resolve(null);
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const target = document.querySelector(selector);
      if (target) {
        observer.disconnect();
        resolve(target);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeout);
  });
}

export function GuidedTour({ onTabChange }: GuidedTourProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const driverRef = useRef<Driver | null>(null);
  const onTabChangeRef = useRef(onTabChange);
  const { toast } = useToast();

  // Keep callback reference updated without triggering re-renders
  useEffect(() => {
    onTabChangeRef.current = onTabChange;
  }, [onTabChange]);

  const startTour = useCallback((startIndex = 0) => {
    // Clean up any existing tour instance safely
    if (driverRef.current) {
      try {
        driverRef.current.destroy();
      } catch {}
    }

    // Pre-select initial tab based on step index
    const tabMap: Record<number, string> = {
      0: "dashboard",
      1: "dashboard",
      2: "dashboard",
      3: "dashboard",
      4: "projects",
      5: "projects",
      6: "projects",
      7: "project-history",
      8: "tools",
      9: "tools",
      10: "tools",
      11: "tool-history",
      12: "dashboard",
      13: "dashboard",
      14: "dashboard",
      15: "dashboard",
      16: "orders",
      17: "orders",
      18: "order-history",
      19: "dashboard",
      20: "dashboard"
    };

    const targetTab = tabMap[startIndex] || "dashboard";
    onTabChangeRef.current?.(targetTab);

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      waitForElement: 2500,
      overlayColor: "rgba(10, 25, 47, 0.85)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour Completo!",
      steps: [
        // PASO 1
        {
          element: "#tour-welcome",
          popover: {
            title: "🔐 Paso 1 de 21: Autenticación & Perfiles de Faena",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 800; text-transform: uppercase;">Acceso al Sistema</span>
                <p>El software cuenta con segregación estricta de funciones según el perfil de cada colaborador:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li><strong>Administrador General:</strong> Control de contratos, clientes, cuadrillas, pañol y auditorías.</li>
                  <li><strong>Supervisor Técnico:</strong> Despacho de OTs, control de cuadrillas y firmas en terreno.</li>
                  <li><strong>Prevencionista de Riesgos:</strong> Checklists HPT y charlas de 5 minutos obligatorias.</li>
                </ul>
                <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 8px 10px; color: #115e59; font-weight: 500; font-size: 12px;">
                  💡 <strong>Modo Activo:</strong> Estás navegando como <strong>Administrador General</strong> con permisos totales para conocer todas las funciones sin restricciones.
                </div>
              </div>
            `,
            side: "bottom",
            align: "start",
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-stats-grid").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 2
        {
          element: "#tour-stats-grid",
          popover: {
            title: "📊 Paso 2 de 21: Centro de Monitoreo & KPIs Operativos",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 800; text-transform: uppercase;">Estado Operativo en Tiempo Real</span>
                <p>Al iniciar la jornada, la jefatura supervisa el balance operacional consolidado:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Proyectos en Ejecución:</strong> Obras de telecomunicaciones y minería en curso.</li>
                  <li><strong>Órdenes Pendientes:</strong> Trabajos que las cuadrillas están ejecutando en terreno.</li>
                  <li><strong>Stock en Pañol:</strong> Equipos disponibles vs. entregados bajo firma digital.</li>
                </ul>
                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 2px;">Recorreremos todas las áreas del sistema paso a paso.</p>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-welcome").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-card-projects").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 3
        {
          element: "#tour-card-projects",
          popover: {
            title: "📁 Paso 3 de 21: Panel Rápido de Obras en Ejecución",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; text-transform: uppercase;">Panel Resumen • Obras Activas</span>
                <p>Muestra los 5 contratos prioritarios en faena:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li><strong>Nombre y Mandante:</strong> Identificación de la obra (ej. Minera Centinela, Entel, Codelco).</li>
                  <li><strong>Avance y Plazos:</strong> Fecha contractual de término y porcentaje completado.</li>
                  <li><strong>Acceso Directo:</strong> Permite ingresar al detalle de la obra en un solo clic.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-stats-grid").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-card-orders").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 4
        {
          element: "#tour-card-orders",
          popover: {
            title: "📋 Paso 4 de 21: Cola de Órdenes Pendientes",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Panel Resumen • Cola de Terreno</span>
                <p>Supervisión en vivo de las OTs que los técnicos tienen asignadas hoy:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li><strong>Folio Único:</strong> Número correlativo inmutable para trazabilidad.</li>
                  <li><strong>Técnico Responsable:</strong> Identidad del jefe de cuadrilla a cargo.</li>
                  <li><strong>Estado Operativo:</strong> Pendiente de ejecución, En Proceso o Lista para Firma.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-card-projects").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 5
        {
          element: "#tour-projects-container",
          popover: {
            title: "🏗️ Paso 5 de 21: Fase 1 • Gestión de Proyectos de Infraestructura",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 1 • Planificación de Faena</span>
                <p>Toda labor técnica comienza con la apertura formal del proyecto de ingeniería:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Asignación de Personal:</strong> Se designa al supervisor a cargo y los técnicos acreditados para ingresar a la faena minera.</li>
                  <li><strong>Control Contractual:</strong> Monitoreo de fecha de inicio, fecha límite de entrega e hitos de pago.</li>
                  <li><strong>Historial por Mandante:</strong> Trazabilidad consolidada para Codelco, Entel, Movistar o ICSA Minería.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-card-orders").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-search, #tour-projects-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 6
        {
          element: "#tour-projects-search",
          popover: {
            title: "🔍 Paso 6 de 21: Búsqueda Predictiva de Faenas",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 800; text-transform: uppercase;">Filtros en Tiempo Real</span>
                <p>En faenas con decenas de contratos simultáneos, el buscador filtra en milisegundos:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li>Por <strong>nombre del proyecto</strong> (ej. <em>Tendido Troncal 48 Hilos</em>).</li>
                  <li>Por <strong>cliente mandante</strong> (ej. <em>Centinela</em> o <em>Codelco</em>).</li>
                  <li>Por <strong>RUT de la empresa</strong> mandante.</li>
                </ul>
              </div>
            `,
            side: "bottom",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-btn-new-project").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 7
        {
          element: "#tour-btn-new-project",
          popover: {
            title: "📑 Paso 7 de 21: Acta Consolidada de Liquidación de Proyecto",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; text-transform: uppercase;">Función Estrella • Cierre y Cobro</span>
                <p>Al finalizar una obra de semanas o meses, el sistema cuenta con el motor de <strong>Acta Final Consolidada</strong>:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 5px; font-size: 12px;">
                  <div><strong>1. Agrupación Automática:</strong> Reúne todas las OTs y visitas técnicas ejecutadas en ese proyecto.</div>
                  <div><strong>2. Resumen de Materiales:</strong> Totaliza metros de fibra, bocas de red instaladas y fusiones realizadas.</div>
                  <div><strong>3. Acta Única en PDF:</strong> Genera el documento de liquidación legal firmado para cobro inmediato sin disputas con el mandante.</div>
                </div>
              </div>
            `,
            side: "bottom",
            align: "end",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-search").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("project-history");
              waitForDOMElement("#tour-projects-history-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 8
        {
          element: "#tour-projects-history-container",
          popover: {
            title: "🏛️ Paso 8 de 21: Historial & Auditoría de Proyectos",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase;">Archivo Inmutable</span>
                <p>Repositorio de obras concluidas y archivadas con trazabilidad total:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Filtro por Rango de Fechas:</strong> Permite consultar proyectos por fecha de inicio y cierre (Desde / Hasta) para balances anuales.</li>
                  <li><strong>Auditorías Externas:</strong> Toda el acta, técnicos y firmas quedan resguardadas ante auditorías mineras o tributarias.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-btn-new-project").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 9
        {
          element: "#tour-tools-container",
          popover: {
            title: "🔧 Paso 9 de 21: Fase 2 • Pañol de Instrumental de Alto Costo",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 2 • Pañol & Control de Stock</span>
                <p>Las faenas de telecomunicaciones requieren instrumental de alto valor económico:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Equipos Críticos:</strong> Fusionadoras de fibra Fujikura 90S+, Reflectómetros OTDR Fluke Networks, taladros percutores y escaleras dieléctricas.</li>
                  <li><strong>Estado de Inventario:</strong> Visualización en tiempo real de qué equipos están <em>Disponibles</em> en bodega y cuáles están <em>En Terreno</em>.</li>
                  <li><strong>Calibración y Mantención:</strong> Control de números de serie y vigencia de certificación técnica.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("project-history");
              waitForDOMElement("#tour-projects-history-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 10
        {
          element: "#tour-tools-container",
          popover: {
            title: "✍️ Paso 10 de 21: Despacho de Instrumental con Firma Digital",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 2 • Cero Pérdidas</span>
                <p>Al retirar una herramienta cara para subir a faena:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Firma en Pantalla del Técnico:</strong> El colaborador estampa su firma biométrica en la tablet/celular acreditando la recepción conforme.</li>
                  <li><strong>Acta Inmutable:</strong> Queda registrado el número de serie exacto, fecha, hora y técnico responsable.</li>
                  <li><strong>Impacto Financiero:</strong> Elimina pérdidas o daños no atribuidos en herramientas de más de $5.000.000 CLP.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 11
        {
          element: "#tour-tools-container",
          popover: {
            title: "🔄 Paso 11 de 21: 'Mis Herramientas' & Devolución por Lote",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 2 • Retorno Ágil</span>
                <p>Al terminar la jornada de trabajo:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Vista Personal:</strong> Cada técnico consulta en su teléfono la sección <em>Mis Herramientas</em> con los equipos que tiene bajo su custodia.</li>
                  <li><strong>Devolución Múltiple:</strong> Con el botón <em>Seleccionar Todas</em> puede entregar 5 o 10 equipos simultáneamente.</li>
                  <li><strong>Inspección Física:</strong> El pañolero valida que los equipos vuelvan limpios y operativos antes de reincorporarlos al stock general.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tool-history");
              waitForDOMElement("#tour-tool-history-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 12
        {
          element: "#tour-tool-history-container",
          popover: {
            title: "📜 Paso 12 de 21: Trazabilidad Legal de Actas de Pañol",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; text-transform: uppercase;">Auditoría de Bodega</span>
                <p>Historial digitalizado de todas las entregas y devoluciones:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li>Visualización de actas por lote con firma y responsable.</li>
                  <li>Generación de reportes de rotación para mantenimiento preventivo.</li>
                  <li>Trazabilidad legal ante cualquier requerimiento de aseguradoras.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-hpt").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 13
        {
          element: "#tour-menu-hpt",
          popover: {
            title: "🦺 Paso 13 de 21: Fase 3 • Seguridad Pre-Faena HPT (Ley y Mutualidades)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 3 • Prevención ACHS / Mutual</span>
                <p>Al llegar al sitio y antes de intervenir mufas, postes o salas de control:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>HPT (Hoja de Planificación de Tarea):</strong> Evaluación obligatoria de riesgos críticos (altura física, espacios confinados, inducción eléctrica).</li>
                  <li><strong>Checklist de EPPs:</strong> Verificación de arnés dieléctrico, detector de tensión y casco normado.</li>
                  <li><strong>Bloqueo de Faena:</strong> Sin la HPT aprobada y firmada, no se autoriza la ejecución técnica.</li>
                </ul>
              </div>
            `,
            side: "right",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tool-history");
              waitForDOMElement("#tour-tool-history-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-capacitaciones").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 14
        {
          element: "#tour-menu-capacitaciones",
          popover: {
            title: "📢 Paso 14 de 21: Charlas de Seguridad de 5 Minutos Diarias",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 3 • Cumplimiento Normativo</span>
                <p>Capacitaciones preventivas al iniciar el turno diario:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Temario de Riesgos:</strong> Bloqueo y Etiquetado LOTO, Trabajo Seguro con Fibra Óptica y Manejo Manual de Cargas.</li>
                  <li><strong>Asistencia Digital:</strong> Toma de firmas digitales de toda la cuadrilla en terreno.</li>
                  <li><strong>Certificado Exportable:</strong> Respaldo auditado ante inspecciones de la Dirección del Trabajo y comités paritarios.</li>
                </ul>
              </div>
            `,
            side: "right",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-hpt").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-btn-new-ot").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 15
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "⚡ Paso 15 de 21: Fase 4 • Emisión Rápida de la OT (+ Nueva Orden)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fae8ff; color: #86198f; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 4 • Lanzamiento de Trabajo</span>
                <p>Al pulsar <strong>+ Crear OT</strong>, el supervisor en terreno abre el formulario técnico optimizado para tablet o celular:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Folio Correlativo Inmutable:</strong> Numeración legal única generada al instante.</li>
                  <li><strong>Vinculación a Proyecto:</strong> La orden hereda automáticamente mandante, dirección y cuadrilla acreditada.</li>
                  <li><strong>Operación Rápida:</strong> Diseñado para emitirse en menos de 2 minutos bajo condiciones de terreno.</li>
                </ul>
              </div>
            `,
            side: "bottom",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-capacitaciones").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-btn-new-ot").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 16
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "📋 Paso 16 de 21: Desglose Técnico Completo de la OT",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fae8ff; color: #86198f; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 4 • Formulario Técnico por Dentro</span>
                <p>El formulario oficial desglosa con exactitud todas las etapas de faena:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 5px; font-size: 12px;">
                  <div><strong>1. Mandante & Faena:</strong> Cliente (<em>ICSA Minería - Codelco Centinela</em>), folio, contacto y ubicación (<em>Edificio Concentradora - Racks Piso 2</em>).</div>
                  <div><strong>2. Detalle Técnico:</strong> Cuantificación de <em>48 fusiones ODF monomodo</em>, <em>24 bocas de red Cat 6A</em> y mediciones con atenuación &lt; 0.02 dB.</div>
                  <div><strong>3. Cuadrilla:</strong> Asignación del técnico responsable y ayudantes de terreno.</div>
                  <div><strong>4. Fotos Comprimidas:</strong> Respaldo fotográfico del empalme optimizado para 3G.</div>
                  <div><strong>5. Doble Firma:</strong> Firma en pantalla táctil del técnico y firma del cliente.</div>
                </div>
                <div style="margin-top: 4px;">
                  <a href="/work-orders/new?demo=true" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 12px; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);">
                    📝 Abrir Formulario Real Pre-llenado con Datos Demo ↗
                  </a>
                </div>
              </div>
            `,
            side: "bottom",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-btn-new-ot").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              waitForDOMElement("#tour-orders-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 17
        {
          element: "#tour-orders-container",
          popover: {
            title: "⚡ Paso 17 de 21: Fase 5 • Monitoreo de Órdenes Activas en Faena",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 5 • Ejecución en Terreno</span>
                <p>Tablero general de seguimiento de trabajos en curso:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Estado de Ejecución:</strong> Supervisión de OTs en borrador, en desarrollo o esperando validación del mandante.</li>
                  <li><strong>Acciones Rápidas:</strong> Visualización de ficha técnica, edición de mediciones de fibra y carga de evidencias.</li>
                  <li><strong>Filtros Inmediatos:</strong> Búsqueda por folio, cliente o cuadrilla asignada.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-btn-new-ot").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              waitForDOMElement("#tour-orders-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 18
        {
          element: "#tour-orders-container",
          popover: {
            title: "✍️ Paso 18 de 21: Doble Firma Digital Híbrida (Ley 19.799)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 5 • Validación Legal</span>
                <p>Al concluir los trabajos en la sala de racks o poste:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div><strong>1. Firma Técnico (Presencial):</strong> El jefe de faena firma en el lienzo táctil con su dedo.</div>
                  <div><strong>2. Firma Cliente (Modalidad Dual):</strong>
                    <ul style="margin: 3px 0 0 14px; padding: 0; list-style-type: circle;">
                      <li><em>Presencial:</em> El cliente estampa su firma directamente en la tablet.</li>
                      <li><em>Remota por Enlace Seguro:</em> Si el cliente está en su oficina, el sistema le envía un <strong>enlace con token único por correo/WhatsApp</strong> para firmar desde su computador sin instalar nada.</li>
                    </ul>
                  </div>
                  <div><strong>3. Inmutabilidad:</strong> Con ambas firmas grabadas, la OT se bloquea y pasa al archivo histórico.</div>
                </div>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              waitForDOMElement("#tour-orders-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("order-history");
              waitForDOMElement("#tour-history-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 19
        {
          element: "#tour-history-container",
          popover: {
            title: "📄 Paso 19 de 21: Fase 6 • Facturación Inmediata & Informe Técnico en PDF",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ffedd5; color: #c2410c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 6 • Cierre Operativo y Cobro</span>
                <p>Las órdenes firmadas quedan consolidadas para facturación inmediata:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div><strong>1. Informe Formal en PDF:</strong> Pulsa el botón <em>Descargar PDF</em> para obtener el acta técnica oficial con membrete de ICSA, mediciones y firmas estampadas.</div>
                  <div><strong>2. Validez Legal:</strong> Regulada bajo Ley 19.799 de firma electrónica para cobro formal en contabilidad.</div>
                  <div><strong>3. Despacho al Mandante:</strong> Envío directo por email con respaldo fotográfico de empalmes y certificación OTDR.</div>
                </div>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              waitForDOMElement("#tour-orders-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-clients").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 20
        {
          element: "#tour-menu-clients",
          popover: {
            title: "👥 Paso 20 de 21: Administración de Clientes & Control Personal",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 800; text-transform: uppercase;">Gestión Empresarial</span>
                <p>Módulos de administración centralizada de la empresa:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Gestión Clientes:</strong> Directorio de empresas mandantes (Codelco, Entel, Minera Centinela), RUT comercial, sucursales y contactos clave.</li>
                  <li><strong>Control Personal:</strong> Fichas de técnicos, especialidades (fusionador, cableador, prevencionista) y registro de firmas digitalizadas para timbrado automático.</li>
                </ul>
              </div>
            `,
            side: "right",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("order-history");
              waitForDOMElement("#tour-history-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-floating-btn").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        // PASO 21
        {
          element: "#tour-floating-btn",
          popover: {
            title: "🎉 Paso 21 de 21: ¡Ecosistema Completo de Faena Recorrido!",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 800; text-transform: uppercase;">Demostración Exhaustiva Finalizada</span>
                <p>Has conocido en profundidad las 21 capacidades del software operativo de ICSA:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; color: #334155; font-size: 12px; display: flex; flex-direction: column; gap: 3px;">
                  <div>✅ Control de Proyectos y Acta de Cierre Consolidada.</div>
                  <div>✅ Pañol e Instrumental con firmas electrónicas de entrega y devolución.</div>
                  <div>✅ Seguridad HPT y Charlas de 5 Minutos según ley chilena.</div>
                  <div>✅ Emisión técnica de OTs y Doble Firma Híbrida (táctil / remota).</div>
                  <div>✅ Generación instantánea de actas legales en PDF para facturación.</div>
                </div>
                <p style="font-size: 12px; color: #0284c7; font-weight: 700; margin-top: 2px;">
                  🚀 Puedes usar la aplicación con total libertad o reiniciar este recorrido con el botón flotante inferior.
                </p>
              </div>
            `,
            side: "left",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-clients").then(() => {
                opts.driver.movePrevious();
              });
            }
          }
        }
      ],
      onDestroyed: () => {
        // Ensure complete DOM cleanup of any Driver.js artifacts
        if (typeof document !== "undefined") {
          document.querySelectorAll('.driver-overlay, .driver-popover, .driver-active-element, svg.driver-overlay').forEach(el => {
            try { el.remove(); } catch {}
          });
          document.body.style.overflow = '';
          document.body.style.pointerEvents = '';
        }

        if (typeof window !== "undefined") {
          sessionStorage.setItem("icsa_tour_seen", "true");
          const url = new URL(window.location.href);
          url.searchParams.delete("tour");
          url.searchParams.delete("step");
          window.history.replaceState(null, "", url.toString());
        }

        toast({
          title: "✨ Operación Normal Activada",
          description: "Tour finalizado. Ahora puedes explorar, crear proyectos, emitir órdenes de trabajo y operar la plataforma con total libertad."
        });
      }
    });

    driverRef.current = driverObj;
    driverObj.drive(startIndex);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("icsa_tour_seen", "true");
    }
  }, []);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window === "undefined") return;
    if (tourHasAutoLaunched) return;

    const params = new URLSearchParams(window.location.search);
    const forceTour = params.get("tour") === "true";
    const stepParam = params.get("step");
    const initialIndex = stepParam ? Math.max(0, parseInt(stepParam, 10) - 1) : 0;
    const alreadySeen = sessionStorage.getItem("icsa_tour_seen");

    if (forceTour || !alreadySeen) {
      tourHasAutoLaunched = true;
      const timer = setTimeout(() => {
        startTour(initialIndex);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  if (!hasMounted) return null;

  return (
    <div id="tour-floating-btn" className="fixed bottom-6 right-6 z-40 hidden md:block animate-fade-in">
      <Button
        onClick={() => startTour(0)}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black text-xs rounded-full px-5 py-6 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-white/20"
        title="Iniciar Recorrido Guiado Paso a Paso (21 Etapas)"
      >
        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
        <span>✨ Tour Guiado (21 Pasos)</span>
      </Button>
    </div>
  );
}

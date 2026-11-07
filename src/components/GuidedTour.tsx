"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (startIndex === 0 || startIndex === 1 || startIndex === 4 || startIndex === 5 || startIndex === 8) {
      onTabChangeRef.current?.("dashboard");
    } else if (startIndex === 2) {
      onTabChangeRef.current?.("projects");
    } else if (startIndex === 3) {
      onTabChangeRef.current?.("tools");
    } else if (startIndex === 6) {
      onTabChangeRef.current?.("orders");
    } else if (startIndex === 7) {
      onTabChangeRef.current?.("order-history");
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      waitForElement: 2500,
      overlayColor: "rgba(10, 25, 47, 0.85)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour!",
      steps: [
        {
          element: "#tour-welcome",
          popover: {
            title: "🔐 Paso 1: Autenticación & Perfiles de Faena",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 800; text-transform: uppercase;">Acceso al Sistema</span>
                <p>El software cuenta con segregación estricta de funciones según el perfil de cada colaborador:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li><strong>Administrador:</strong> Control de contratos, pañol, clientes y auditorías.</li>
                  <li><strong>Supervisor Técnico:</strong> Despacho de OTs, asignación de cuadrillas y firmas en terreno.</li>
                  <li><strong>Prevencionista de Riesgos:</strong> Checklists HPT y charlas de 5 minutos obligatorias.</li>
                </ul>
                <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 8px 10px; color: #115e59; font-weight: 500; font-size: 12px;">
                  💡 <strong>Ingreso Automático:</strong> Para conocer la app sin fricción, has ingresado directamente como <strong>Administrador General</strong> con permisos totales.
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
        {
          element: "#tour-stats-grid",
          popover: {
            title: "📊 Paso 2: Centro de Monitoreo & Despacho",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 800; text-transform: uppercase;">Estado Operativo en Tiempo Real</span>
                <p>Al iniciar la jornada, la jefatura supervisa el balance operacional de terreno:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Proyectos en Ejecución:</strong> Obras mineras y de telecomunicaciones en curso.</li>
                  <li><strong>Órdenes Pendientes:</strong> Trabajos que los técnicos están ejecutando en terreno.</li>
                  <li><strong>Stock en Pañol:</strong> Equipos disponibles vs. entregados bajo firma.</li>
                </ul>
                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 2px;">A continuación recorreremos el ciclo operativo completo de cómo se ejecuta una faena técnica de punta a punta.</p>
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
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        {
          element: "#tour-projects-container",
          popover: {
            title: "📁 Paso 3: Planificación de Faena & Cuadrilla",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 1 de 6 • Contrato & Cuadrilla</span>
                <p>Toda faena parte con la apertura de un proyecto de infraestructura (ej. <em>Tendido Troncal 48 Hilos - Faena Centinela</em> o <em>Nodos 5G Entel</em>):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Asignación de Personal:</strong> Se designa al supervisor a cargo y los técnicos autorizados para ingresar a faena.</li>
                  <li><strong>Control de Plazos:</strong> Fecha de inicio, fecha límite de entrega y monitoreo de avances.</li>
                  <li><strong>Trazabilidad por Mandante:</strong> Historial consolidado para ICSA Minería, Codelco, Entel o Movistar.</li>
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
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        {
          element: "#tour-tools-container",
          popover: {
            title: "🔧 Paso 4: Retiro de Instrumental en Pañol",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 2 de 6 • Trazabilidad con Firma</span>
                <p>Antes de salir a faena, los técnicos retiran los equipos industriales de alto costo (Fusionadoras Fujikura 90S+, Reflectómetros OTDR Fluke):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Retiro con Firma en Pantalla:</strong> El técnico estampa su firma biométrica en la tablet al recibir el equipo, generando un acta de entrega.</li>
                  <li><strong>Devolución Inspeccionada:</strong> Al regresar de faena, el pañolero revisa el estado físico antes de recibirlo en el sistema.</li>
                  <li><strong>Cero Pérdidas:</strong> Elimina extravíos o daños sin responsables en instrumentos de más de $5.000.000 CLP.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-container").then(() => {
                opts.driver.movePrevious();
              });
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-hpt, #tour-welcome").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        {
          element: () => (document.getElementById("tour-menu-hpt") || document.getElementById("tour-welcome") || document.body) as Element,
          popover: {
            title: "🦺 Paso 5: Seguridad Pre-Faena (HPT & Charla 5 Min)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 3 de 6 • Prevención ACHS / Mutual</span>
                <p>Al llegar al sitio y antes de intervenir líneas o subir a postes:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>HPT (Hoja de Planificación de Tarea):</strong> Checklist obligatorio de riesgos, interferencias y uso de EPPs certificados (arnés dieléctrico, detector de tensión).</li>
                  <li><strong>Charla de Seguridad de 5 Minutos:</strong> Registro de temario diario y toma de firmas digitales de toda la cuadrilla en terreno.</li>
                  <li><strong>Cumplimiento Legal:</strong> Respaldo auditado ante inspecciones de mutualidades y gerencia de faena.</li>
                </ul>
              </div>
            `,
            side: "right",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              waitForDOMElement("#tour-tools-container").then(() => {
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
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "📋 Paso 6: ¿Cómo se Crea una OT en Terreno? (Paso a Paso)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fae8ff; color: #86198f; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 4 de 6 • Emisión Técnica en Faena</span>
                <p>Al presionar <strong>+ Nueva Orden de Trabajo</strong>, el supervisor en terreno completa el formulario técnico optimizado para celular/tablet:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div><strong>1. Selección de Mandante y Obra:</strong> Se elige el cliente (ej: <em>ICSA Minería</em>) y el proyecto activo. El sistema autocompleta RUT, teléfono, contacto y dirección de faena.</div>
                  <div><strong>2. Especificación Técnica:</strong> Se define la labor (<em>Fusión Fibra Óptica</em>, <em>Certificación OTDR</em> o <em>Cableado Cat 6A</em>) y se cuantifican mufas e hilos intervenidos.</div>
                  <div><strong>3. Asignación de Cuadrilla:</strong> Se asigna el técnico responsable y su ayudante de terreno.</div>
                </div>
                <div style="display: flex; gap: 6px; align-items: center; justify-content: space-between; margin-top: 4px;">
                  <span style="font-size: 11px; color: #64748b;">⏱️ Tiempo de llenado: <strong>&lt; 2 minutos</strong></span>
                  <a href="/work-orders/new" target="_blank" style="display: inline-block; background: #0d9488; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 11px;">Abrir Formulario en Vivo ↗</a>
                </div>
              </div>
            `,
            side: "bottom",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-hpt, #tour-welcome").then(() => {
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
        {
          element: "#tour-orders-container",
          popover: {
            title: "⚡ Paso 7: Ejecución en Terreno & Doble Firma Digital",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 5 de 6 • Validación Técnica y Cierre</span>
                <p>Una vez terminada la labor física en el poste, mufa o data center, el técnico cierra la faena en la app:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div><strong>📸 Evidencia Fotográfica:</strong> Se capturan fotos del empalme y reflectometría. El software las comprime en el celular para subirlas sin error con señal débil (3G).</div>
                  <div><strong>✍️ Firma 1 (Técnico):</strong> El técnico a cargo estampa su firma en la pantalla validando la ejecución.</div>
                  <div><strong>✍️ Firma 2 (Cliente):</strong>
                    <ul style="margin: 3px 0 0 14px; padding: 0; list-style-type: circle;">
                      <li><em>Presencial:</em> El supervisor del cliente firma con su dedo en la tablet.</li>
                      <li><em>Remota por Email:</em> Si el cliente está en su oficina, el sistema le envía un <strong>enlace seguro con token único</strong> para firmar desde su computador.</li>
                    </ul>
                  </div>
                </div>
                <p style="font-size: 12px; color: #047857; font-weight: 600; margin-top: 2px;">✅ Con ambas firmas estampadas, la OT se bloquea contra modificaciones y pasa a Historial.</p>
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
              onTabChangeRef.current?.("order-history");
              waitForDOMElement("#tour-history-container").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        {
          element: "#tour-history-container",
          popover: {
            title: "📄 Paso 8: Generación Automática del Acta en PDF",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ffedd5; color: #c2410c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 6 de 6 • Facturación Inmediata</span>
                <p>Al quedar la orden firmada, el sistema consolida automáticamente todo el expediente:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                  <div><strong>1. Expediente Completo:</strong> Folio único, datos de cliente, detalles técnicos, fotos de respaldo del empalme y ambas firmas estampadas.</div>
                  <div><strong>2. Descarga en 1 Clic:</strong> Presiona el icono <span style="background: #e2e8f0; padding: 1px 6px; border-radius: 4px; font-weight: bold;">📥 Descargar PDF</span> en cualquier orden del historial para ver el informe real.</div>
                  <div><strong>3. Cobro Inmediato:</strong> El PDF generado tiene validez legal y se despacha a contabilidad para cursar el estado de pago de inmediato sin esperar días de redacción manual.</div>
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
              waitForDOMElement("#tour-floating-btn").then(() => {
                opts.driver.moveNext();
              });
            }
          }
        },
        {
          element: "#tour-floating-btn",
          popover: {
            title: "🎉 Paso 9: ¡Ciclo de Faena Completado!",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #e0f2fe; color: #0284c7; font-size: 11px; font-weight: 800; text-transform: uppercase;">Demostración Finalizada</span>
                <p>Has recorrido el flujo operativo completo: desde la adjudicación de obra y retiro de herramientas, hasta la firma digital y generación del PDF de cobro.</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; color: #334155; font-size: 12px;">
                  👉 <strong>¡Pruébalo libremente!</strong> Puedes crear órdenes, devolver herramientas, descargar informes o reiniciar este tour con el botón flotante inferior.
                </div>
              </div>
            `,
            side: "left",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("order-history");
              waitForDOMElement("#tour-history-container").then(() => {
                opts.driver.movePrevious();
              });
            }
          }
        }
      ],
      onDestroyed: () => {
        onTabChangeRef.current?.("dashboard");
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("tour");
          url.searchParams.delete("step");
          window.history.replaceState(null, "", url.toString());
        }
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
        title="Iniciar Recorrido Guiado Paso a Paso"
      >
        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
        <span>✨ Tour Guiado</span>
      </Button>
    </div>
  );
}

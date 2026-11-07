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
                <p>El software cuenta con segregación estricta de funciones según el perfil del usuario:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 3px;">
                  <li><strong>Administrador:</strong> Control de contratos, pañol, clientes y auditorías.</li>
                  <li><strong>Supervisor Técnico:</strong> Despacho de OTs, asignación de cuadrillas y firmas.</li>
                  <li><strong>Prevencionista de Riesgos:</strong> Checklists HPT y charlas obligatorias.</li>
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
                <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 2px;">A continuación recorreremos el ciclo operativo completo de una faena técnica paso a paso.</p>
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
            title: "📋 Paso 6: Emisión Rápida de la Orden de Trabajo",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #fae8ff; color: #86198f; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 4 de 6 • Despacho Digital</span>
                <p>El supervisor o técnico presiona este botón para abrir la OT en terreno desde su celular o tablet:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Asignación Automática:</strong> Vincula la orden a la obra minera y cliente respectivo.</li>
                  <li><strong>Ubicación Exacta:</strong> Registra dirección, planta concentradora o cámara subterránea a intervenir.</li>
                  <li><strong>Emisión en 2 Minutos:</strong> Cero formularios de papel, disponible de inmediato para el equipo en terreno.</li>
                </ul>
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
            title: "⚡ Paso 7: Ejecución & Firma Digital Híbrida",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 5 de 6 • Firma en Pantalla o Remota</span>
                <p>Durante y al terminar las labores técnicas (fusión, empalme, cableado estructurado):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Fotos Comprimidas de Respaldo:</strong> Subida optimizada de evidencias fotográficas para redes móviles lentas (3G) en faena.</li>
                  <li><strong>Firma Presencial en Pantalla:</strong> El cliente valida el servicio con su dedo en la tablet del técnico.</li>
                  <li><strong>Firma Remota por Email con Token:</strong> Si el supervisor del cliente no está en terreno, se le envía un enlace seguro con token para firmar a distancia desde su oficina.</li>
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
            title: "📄 Paso 8: Informe Técnico Final en PDF",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <span style="display:inline-block; width: fit-content; padding: 2px 10px; border-radius: 9999px; background: #ffedd5; color: #c2410c; font-size: 11px; font-weight: 800; text-transform: uppercase;">Fase 6 de 6 • Facturación Inmediata</span>
                <p>Al completarse la orden, el motor del software consolida todo el expediente en un solo informe técnico formal en PDF:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Consolidación Automática:</strong> Folio, materiales utilizados, fotografías de evidencia, mediciones reflectométricas y ambas firmas digitales estampadas.</li>
                  <li><strong>Descarga en 1 Clic:</strong> Presiona el icono de descarga en cualquier orden del historial para obtener el acta formal en PDF.</li>
                  <li><strong>Cobro Rápido:</strong> Se envía directamente a contabilidad o al mandante para tramitar el estado de pago sin esperar días de procesamiento manual.</li>
                </ul>
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

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

    // Pre-select initial tab if needed
    if (startIndex === 0 || startIndex === 1 || startIndex === 4 || startIndex === 6 || startIndex === 8) {
      onTabChangeRef.current?.("dashboard");
    } else if (startIndex === 2) {
      onTabChangeRef.current?.("projects");
    } else if (startIndex === 3) {
      onTabChangeRef.current?.("orders");
    } else if (startIndex === 5) {
      onTabChangeRef.current?.("tools");
    } else if (startIndex === 7) {
      onTabChangeRef.current?.("order-history");
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      waitForElement: 2000,
      overlayColor: "rgba(10, 25, 47, 0.85)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour!",
      steps: [
        {
          element: "#tour-welcome",
          popover: {
            title: "🔐 Paso 1: Autenticación & Control de Roles (Omitido)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>El sistema cuenta con segregación estricta de funciones para <strong>Administradores</strong>, <strong>Supervisores de Faena</strong> y <strong>Prevención de Riesgos</strong>.</p>
                <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 8px 10px; color: #115e59; font-weight: 500;">
                  💡 <strong>Demostración Activa:</strong> Para que conozcas la aplicación sin fricción, <strong>el login se completó automáticamente</strong> como <strong>Administrador General</strong>, dándote acceso total a todos los módulos y herramientas.
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
            title: "📊 Paso 2: Panel de Control (KPIs y Estado Operativo)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Aquí la jefatura supervisa en tiempo real las operaciones de la jornada:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Proyectos en Ejecución:</strong> Obras activas y cuadrillas asignadas.</li>
                  <li><strong>Órdenes Pendientes:</strong> Tareas en terreno con técnicos en faena.</li>
                  <li><strong>Inventario en Pañol:</strong> Conteo de herramientas disponibles vs. en terreno.</li>
                </ul>
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
            title: "📁 Paso 3: Vista de Proyectos & Contratos Activos",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Módulo de gestión de contratos de infraestructura (Entel, Movistar, faenas mineras):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Asignación de Cuadrillas:</strong> Define jefes de cuadrilla y técnicos autorizados.</li>
                  <li><strong>Plazos Contractuales:</strong> Monitoreo de fecha de inicio y entrega estimada.</li>
                  <li><strong>Buscador en Tiempo Real:</strong> Filtra por nombre de contrato o razón social del cliente.</li>
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
            title: "⚡ Paso 4: Órdenes de Trabajo en Terreno (OTs)",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>¡Digitalización completa de faenas sin usar papel!</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Folios Técnicos Únicos:</strong> Registro de materiales, cables y mediciones ópticas.</li>
                  <li><strong>Fotos Comprimidas:</strong> Subida optimizada en terreno para faenas con baja señal móvil (3G).</li>
                  <li><strong>Firma Digital Híbrida:</strong> Firma presencial en pantalla con el dedo, o envío de enlace seguro por correo para que el cliente firme a distancia.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              waitForDOMElement("#tour-projects-container").then(() => {
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
            title: "📋 Paso 5: Emisión Rápida de Nuevas OTs en Faena",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Los supervisores en terreno pueden presionar este botón desde su smartphone o tablet para abrir el formulario de emisión técnica:</p>
                <p>Permite vincular la OT a un cliente, proyecto minero, ingresar dirección de intervención y asignar técnicos en menos de 2 minutos.</p>
              </div>
            `,
            side: "bottom",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              waitForDOMElement("#tour-orders-container").then(() => {
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
            title: "🔧 Paso 6: Control de Herramientas de Alto Costo",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Control de pañol para instrumentos críticos (fusionadoras de fibra, OTDRs, taladros y generadores):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Toma con Firma en Pantalla:</strong> Para retirar un equipo, el técnico debe estampar su firma digital en la tablet.</li>
                  <li><strong>Devolución Verificada:</strong> El pañolero revisa el estado físico antes de recibir, evitando extravíos.</li>
                  <li><strong>Botón Nueva Herramienta:</strong> Permite ingresar nuevos equipos con código interno, marca, modelo y serie.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-btn-new-ot").then(() => {
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
            title: "🦺 Paso 7: Prevención de Riesgos & Charlas HPT",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Módulo de cumplimiento normativo y seguridad laboral para mutualidades (ACHS / Mutual):</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>HPT (Hoja de Planificación del Trabajo):</strong> Checklists obligatorios de EPP antes de intervenir faenas eléctricas o en altura.</li>
                  <li><strong>Charlas de Seguridad de 5 Minutos:</strong> Registro de temario operativo con firma de asistencia de toda la cuadrilla.</li>
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
            title: "📄 Paso 8: Historial & Actas de Cierre en PDF",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Al concluir faenas, el sistema genera automáticamente el expediente técnico:</p>
                <ul style="padding-left: 16px; margin: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 4px;">
                  <li><strong>Consolidación en 1 Clic:</strong> Agrupa materiales, fotos de respaldo, datos de cliente y firmas capturadas.</li>
                  <li><strong>Descarga en PDF Oficial:</strong> Acta formal lista para enviar a cobro, facturación o auditoría técnica.</li>
                </ul>
              </div>
            `,
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              waitForDOMElement("#tour-menu-hpt, #tour-welcome").then(() => {
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
            title: "🎉 Paso 9: ¡Todo Listo para Operar!",
            description: `
              <div style="font-size: 13px; line-height: 1.5; color: #334155; display: flex; flex-direction: column; gap: 8px;">
                <p>Has recorrido todos los módulos del software de ICSA. Ahora puedes interactuar libremente con la aplicación o reiniciar el recorrido cuando desees.</p>
                <p style="font-size: 11px; color: #64748b; font-weight: 600;">Este botón flotante permanece disponible para repetir el tour en cualquier momento.</p>
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

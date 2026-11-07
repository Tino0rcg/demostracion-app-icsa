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
      skipMissingElement: true,
      waitForElement: 1500,
      overlayColor: "rgba(10, 25, 47, 0.85)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour!",
      steps: [
        {
          element: "#tour-welcome",
          popover: {
            title: "🔐 Paso 1: Autenticación & Control de Roles (Omitido)",
            description: "Has ingresado automáticamente como <strong>Administrador General</strong> sin digitar credenciales. El software cuenta con segregación estricta de funciones para Supervisores de Faena, Prevención de Riesgos y Gerencia.",
            side: "bottom",
            align: "start",
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              opts.driver.moveNext();
            }
          }
        },
        {
          element: "#tour-stats-grid",
          popover: {
            title: "📊 Paso 2: KPIs y Métricas Operativas en Vivo",
            description: "Panel central de control con visibilidad inmediata del estado de proyectos en faena, visitas técnicas de la jornada y disponibilidad de herramientas en pañol.",
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              opts.driver.movePrevious();
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-projects-container",
          popover: {
            title: "📁 Paso 3: Vista de Proyectos & Contratos Activos",
            description: "Gestión centralizada de contratos de infraestructura y telecomunicaciones. Permite supervisar cuadrillas asignadas, avances de obra y plazos contractuales.",
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-orders-container",
          popover: {
            title: "⚡ Paso 4: Órdenes de Trabajo en Terreno (OTs)",
            description: "Digitalización total de faena: folios técnicos, registro de materiales y cables, compresión de fotos para redes 3G/4G y captura de firmas en terreno o a distancia.",
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("projects");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "📋 Paso 5: Emisión de Nuevas OTs en Faena",
            description: "Los supervisores en terreno pueden crear y despachar una nueva orden técnica en segundos desde cualquier smartphone o tablet.",
            side: "bottom",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("orders");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-tools-container",
          popover: {
            title: "🔧 Paso 6: Control de Herramientas de Alto Costo",
            description: "Inventario de fusionadoras de fibra, OTDRs y taladros. Trazabilidad estricta: requiere firma digital en pantalla para retirar y devolver equipos sin pérdidas de inventario.",
            side: "top",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: () => (document.getElementById("tour-menu-hpt") || document.getElementById("tour-welcome") || document.body) as Element,
          popover: {
            title: "🦺 Paso 7: Prevención de Riesgos & Charlas HPT",
            description: "Cumplimiento normativo de mutualidades: checklists obligatorios de EPP antes de iniciar faenas peligrosas y registro de charlas operativas de 5 minutos con firmas de asistencia.",
            side: "right",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("tools");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("order-history");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-history-container",
          popover: {
            title: "📄 Paso 8: Historial & Actas de Cierre en PDF",
            description: "Al concluir faenas, el motor consolida automáticamente materiales, fotos comprimidas y firmas en un acta técnica oficial en PDF lista para cobrar o auditar.",
            side: "top",
            align: "start",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
            },
            onNextClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("dashboard");
              setTimeout(() => {
                opts.driver.moveNext();
              }, 250);
            }
          }
        },
        {
          element: "#tour-floating-btn",
          popover: {
            title: "🎉 Paso 9: ¡Recorrido Completo!",
            description: "Has explorado todos los módulos del software de ICSA. Ahora puedes interactuar libremente con la aplicación o reiniciar el recorrido cuando desees.",
            side: "left",
            align: "center",
            onPrevClick: (_el, _step, opts) => {
              onTabChangeRef.current?.("order-history");
              setTimeout(() => {
                opts.driver.movePrevious();
              }, 250);
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

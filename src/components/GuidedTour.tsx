"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuidedTourProps {
  onTabChange?: (tab: string) => void;
}

export function GuidedTour({ onTabChange }: GuidedTourProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const driverRef = useRef<Driver | null>(null);

  const startTour = useCallback(() => {
    // Start at dashboard tab
    onTabChange?.("dashboard");

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      waitForElement: 800,
      overlayColor: "rgba(10, 25, 47, 0.85)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour!",
      steps: [
        {
          element: "#tour-welcome",
          popover: {
            title: "👋 1. Bienvenido a ICSA Ingeniería",
            description: "Has ingresado directamente como **Administrador General** sin necesidad de digitar contraseñas. El software cuenta con autenticación multi-rol para técnicos, supervisores y prevención de riesgos.",
            side: "bottom",
            align: "start"
          },
          onHighlightStarted: () => {
            onTabChange?.("dashboard");
          }
        },
        {
          element: "#tour-stats-grid",
          popover: {
            title: "📊 2. KPIs y Métricas Operativas en Vivo",
            description: "Panel de control con visibilidad inmediata de proyectos en curso, visitas técnicas de la jornada y estado del inventario de herramientas.",
            side: "top",
            align: "start"
          },
          onHighlightStarted: () => {
            onTabChange?.("dashboard");
          }
        },
        {
          element: "#tour-projects-container",
          popover: {
            title: "📁 3. Vista de Proyectos & Contratos Activos",
            description: "Aquí se agrupan los contratos con clientes de telecomunicaciones e infraestructura. Permite supervisar el equipo técnico asignado y los plazos contractuales.",
            side: "top",
            align: "start"
          },
          onHighlightStarted: () => {
            onTabChange?.("projects");
          }
        },
        {
          element: "#tour-orders-container",
          popover: {
            title: "⚡ 4. Órdenes de Trabajo en Terreno (OTs)",
            description: "¡Adiós al lápiz y papel! Cada orden cuenta con folio oficial, registro de cables, evidencia fotográfica comprimida para redes 3G y toma de firmas presenciales o a distancia por correo.",
            side: "top",
            align: "start"
          },
          onHighlightStarted: () => {
            onTabChange?.("orders");
          }
        },
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "📋 5. Emisión de Nuevas OTs en Faena",
            description: "Los supervisores en terreno presionan aquí desde su teléfono o tablet para crear una nueva orden de trabajo técnica en segundos.",
            side: "bottom",
            align: "center"
          },
          onHighlightStarted: () => {
            onTabChange?.("dashboard");
          }
        },
        {
          element: "#tour-tools-container",
          popover: {
            title: "🔧 6. Control de Herramientas de Alto Costo",
            description: "Inventario de fusionadoras de fibra, OTDRs y taladros. Trazabilidad estricta: requiere firma digital obligatoria en pantalla para retirar y devolver equipos sin pérdidas.",
            side: "top",
            align: "center"
          },
          onHighlightStarted: () => {
            onTabChange?.("tools");
          }
        },
        {
          element: "#tour-menu-hpt",
          popover: {
            title: "🦺 7. Prevención de Riesgos (Cumplimiento de Ley)",
            description: "Checklists obligatorios de EPP antes de iniciar faenas peligrosas y registro de charlas de seguridad de 5 minutos con firmas de asistencia para mutualidades.",
            side: "right",
            align: "center"
          }
        },
        {
          element: "#tour-history-container",
          popover: {
            title: "📄 8. Historial & Actas de Cierre en PDF",
            description: "Al finalizar una orden o proyecto, el sistema consolida automáticamente materiales, fotos comprimidas y firmas en un acta PDF formal lista para cobrar.",
            side: "top",
            align: "start"
          },
          onHighlightStarted: () => {
            onTabChange?.("order-history");
          }
        },
        {
          element: "#tour-floating-btn",
          popover: {
            title: "🎉 ¡Recorrido Completo!",
            description: "Has explorado todos los módulos operativos del software de ICSA. Ahora puedes interactuar libremente con la aplicación o reiniciar el recorrido cuando desees.",
            side: "left",
            align: "center"
          },
          onHighlightStarted: () => {
            onTabChange?.("dashboard");
          }
        }
      ],
      onDestroyed: () => {
        onTabChange?.("dashboard");
      }
    });

    driverRef.current = driverObj;
    driverObj.drive();
    localStorage.setItem("icsa_tour_completed", "true");
  }, [onTabChange]);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const forceTour = params.get("tour") === "true";
    const completed = localStorage.getItem("icsa_tour_completed");

    if (forceTour || !completed) {
      const timer = setTimeout(() => {
        startTour();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  if (!hasMounted) return null;

  return (
    <div id="tour-floating-btn" className="fixed bottom-6 right-6 z-40 hidden md:block animate-fade-in">
      <Button
        onClick={startTour}
        className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black text-xs rounded-full px-5 py-6 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-white/20"
        title="Iniciar Recorrido Guiado Paso a Paso"
      >
        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
        <span>✨ Tour Guiado</span>
      </Button>
    </div>
  );
}

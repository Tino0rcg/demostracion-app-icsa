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

  const startTour = useCallback((startIndex = 0) => {
    // If starting at index 0 or 1, make sure dashboard tab is selected
    if (startIndex === 0 || startIndex === 1 || startIndex === 4 || startIndex === 8) {
      onTabChange?.("dashboard");
    } else if (startIndex === 2) {
      onTabChange?.("projects");
    } else if (startIndex === 3) {
      onTabChange?.("orders");
    } else if (startIndex === 5) {
      onTabChange?.("tools");
    } else if (startIndex === 7) {
      onTabChange?.("order-history");
    }

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
            title: "🔐 Paso 1: Autenticación & Control de Roles (Omitido)",
            description: "Has ingresado automáticamente como <strong>Administrador General</strong> sin digitar credenciales. El software cuenta con segregación estricta de funciones para Supervisores de Faena, Prevención de Riesgos y Gerencia.",
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
            title: "📊 Paso 2: KPIs y Métricas Operativas en Vivo",
            description: "Panel central de control con visibilidad inmediata del estado de proyectos en faena, visitas técnicas de la jornada y disponibilidad de herramientas en pañol.",
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
            title: "📁 Paso 3: Vista de Proyectos & Contratos Activos",
            description: "Gestión centralizada de contratos de infraestructura y telecomunicaciones. Permite supervisar cuadrillas asignadas, avances de obra y plazos contractuales.",
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
            title: "⚡ Paso 4: Órdenes de Trabajo en Terreno (OTs)",
            description: "Digitalización total de faena: folios técnicos, registro de materiales y cables, compresión de fotos para redes 3G/4G y captura de firmas en terreno o a distancia.",
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
            title: "📋 Paso 5: Emisión de Nuevas OTs en Faena",
            description: "Los supervisores en terreno pueden crear y despachar una nueva orden técnica en segundos desde cualquier smartphone o tablet.",
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
            title: "🔧 Paso 6: Control de Herramientas de Alto Costo",
            description: "Inventario de fusionadoras de fibra, OTDRs y taladros. Trazabilidad estricta: requiere firma digital en pantalla para retirar y devolver equipos sin pérdidas de inventario.",
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
            title: "🦺 Paso 7: Prevención de Riesgos & Charlas HPT",
            description: "Cumplimiento normativo de mutualidades: checklists obligatorios de EPP antes de iniciar faenas peligrosas y registro de charlas operativas de 5 minutos con firmas de asistencia.",
            side: "right",
            align: "center"
          }
        },
        {
          element: "#tour-history-container",
          popover: {
            title: "📄 Paso 8: Historial & Actas de Cierre en PDF",
            description: "Al concluir faenas, el motor consolida automáticamente materiales, fotos comprimidas y firmas en un acta técnica oficial en PDF lista para cobrar o auditar.",
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
            title: "🎉 Paso 9: ¡Recorrido Completo!",
            description: "Has explorado todos los módulos del software de ICSA. Ahora puedes interactuar libremente con la aplicación o reiniciar el recorrido cuando desees.",
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
    driverObj.drive(startIndex);
    localStorage.setItem("icsa_tour_completed", "true");
  }, [onTabChange]);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const forceTour = params.get("tour") === "true";
    const stepParam = params.get("step");
    const initialIndex = stepParam ? Math.max(0, parseInt(stepParam, 10) - 1) : 0;
    const completed = localStorage.getItem("icsa_tour_completed");

    if (forceTour || !completed) {
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

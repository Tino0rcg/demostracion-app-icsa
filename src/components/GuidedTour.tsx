"use client";

import React, { useEffect, useState, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuidedTour() {
  const [hasSeenTour, setHasSeenTour] = useState(true);

  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: "rgba(10, 25, 47, 0.8)",
      nextBtnText: "Siguiente →",
      prevBtnText: "← Anterior",
      doneBtnText: "¡Finalizar Tour!",
      steps: [
        {
          element: "#tour-welcome",
          popover: {
            title: "👋 Bienvenido al Portal ICSA",
            description: "Este es el centro de control operativo de ICSA Ingeniería. Desde aquí se digitalizan las faenas en terreno, eliminando las carpetas de papel.",
            side: "bottom",
            align: "start"
          }
        },
        {
          element: "#tour-btn-new-ot",
          popover: {
            title: "📋 Crear Nueva Orden de Trabajo (OT)",
            description: "El técnico o supervisor presiona aquí para registrar una faena, detallar puntos de red, subir fotos comprimidas y pedir firmas en pantalla táctil.",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-btn-new-project",
          popover: {
            title: "📁 Nuevo Proyecto & Asignación",
            description: "Agrupa múltiples órdenes de trabajo bajo un solo contrato y asigna cuadrillas de supervisores y técnicos.",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-card-projects",
          popover: {
            title: "📊 Proyectos en Ejecución",
            description: "Supervisa en tiempo real el avance de cada faena, porcentaje de completitud y estado de las cuadrillas.",
            side: "top",
            align: "start"
          }
        },
        {
          element: "#tour-card-orders",
          popover: {
            title: "⚡ Órdenes de Trabajo Activas & PDF",
            description: "Revisa las órdenes firmadas en terreno o por enlace remoto seguro. Al completarse, se genera y envía automáticamente el informe PDF oficial.",
            side: "top",
            align: "start"
          }
        },
        {
          element: "#tour-card-tools",
          popover: {
            title: "🔧 Control de Herramientas de Alto Valor",
            description: "Control de inventario sin pérdidas (fusionadoras, OTDRs, taladros). Requiere firma digital obligatoria en pantalla para retirar y devolver equipos.",
            side: "top",
            align: "center"
          }
        },
        {
          element: "#tour-menu-hpt",
          popover: {
            title: "🦺 Seguridad Laboral & Charlas (HPT)",
            description: "Cumplimiento estricto de mutualidades: registro de charlas de 5 minutos antes de iniciar faenas de riesgo con firmas de asistencia.",
            side: "right",
            align: "center"
          }
        }
      ]
    });

    driverObj.drive();
    localStorage.setItem("icsa_tour_completed", "true");
    setHasSeenTour(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const forceTour = params.get("tour") === "true";
    const completed = localStorage.getItem("icsa_tour_completed");

    if (forceTour || !completed) {
      const timer = setTimeout(() => {
        startTour();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block animate-fade-in">
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

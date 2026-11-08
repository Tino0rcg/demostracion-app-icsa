"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, ChevronLeft, ChevronRight, X, ExternalLink, CheckCircle2, Shield, Wrench, Briefcase, ClipboardList, FileText, ArrowRight, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GuidedTourProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

interface TourStep {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  elementId?: string;
  tab: string;
  actionText: string;
  detail: string;
  isOtShowcase?: boolean;
}

const STEPS: TourStep[] = [
  // PASO 1
  {
    id: "step-1",
    badge: "Inicio • Rol Administrador",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "1. Panel de Bienvenida y Roles",
    elementId: "tour-welcome",
    tab: "dashboard",
    actionText: "Observa tu perfil en la cabecera",
    detail: "Estás conectado como Administrador General con permisos totales sobre obras, clientes, técnicos y pañol."
  },
  // PASO 2
  {
    id: "step-2",
    badge: "Supervisión en Vivo",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    title: "2. Centro de Control & KPIs",
    elementId: "tour-stats-grid",
    tab: "dashboard",
    actionText: "Revisa el balance general de operaciones",
    detail: "Muestra cuántos proyectos están en ejecución, las órdenes de trabajo pendientes o en desarrollo y el instrumental en terreno."
  },
  // PASO 3
  {
    id: "step-3",
    badge: "Proyectos Integrales",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "3. Proyectos Recientes o en Ejecución",
    elementId: "tour-card-projects",
    tab: "dashboard",
    actionText: "Pulsa sobre esta tarjeta para gestionar proyectos",
    detail: "Muestra los proyectos que se han realizado recientemente o están en ejecución. Los proyectos agrupan trabajos de mayor envergadura y contienen todas las OTs que se requieran; al finalizar, el sistema genera automáticamente un Acta o Informe Final consolidado con doble firma (supervisor y receptor del cliente), ya sea presencial en pantalla o enviada para firma remota."
  },
  // PASO 4: ÓRDENES PENDIENTES
  {
    id: "step-4",
    badge: "Cola de Terreno",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    title: "4. Órdenes de Trabajo Pendientes",
    elementId: "tour-card-orders",
    tab: "dashboard",
    actionText: "Pulsa sobre esta tarjeta para ver OTs en curso",
    detail: "Supervisa en tiempo real las órdenes de trabajo que aún no están terminadas o siguen pendientes en terreno por alguna razón, con folio único y técnico a cargo."
  },
  // PASO 5
  {
    id: "step-5",
    badge: "Fase 1 • Planificación",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "5. Pestaña de Proyectos Activos",
    elementId: "tour-projects-container",
    tab: "projects",
    actionText: "Revisa el listado de contratos",
    detail: "Aquí se registran las obras de ingeniería, asignando jefes de cuadrilla y acreditaciones para trabajos en terreno."
  },
  // PASO 6
  {
    id: "step-6",
    badge: "Filtro Rápido",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "6. Buscador Predictivo de Proyectos",
    elementId: "tour-projects-search",
    tab: "projects",
    actionText: "Escribe aquí para buscar obras",
    detail: "Filtra en milisegundos por nombre de proyecto (ej. 'Centinela'), cliente mandante o RUT comercial."
  },
  // PASO 7
  {
    id: "step-7",
    badge: "Función Estrella • Cobro",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    title: "7. Botón '+ Nuevo Proyecto' & Acta Final",
    elementId: "tour-btn-new-project",
    tab: "projects",
    actionText: "Haz clic aquí para crear una obra",
    detail: "Permite abrir nuevos proyectos y genera el Acta Consolidada de Liquidación que agrupa todas las OTs para facturación inmediata."
  },
  // PASO 8
  {
    id: "step-8",
    badge: "Auditoría Legal",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    title: "8. Historial & Archivo de Proyectos",
    elementId: "tour-projects-history-container",
    tab: "project-history",
    actionText: "Consulta proyectos concluidos",
    detail: "Filtra por rango de fechas (Desde / Hasta) para auditorías mineras, tributarias y balances anuales."
  },
  // PASO 9
  {
    id: "step-9",
    badge: "Fase 2 • Pañol",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    title: "9. Pañol de Instrumental Crítico",
    elementId: "tour-tools-container",
    tab: "tools",
    actionText: "Controla equipos de alto costo",
    detail: "Monitorea fusionadoras Fujikura 90S+, reflectómetros OTDR Fluke Networks y stock disponible vs. en terreno."
  },
  // PASO 10
  {
    id: "step-10",
    badge: "Fase 2 • Cero Pérdidas",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    title: "10. Despacho con Firma Digital",
    elementId: "tour-tools-container",
    tab: "tools",
    actionText: "Pulsa 'Asignar / Retirar' en un equipo",
    detail: "El técnico estampa su firma biométrica en la tablet/celular acreditando la recepción conforme con número de serie inmutable."
  },
  // PASO 11
  {
    id: "step-11",
    badge: "Fase 2 • Retorno Ágil",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    title: "11. Devolución por Lote en 1 Clic",
    elementId: "tour-tools-container",
    tab: "tools",
    actionText: "Cada técnico ve 'Mis Herramientas'",
    detail: "Al terminar el turno, el técnico selecciona todas sus herramientas y las devuelve en 1 solo paso con inspección física."
  },
  // PASO 12: MÓDULO DE SEGURIDAD & HPT
  {
    id: "step-12",
    badge: "Fase 3 • Seguridad ACHS / Mutual",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    title: "12. Seguridad en Terreno: HPT (Hoja de Planificación del Trabajo)",
    elementId: "tour-card-safety",
    tab: "dashboard",
    actionText: "Pulsa aquí para gestionar las HPTs de Seguridad",
    detail: "Obligatorio antes de iniciar el trabajo: se evalúan los riesgos críticos (altura física, electricidad, espacios confinados), se verifica el EPP normado y se toma la firma de la cuadrilla. El documento se envía al departamento de Prevención de Riesgos, quien valida y firma de forma remota, despachando el PDF oficial por correo."
  },
  // PASO 13: CHARLAS DE SEGURIDAD
  {
    id: "step-13",
    badge: "Fase 3 • Prevención & Capacitación",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "13. Charlas de Seguridad (5 Minutos Diarias)",
    elementId: "tour-card-charlas",
    tab: "dashboard",
    actionText: "Pulsa aquí para registrar o revisar Charlas",
    detail: "Registro obligatorio de inducciones diarias y Derecho a Saber (DAS). Permite ingresar el temario técnico y de seguridad de la jornada y recolectar las firmas táctiles en pantalla de cada técnico asistente, generando el acta formal de capacitación en PDF."
  },
  // PASO 14: EL PROCESO DE LA OT POR DENTRO (BOTÓN CREAR OT)
  {
    id: "step-14",
    badge: "Fase 4 • Emisión de la OT",
    badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    title: "14. ¡Aquí emites una Orden de Trabajo!",
    elementId: "tour-btn-new-ot",
    tab: "dashboard",
    actionText: "Haz clic en '+ Crear OT'",
    detail: "Este botón abre el formulario oficial de terreno optimizado para tablet o celular.",
    isOtShowcase: true
  },
  // PASO 15
  {
    id: "step-15",
    badge: "Fase 5 • Ejecución Terreno",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "15. Monitoreo de Órdenes Activas",
    elementId: "tour-orders-container",
    tab: "orders",
    actionText: "Supervisa el estado de las cuadrillas",
    detail: "Revisa OTs en borrador, en desarrollo o esperando validación, con mediciones ópticas guardadas por puerto."
  },
  // PASO 16
  {
    id: "step-16",
    badge: "Doble Firma Legal Ley 19.799",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "16. Doble Firma Digital Híbrida",
    elementId: "tour-orders-container",
    tab: "orders",
    actionText: "Valida el trabajo ejecutado",
    detail: "Firma 1 (Técnico en pantalla) + Firma 2 (Cliente presencial en tablet O remota por WhatsApp/email con token seguro)."
  },
  // PASO 17
  {
    id: "step-17",
    badge: "Fase 6 • Cierre y Cobro",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "17. Informe Formal en PDF & Fin del Tour",
    elementId: "tour-history-container",
    tab: "order-history",
    actionText: "Pulsa 'Descargar PDF' para facturación",
    detail: "Genera el acta oficial membretada con firmas y fotos. El tour ha finalizado: ¡ya puedes usar la app con total normalidad!"
  }
];

export function GuidedTour({ onTabChange }: GuidedTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number; bottom: number; right: number } | null>(null);
  const { toast } = useToast();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTargetRect(null);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("icsa_tour_seen", "true");
      const url = new URL(window.location.href);
      url.searchParams.delete("tour");
      url.searchParams.delete("step");
      window.history.replaceState(null, "", url.toString());
    }

    toast({
      title: "✨ Operación Normal Activada",
      description: "Tour finalizado. Ahora puedes explorar, crear proyectos, emitir órdenes de trabajo y operar con total libertad."
    });
  }, [toast]);

  const handleStartTour = useCallback((startIndex = 0) => {
    const validIndex = Math.max(0, Math.min(startIndex, STEPS.length - 1));
    setCurrentStep(validIndex);
    setIsOpen(true);
    const step = STEPS[validIndex];
    if (step.tab) {
      onTabChange?.(step.tab);
    }
  }, [onTabChange]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      const step = STEPS[nextIndex];
      if (step.tab) {
        onTabChange?.(step.tab);
      }
    } else {
      handleClose();
    }
  }, [currentStep, onTabChange, handleClose]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      const step = STEPS[prevIndex];
      if (step.tab) {
        onTabChange?.(step.tab);
      }
    }
  }, [currentStep, onTabChange]);

  // Check URL on mount: only auto-launch if ?tour=true is present
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const forceTour = params.get("tour") === "true";
    const stepParam = params.get("step");
    const parsedStep = stepParam ? parseInt(stepParam, 10) - 1 : 0;
    const initialIndex = Math.max(0, Math.min(parsedStep, STEPS.length - 1));

    if (forceTour) {
      const timer = setTimeout(() => {
        handleStartTour(initialIndex);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [handleStartTour]);

  // Measure and scroll target element into view
  useEffect(() => {
    if (!isOpen) {
      setTargetRect(null);
      return;
    }

    const step = STEPS[currentStep];

    const updateRect = () => {
      if (!step.elementId) {
        setTargetRect(null);
        return;
      }

      const el = document.getElementById(step.elementId) || document.querySelector(`#${step.elementId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      } else {
        setTargetRect(null);
      }
    };

    const timer = setTimeout(updateRect, 180);

    const onScrollOrResize = () => {
      if (!step.elementId) return;
      const el = document.getElementById(step.elementId) || document.querySelector(`#${step.elementId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isOpen, currentStep]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleClose]);

  const step = STEPS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  // Dynamic Anchored Popover Positioning next to target element
  const popoverPosition = useMemo(() => {
    if (typeof window === "undefined") {
      return { top: 100, left: 20, width: 360, placement: "bottom", arrowLeft: 50 };
    }

    const isMobile = window.innerWidth < 768;
    const popoverWidth = isMobile ? Math.min(window.innerWidth - 24, 380) : 400;
    const estimatedHeight = step?.isOtShowcase ? 440 : 250;

    if (!targetRect) {
      // Center on screen if no target rect
      return {
        top: Math.max(20, (window.innerHeight - estimatedHeight) / 2),
        left: Math.max(12, (window.innerWidth - popoverWidth) / 2),
        width: popoverWidth,
        placement: "center" as const,
        arrowLeft: popoverWidth / 2
      };
    }

    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    let placement: "bottom" | "top" = "bottom";
    let top = targetRect.bottom + 14;

    if (spaceBelow < estimatedHeight + 16 && spaceAbove > estimatedHeight + 16) {
      placement = "top";
      top = targetRect.top - estimatedHeight - 14;
    } else if (spaceBelow < estimatedHeight + 16 && spaceAbove < estimatedHeight + 16) {
      // In case element is tall or small screen, pin near bottom of screen
      top = Math.max(16, window.innerHeight - estimatedHeight - 16);
      placement = "bottom";
    }

    let left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
    // Constrain within viewport boundaries
    left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, left));

    // Arrow precisely points to the center of the target element
    const arrowLeft = Math.max(24, Math.min(popoverWidth - 24, targetRect.left + targetRect.width / 2 - left));

    return {
      top,
      left,
      width: popoverWidth,
      placement,
      arrowLeft
    };
  }, [targetRect, step?.isOtShowcase]);

  return (
    <>
      {/* Permanent floating trigger button */}
      {!isOpen && (
        <div id="tour-floating-btn" className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <Button
            onClick={() => handleStartTour(0)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black text-xs rounded-full px-5 py-6 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border-2 border-white/20"
            title="Iniciar Recorrido Guiado Paso a Paso (16 Etapas)"
          >
            <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            <span>✨ Tour Guiado (16 Pasos)</span>
          </Button>
        </div>
      )}

      {/* Tour Active Overlay & Anchored Tooltip */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Clickable Backdrop to close tour if clicking anywhere in the darkened region */}
          <div
            onClick={handleClose}
            className="fixed inset-0 z-30 pointer-events-auto cursor-pointer"
            title="Haz clic en cualquier zona oscura para salir del tour y usar la app libremente"
          />

          {/* Stable, Non-Flickering Spotlight Cutout: The target area is 100% clear and sharp, the background is solid and calm */}
          {targetRect ? (
            <>
              {/* The Spotlight Hole with Stable 9999px Box Shadow (No animate-pulse to prevent background flickering) */}
              <div
                style={{
                  top: Math.max(0, targetRect.top - 6),
                  left: Math.max(0, targetRect.left - 6),
                  width: targetRect.width + 12,
                  height: targetRect.height + 12,
                  boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.78)",
                  borderRadius: "16px"
                }}
                className="fixed z-40 pointer-events-none ring-2 ring-accent transition-all duration-300 ease-out"
              />

              {/* Clean, Non-Flickering Click Indicator Badge */}
              <div
                style={{
                  top: Math.max(8, targetRect.top - 24),
                  left: Math.min(window.innerWidth - 100, targetRect.left + targetRect.width / 2 - 50)
                }}
                className="fixed z-50 pointer-events-none flex flex-col items-center transition-all duration-300 ease-out"
              >
                <div className="bg-accent text-primary font-black text-[10px] tracking-tight px-3 py-1 rounded-full shadow-xl border border-primary/25 flex items-center gap-1.5 whitespace-nowrap">
                  <MousePointerClick size={12} className="text-primary" />
                  <span>Haz clic aquí</span>
                </div>
              </div>
            </>
          ) : (
            /* Stable dark overlay fallback */
            <div className="fixed inset-0 z-40 bg-slate-900/75 pointer-events-none transition-opacity duration-300" />
          )}

          {/* Compact Anchored Popover Card with Pointer Arrow */}
          <div
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              width: `${popoverPosition.width}px`
            }}
            className="fixed z-50 pointer-events-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-slide-up"
          >
            {/* Directional arrow pointing straight to the target element */}
            {popoverPosition.placement === "bottom" && (
              <div
                style={{ left: `${popoverPosition.arrowLeft}px` }}
                className="absolute -top-1.5 w-3 h-3 bg-slate-900 border-t border-l border-slate-800 rotate-45 transform -translate-x-1/2 z-20"
              />
            )}
            {popoverPosition.placement === "top" && (
              <div
                style={{ left: `${popoverPosition.arrowLeft}px` }}
                className="absolute -bottom-1.5 w-3 h-3 bg-slate-50 border-b border-r border-slate-200 rotate-45 transform -translate-x-1/2 z-20"
              />
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-black text-[11px] tracking-wider uppercase text-slate-200">
                  Paso {currentStep + 1} de {STEPS.length}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                title="Cerrar tour y usar la app libremente"
              >
                <span className="hidden sm:inline">Cerrar</span>
                <X size={14} />
              </button>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-100 h-1">
              <div
                className="bg-gradient-to-r from-primary to-accent h-1 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {/* Category Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${step.badgeColor}`}>
                  {step.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {progressPercent}% completado
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight leading-snug">
                {step.title}
              </h3>

              {/* Direct Click Action Instruction */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-bold flex items-start gap-2">
                <span className="shrink-0 text-sm">👉</span>
                <span className="leading-snug">{step.actionText}</span>
              </div>

              {/* Operational Detail */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {step.detail}
              </p>

              {/* SPECIAL SHOWCASE: EL PROCESO DE LA OT POR DENTRO */}
              {step.isOtShowcase && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <ClipboardList size={14} className="text-primary" />
                    <span>Así se compone la OT técnica por dentro:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-left text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-black text-primary">1. Mandante & Ubicación</span>
                      <p className="text-[10px] text-slate-500">Codelco / Centinela y folio.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-black text-primary">2. Cuadrilla</span>
                      <p className="text-[10px] text-slate-500">Jefe técnico y ayudantes.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-black text-primary">3. Fibra & Red</span>
                      <p className="text-[10px] text-slate-500">48 fusiones &lt; 0.02 dB.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="font-black text-primary">4. Fotos 3G</span>
                      <p className="text-[10px] text-slate-500">Compresión de empalmes.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 col-span-2">
                      <span className="font-black text-primary">5. Doble Firma Digital</span>
                      <p className="text-[10px] text-slate-500">Técnico en tablet + Cliente presencial/remota.</p>
                    </div>
                  </div>

                  <a
                    href="/work-orders/new?demo=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-[11px] py-2 px-3 rounded-lg shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <span>📝 Abrir Formulario Real Pre-llenado ↗</span>
                  </a>
                </div>
              )}
            </div>

            {/* Compact Footer Controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="font-bold text-[11px] rounded-lg h-8 px-2.5 border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={14} className="mr-0.5" /> Ant.
              </Button>

              {/* Step dots */}
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStartTour(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStep
                        ? "w-4 bg-primary"
                        : i < currentStep
                        ? "w-1.5 bg-primary/40 hover:bg-primary/60"
                        : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    title={`Paso ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                size="sm"
                onClick={handleNext}
                className="bg-primary hover:bg-primary/90 text-white font-black text-[11px] rounded-lg h-8 px-3 shadow-sm gap-1"
              >
                {currentStep === STEPS.length - 1 ? (
                  <span>🎉 Finalizar</span>
                ) : (
                  <>
                    <span>Sig.</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

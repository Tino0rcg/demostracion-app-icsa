"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, ChevronLeft, ChevronRight, X, ExternalLink, CheckCircle2, Shield, Wrench, Briefcase, ClipboardList, FileText, ArrowRight } from "lucide-react";
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
  description: string;
  bullets?: string[];
  note?: string;
  isOtShowcase?: boolean;
}

const STEPS: TourStep[] = [
  // PASO 1
  {
    id: "step-1",
    badge: "Acceso al Sistema",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "Paso 1 de 16: Autenticación & Perfiles de Faena",
    elementId: "tour-welcome",
    tab: "dashboard",
    description: "La plataforma cuenta con segregación estricta de funciones según el perfil de cada colaborador en faena y oficina:",
    bullets: [
      "Administrador General: Control total de contratos, clientes, cuadrillas, pañol y auditorías legales.",
      "Supervisor Técnico: Despacho de OTs, control de cuadrillas y firmas en terreno.",
      "Prevencionista de Riesgos: Checklists HPT y charlas diarias de 5 minutos obligatorias."
    ],
    note: "💡 Modo Activo: Estás navegando como Administrador General con permisos totales para conocer todas las funciones sin restricciones."
  },
  // PASO 2
  {
    id: "step-2",
    badge: "Estado Operativo en Tiempo Real",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    title: "Paso 2 de 16: Centro de Monitoreo & KPIs Operativos",
    elementId: "tour-stats-grid",
    tab: "dashboard",
    description: "Al iniciar la jornada, la jefatura y supervisores supervisan el balance operacional consolidado:",
    bullets: [
      "Proyectos en Ejecución: Contratos de telecomunicaciones y minería en curso.",
      "Órdenes Pendientes: Trabajos que las cuadrillas tienen asignados en terreno hoy.",
      "Stock en Pañol: Equipos disponibles en bodega vs. entregados bajo firma digital."
    ]
  },
  // PASO 3
  {
    id: "step-3",
    badge: "Resumen de Contratos",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Paso 3 de 16: Panel Rápido de Obras en Ejecución",
    elementId: "tour-card-projects",
    tab: "dashboard",
    description: "Muestra los 5 contratos prioritarios en faena con cliente mandante, plazos contractuales y acceso directo a cada obra."
  },
  // PASO 4
  {
    id: "step-4",
    badge: "Cola de Cuadrillas",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    title: "Paso 4 de 16: Cola de Órdenes Pendientes",
    elementId: "tour-card-orders",
    tab: "dashboard",
    description: "Supervisión en vivo de las OTs que los técnicos tienen asignadas hoy, con folio único correlativo inmutable, técnico a cargo y estado de ejecución."
  },
  // PASO 5
  {
    id: "step-5",
    badge: "Fase 1 • Planificación de Faena",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Paso 5 de 16: Fase 1 • Gestión de Proyectos de Infraestructura",
    elementId: "tour-projects-container",
    tab: "projects",
    description: "Toda labor técnica comienza con la apertura formal del proyecto de ingeniería:",
    bullets: [
      "Asignación de Personal: Supervisor a cargo y técnicos acreditados para ingresar a la faena minera.",
      "Control Contractual: Monitoreo de fecha de inicio, fecha contractual de término e hitos de pago.",
      "Historial por Mandante: Trazabilidad consolidada para Codelco, Entel, Movistar o ICSA Minería."
    ]
  },
  // PASO 6
  {
    id: "step-6",
    badge: "Filtros en Tiempo Real",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "Paso 6 de 16: Búsqueda Predictiva de Faenas",
    elementId: "tour-projects-search",
    tab: "projects",
    description: "En faenas con decenas de contratos simultáneos, el buscador filtra en milisegundos por nombre de obra, cliente mandante o RUT comercial."
  },
  // PASO 7
  {
    id: "step-7",
    badge: "Función Estrella • Cierre y Cobro",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    title: "Paso 7 de 16: Acta Consolidada de Liquidación de Proyecto",
    elementId: "tour-btn-new-project",
    tab: "projects",
    description: "Al finalizar una obra de semanas o meses, el sistema cuenta con el motor de Acta Final Consolidada:",
    bullets: [
      "Agrupación Automática: Reúne todas las OTs y visitas técnicas ejecutadas en ese proyecto.",
      "Resumen de Materiales: Totaliza metros de fibra, bocas de red y fusiones realizadas.",
      "Acta Única en PDF: Genera el documento de liquidación legal firmado para cobro inmediato sin disputas con el mandante."
    ]
  },
  // PASO 8
  {
    id: "step-8",
    badge: "Archivo Inmutable",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    title: "Paso 8 de 16: Historial & Auditoría de Proyectos",
    elementId: "tour-projects-history-container",
    tab: "project-history",
    description: "Repositorio de obras concluidas y archivadas con filtro por rango de fechas (Desde / Hasta) para balances anuales y auditorías mineras o tributarias."
  },
  // PASO 9
  {
    id: "step-9",
    badge: "Fase 2 • Pañol & Control de Stock",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    title: "Paso 9 de 16: Fase 2 • Pañol de Instrumental Crítico",
    elementId: "tour-tools-container",
    tab: "tools",
    description: "Las faenas de telecomunicaciones requieren instrumental de alto valor económico:",
    bullets: [
      "Equipos Críticos: Fusionadoras Fujikura 90S+, Reflectómetros OTDR Fluke Networks y herramientas certificadas.",
      "Estado en Vivo: Visualización en tiempo real de qué equipos están Disponibles en bodega y cuáles están En Terreno.",
      "Calibración y Mantención: Control de números de serie y vigencia de certificación técnica."
    ]
  },
  // PASO 10
  {
    id: "step-10",
    badge: "Fase 2 • Cero Pérdidas",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    title: "Paso 10 de 16: Despacho de Instrumental con Firma Digital",
    elementId: "tour-tools-container",
    tab: "tools",
    description: "Al retirar una herramienta cara para subir a faena:",
    bullets: [
      "Firma en Pantalla del Técnico: El colaborador estampa su firma biométrica en la tablet/celular acreditando la recepción conforme.",
      "Acta Inmutable: Queda registrado el número de serie exacto, fecha, hora y técnico responsable.",
      "Impacto Financiero: Elimina pérdidas o daños no atribuidos en herramientas de más de $5.000.000 CLP."
    ]
  },
  // PASO 11
  {
    id: "step-11",
    badge: "Fase 2 • Retorno Ágil",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    title: "Paso 11 de 16: 'Mis Herramientas' & Devolución por Lote",
    elementId: "tour-tools-container",
    tab: "tools",
    description: "Al terminar la jornada de trabajo:",
    bullets: [
      "Vista Personal: Cada técnico consulta en su teléfono la sección Mis Herramientas con los equipos bajo su custodia.",
      "Devolución Múltiple: Con el botón Seleccionar Todas puede entregar 5 o 10 equipos simultáneamente.",
      "Inspección Física: El pañolero valida que los equipos vuelvan limpios y operativos antes de reincorporarlos al stock general."
    ]
  },
  // PASO 12
  {
    id: "step-12",
    badge: "Auditoría de Bodega",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Paso 12 de 16: Trazabilidad Legal de Actas de Pañol",
    elementId: "tour-tool-history-container",
    tab: "tool-history",
    description: "Historial digitalizado de todas las entregas y devoluciones con firma del receptor, respaldando inventarios ante aseguradoras y auditorías internas."
  },
  // PASO 13
  {
    id: "step-13",
    badge: "Fase 3 • Prevención ACHS / Mutual",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    title: "Paso 13 de 16: Fase 3 • Seguridad Pre-Faena (HPT & Charlas)",
    elementId: "tour-welcome",
    tab: "dashboard",
    description: "Antes de intervenir mufas, postes o salas de racks, la cuadrilla debe cumplir con los protocolos legales obligatorios:",
    bullets: [
      "HPT (Hoja de Planificación de Tarea): Evaluación obligatoria de riesgos críticos (altura física, espacios confinados, inducción eléctrica) y checklist de EPP normado.",
      "Charlas Diarias de 5 Minutos: Temario diario obligatorio (LOTO, fibra óptica) y toma de firmas digitales de asistencia para mutualidades y Dirección del Trabajo.",
      "Bloqueo de Faena: Sin la HPT aprobada y firmada, no se autoriza el inicio del trabajo técnico."
    ]
  },
  // PASO 14: EL PROCESO DE LA OT POR DENTRO
  {
    id: "step-14",
    badge: "Fase 4 • Formulario Técnico por Dentro",
    badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    title: "Paso 14 de 16: Fase 4 • Desglose Técnico Completo de una OT Real",
    elementId: "tour-btn-new-ot",
    tab: "dashboard",
    description: "Así se compone una Orden de Trabajo técnica oficial emitida en terreno desde tablet o celular:",
    isOtShowcase: true
  },
  // PASO 15
  {
    id: "step-15",
    badge: "Fase 5 • Ejecución en Terreno",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "Paso 15 de 16: Fase 5 • Monitoreo de Órdenes & Doble Firma Híbrida",
    elementId: "tour-orders-container",
    tab: "orders",
    description: "Tablero de seguimiento general y certificación bajo Ley 19.799:",
    bullets: [
      "Estado de Ejecución: Supervisión de OTs en borrador, en desarrollo o esperando validación del mandante.",
      "Doble Firma Híbrida: Firma 1 (Técnico en terreno en pantalla táctil) + Firma 2 (Cliente presencial O remota vía enlace seguro por email/WhatsApp).",
      "Mediciones Guardadas: Registro inmutable de atenuación óptica por puerto para el informe final."
    ]
  },
  // PASO 16
  {
    id: "step-16",
    badge: "Fase 6 • Cierre Operativo y Cobro",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    title: "Paso 16 de 16: Fase 6 • Facturación Inmediata, Informe PDF & Modo Libre",
    elementId: "tour-history-container",
    tab: "order-history",
    description: "Las órdenes firmadas quedan consolidadas para facturación inmediata:",
    bullets: [
      "Informe Formal en PDF: Generación en 1 clic del acta técnica oficial con membrete de ICSA, fotografías de terreno y firmas estampadas.",
      "Validez Legal: Respaldada bajo firma electrónica avanzada para contabilidad y facturación.",
      "Operación Totalmente Desbloqueada: Has completado el recorrido. Ahora puedes usar toda la plataforma con total libertad."
    ]
  }
];

export function GuidedTour({ onTabChange }: GuidedTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
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
      description: "Tour finalizado. Ahora puedes explorar, crear proyectos, emitir órdenes de trabajo y operar la plataforma con total libertad."
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

  // Check URL on mount: only auto-launch if ?tour=true is in the query params
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

  // Update spotlight rect when step changes
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
          height: rect.height
        });
      } else {
        setTargetRect(null);
      }
    };

    // Give React 120ms to switch tabs and mount components
    const timer = setTimeout(updateRect, 150);

    const onScrollOrResize = () => {
      if (!step.elementId) return;
      const el = document.getElementById(step.elementId) || document.querySelector(`#${step.elementId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
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

      {/* Tour Active Modal / Dock */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end md:justify-center items-center p-3 md:p-6">
          {/* Subtle semi-transparent backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300"
            title="Haz clic para cerrar y usar la app libremente"
          />

          {/* Glowing spotlight over the target element */}
          {targetRect && (
            <div
              style={{
                top: Math.max(0, targetRect.top - 6),
                left: Math.max(0, targetRect.left - 6),
                width: targetRect.width + 12,
                height: targetRect.height + 12
              }}
              className="fixed z-40 pointer-events-none rounded-2xl ring-4 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_50px_rgba(var(--primary),0.5)] transition-all duration-300 animate-pulse"
            />
          )}

          {/* Interactive Tour Card */}
          <div
            className="relative z-50 pointer-events-auto w-full max-w-2xl bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
          >
            {/* Top Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-black text-xs tracking-wider uppercase text-slate-200">
                  Tour Guiado ICSA • Paso {currentStep + 1} de {STEPS.length}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors flex items-center gap-1 text-xs font-bold"
                title="Cerrar tour y usar la app"
              >
                <span className="hidden sm:inline">Cerrar</span>
                <X size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5">
              <div
                className="bg-gradient-to-r from-primary to-accent h-1.5 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Card Content Area */}
            <div className="p-5 overflow-y-auto space-y-3.5">
              {/* Category Pill */}
              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${step.badgeColor}`}>
                  {step.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {progressPercent}% completado
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>

              {/* Bullets (if provided) */}
              {step.bullets && step.bullets.length > 0 && (
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  {step.bullets.map((bullet, idx) => {
                    const [head, ...rest] = bullet.split(":");
                    return (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <span>
                          <strong>{head}{rest.length > 0 ? ":" : ""}</strong> {rest.join(":")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* SPECIAL SHOWCASE: EL PROCESO DE LA OT POR DENTRO */}
              {step.isOtShowcase && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList size={16} className="text-primary" />
                    <span>Desglose campo por campo de la OT técnica:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">1</span>
                        <span>Mandante & Faena</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Cliente (ej. <em>ICSA Minería - Codelco Centinela</em>), folio único y ubicación exacta (<em>Concentradora Racks Piso 2</em>).
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">2</span>
                        <span>Cuadrilla Acreditada</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Asignación del técnico responsable acreditado con RUT y ayudantes de terreno autorizados.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">3</span>
                        <span>Medición Fibra & Red</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Cuantificación de <strong>48 fusiones ODF monomodo</strong>, <strong>24 puntos Cat 6A</strong> y atenuación &lt; 0.02 dB.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">4</span>
                        <span>Evidencia Fotográfica</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Respaldo fotográfico del empalme con compresión automática para subida veloz bajo redes 3G.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">5</span>
                        <span>Doble Firma en Terreno</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Firma biométrica del técnico + firma presencial o remota del cliente (Ley 19.799).
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black">6</span>
                        <span>Acta Oficial en PDF</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Generación automática del acta membretada lista para cobro contable sin disputas.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/work-orders/new?demo=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.01]"
                  >
                    <span>📝 Abrir Formulario Real Prellenado con Datos Demo (Nueva Pestaña) ↗</span>
                  </a>
                </div>
              )}

              {/* Optional Note */}
              {step.note && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-teal-800 font-medium">
                  {step.note}
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="font-bold text-xs rounded-xl h-10 px-4 border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} className="mr-1" /> Anterior
              </Button>

              {/* Step indicator dots */}
              <div className="hidden sm:flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStartTour(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentStep
                        ? "w-6 bg-primary"
                        : i < currentStep
                        ? "w-2 bg-primary/40 hover:bg-primary/60"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    title={`Ir al Paso ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-white font-black text-xs rounded-xl h-10 px-5 shadow-md shadow-primary/25 gap-1.5"
                >
                  {currentStep === STEPS.length - 1 ? (
                    <>
                      <span>🎉 ¡Finalizar y Usar App!</span>
                    </>
                  ) : (
                    <>
                      <span>Siguiente</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

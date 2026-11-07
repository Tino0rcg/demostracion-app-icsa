"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowLeft, LogIn, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { loginAction, checkSysHealth, autoDemoLogin } from "@/actions/auth-actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    checkSysHealth().then(setHealth).catch(console.error);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tour") === "true") {
        setLoading(true);
        autoDemoLogin("admin").then(() => {
          window.location.href = "/dashboard?tour=true";
        });
      }
    }
  }, []);

  const logoImage = PlaceHolderImages.find(img => img.id === "icsa-logo");

  const handleQuickDemo = async (role: "admin" | "supervisor" | "prevencion") => {
    setLoading(true);
    try {
      const response = await autoDemoLogin(role);
      if ('user' in response && response.user) {
        toast({ title: "Acceso Demo Concedido", description: `Ingresando como ${response.user.name}...` });
        window.location.href = "/dashboard?tour=true";
      } else {
        window.location.href = "/dashboard?tour=true";
      }
    } catch {
      window.location.href = "/dashboard?tour=true";
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginAction(email, password);

      if ('user' in response && response.user) {
        toast({ title: "Bienvenido", description: `Acceso concedido as ${response.user.name}.` });
        window.location.href = "/dashboard";
      } else {
        const errorMsg = 'error' in response ? response.error : "Credenciales inválidas.";
        toast({ variant: "destructive", title: "Error de Acceso", description: errorMsg || "Credenciales inválidas." });
        setLoading(false);
      }
    } catch (error: any) {
      console.error("[AUTH_ACTION_ERROR] Login failure:", error);
      toast({ variant: "destructive", title: "Error de Acceso", description: "Error de conexión: " + (error.message || "Desconocido") });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-primary/30" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

      <Card className="w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none bg-white/95 backdrop-blur-xl relative z-10 p-4">
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={18} />
              <span className="font-bold text-xs">Volver</span>
            </Button>
          </Link>
        </div>

        <CardHeader className="text-center space-y-4 pt-16 pb-2">
          {logoImage && (
            <div className="mx-auto relative w-48 h-48 transition-transform hover:scale-105 duration-500 drop-shadow-2xl">
              <Image src={logoImage.imageUrl} alt="ICSA Logo" fill className="object-contain" priority />
            </div>
          )}
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-primary flex flex-col items-center leading-none tracking-tighter">
              ICSA
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] mt-2">ingeniería comunicaciones S.A.</span>
            </CardTitle>
            <CardDescription className="text-base pt-2 font-medium">Portal de Gestión Técnica</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8 pt-4">
          {/* Banner Salto de Login / Demo Tour */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/15 to-primary/5 border border-primary/20 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-primary tracking-wide">
              <Sparkles size={16} className="text-yellow-600 animate-pulse" />
              <span>Modo Demostración Activo</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Puedes omitir el inicio de sesión para entrar directo al tour guiado por todas las vistas de la app.
            </p>
            <Button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black text-sm h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] cursor-pointer gap-2"
            >
              <Sparkles size={16} />
              <span>🚀 Iniciar Tour Guiado (Omitir Login)</span>
            </Button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold ml-1 uppercase opacity-60">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@icsa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-background border-muted focus:ring-primary rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold ml-1 uppercase opacity-60">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-background border-muted focus:ring-primary rounded-xl pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>

            {/* Quick Demo Access Buttons */}
            <div className="pt-2 border-t border-muted/50 space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                Acceso Rápido con 1 Clic (Ingreso Inmediato):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("admin")}
                  disabled={loading}
                  className="text-[11px] font-bold border-primary/20 hover:bg-primary/10 h-9 px-1 truncate cursor-pointer"
                  title="Entrar directamente como Administrador"
                >
                  👑 Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("supervisor")}
                  disabled={loading}
                  className="text-[11px] font-bold border-primary/20 hover:bg-primary/10 h-9 px-1 truncate cursor-pointer"
                  title="Entrar directamente como Supervisor de Terreno"
                >
                  👷 Supervisor
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDemo("prevencion")}
                  disabled={loading}
                  className="text-[11px] font-bold border-primary/20 hover:bg-primary/10 h-9 px-1 truncate cursor-pointer"
                  title="Entrar directamente como Prevencionista de Riesgos"
                >
                  🦺 Seguridad
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary h-14 text-lg font-black shadow-lg transition-all active:scale-95 rounded-xl cursor-pointer" disabled={loading}>
              <LogIn className="mr-2" size={20} />
              <Label htmlFor="password">{loading ? "Verificando..." : "Entrar al Portal"}</Label>
            </Button>
          </form>
          <div className="mt-6 p-4 bg-muted/30 rounded-xl text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Aviso Operativo</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Si su cuenta fue desactivada por reingreso, contacte al administrador para habilitar su acceso.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

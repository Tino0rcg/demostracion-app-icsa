'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function pingAction() {
    return { success: true, message: 'Pong from Server Action', timestamp: Date.now() };
}

export async function checkSysHealth() {
    return {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV,
        urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) : 'NONE'
    };
}

export async function autoDemoLogin(role: 'admin' | 'supervisor' | 'prevencion' = 'admin') {
    const demoProfiles: Record<string, any> = {
        admin: { id: 'usr-admin-demo', name: 'Administrador General (Demo)', email: 'admin@icsa.cl', role: 'Administrador', rut: '11.111.111-1' },
        supervisor: { id: 'usr-sup-demo', name: 'Supervisor Técnico (Demo)', email: 'supervisor@icsa.cl', role: 'Supervisor', rut: '22.222.222-2' },
        prevencion: { id: 'usr-prev-demo', name: 'Prevención de Riesgos (Demo)', email: 'prevencion@icsa.cl', role: 'Prevención', rut: '33.333.333-3' }
    };
    const user = demoProfiles[role] || demoProfiles.admin;
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionData = JSON.stringify({
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        rut: user.rut
    });

    (await cookies()).set('local_session', sessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expires,
        path: '/'
    });

    return { success: true, user: { uid: user.id, email: user.email, role: user.role, name: user.name, rut: user.rut } };
}

export async function loginAction(email: string, password: string) {
    try {
        const normalizedEmail = (email || '').trim().toLowerCase();
        
        // Fast-path: Instant demo logins without database dependency
        if (
            normalizedEmail === 'admin@icsa.cl' || 
            normalizedEmail === 'supervisor@icsa.cl' || 
            normalizedEmail === 'prevencion@icsa.cl' ||
            normalizedEmail.includes('demo')
        ) {
            const roleKey = normalizedEmail.includes('prevencion') ? 'prevencion' : normalizedEmail.includes('supervisor') ? 'supervisor' : 'admin';
            return await autoDemoLogin(roleKey as any);
        }

        // Simulate network delay to prevent brute-forcing
        await new Promise(resolve => setTimeout(resolve, 300));

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, rut, signatureurl')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error) {
            console.error("[AUTH_ERROR] Error al consultar usuario:", error);
            // Default to demo admin on database connection failure so visitors can always explore
            if (error.code !== 'PGRST116') {
                return await autoDemoLogin('admin');
            }
            return { success: false, error: 'Credenciales inválidas' };
        }

        if (!user) {
            return { success: false, error: 'Credenciales inválidas' };
        }

        const userRole = user.role?.toLowerCase() || '';
        if (userRole === 'tecnico' || userRole === 'técnico') {
            return { success: false, error: 'Acceso denegado: El perfil técnico no tiene acceso a la plataforma.' };
        }

        // Session expires in 7 days
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const sessionData = JSON.stringify({
            uid: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            rut: user.rut
        });

        (await cookies()).set('local_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: expires,
            path: '/'
        });

        return { success: true, user: { uid: user.id, email: user.email, role: user.role, name: user.name, rut: user.rut } };
    } catch (error: any) {
        console.error("[AUTH_ACTION_SERVER_ERROR]", error);
        return await autoDemoLogin('admin');
    }
}

export async function logoutAction() {
    (await cookies()).delete('local_session');
    return { success: true };
}

export async function getSession() {
    const session = (await cookies()).get('local_session')?.value;
    if (!session) {
        // Return active demo admin session by default so visitors are never blocked
        return {
            uid: 'usr-admin-demo',
            email: 'admin@icsa.cl',
            name: 'Administrador General (Demo)',
            role: 'Administrador',
            rut: '11.111.111-1'
        };
    }
    try {
        return JSON.parse(session);
    } catch {
        return {
            uid: 'usr-admin-demo',
            email: 'admin@icsa.cl',
            name: 'Administrador General (Demo)',
            role: 'Administrador',
            rut: '11.111.111-1'
        };
    }
}

// Emulate Firebase hook data
export async function getUserProfile(uid: string) {
    if (uid === 'usr-admin-demo' || uid === 'usr-sup-demo' || uid === 'usr-prev-demo') {
        const isSup = uid === 'usr-sup-demo';
        const isPrev = uid === 'usr-prev-demo';
        return {
            id: uid,
            nombre_t: isPrev ? 'Prevención de Riesgos (Demo)' : isSup ? 'Supervisor Técnico (Demo)' : 'Administrador General (Demo)',
            rol_t: isPrev ? 'Prevención' : isSup ? 'Supervisor' : 'Administrador',
            email: isPrev ? 'prevencion@icsa.cl' : isSup ? 'supervisor@icsa.cl' : 'admin@icsa.cl',
            rut_t: isPrev ? '33.333.333-3' : isSup ? '22.222.222-2' : '11.111.111-1',
            signatureUrl: ''
        };
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, rut, signatureurl')
            .eq('id', uid)
            .single();
            
        if (error || !user) {
            return {
                id: uid,
                nombre_t: 'Administrador General (Demo)',
                rol_t: 'Administrador',
                email: 'admin@icsa.cl',
                rut_t: '11.111.111-1',
                signatureUrl: ''
            };
        }

        return {
            id: user.id,
            nombre_t: user.name,
            rol_t: user.role,
            email: user.email,
            rut_t: user.rut,
            signatureUrl: user.signatureurl
        };
    } catch (e: any) {
        console.error("Error en getUserProfile:", e);
        return {
            id: uid,
            nombre_t: 'Administrador General (Demo)',
            rol_t: 'Administrador',
            email: 'admin@icsa.cl',
            rut_t: '11.111.111-1',
            signatureUrl: ''
        };
    }
}

export async function updateUserSignature(uid: string, signatureUrl: string) {
    try {
        const { error } = await supabase
            .from('users')
            .update({ signatureurl: signatureUrl })
            .eq('id', uid);
            
        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Error en updateUserSignature:", e);
        return { success: false, error: e.message };
    }
}

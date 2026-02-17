"use server";

import { getAppConfig, updateAppConfig } from "@/lib/config-server";
import { AppConfig, AppConfigSchema } from "@/lib/config-schema";
import { revalidatePath } from "next/cache";

import { Octokit } from "@octokit/rest";
import { env } from "@/lib/env-adapter";
import { getSession } from "@/lib/auth";

async function ensureAdmin() {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized access. Admin session required.");
    }
}

export async function updateConfigAction(formData: AppConfig) {
    try {
        await ensureAdmin();
        // Validate again just in case
        const parsed = AppConfigSchema.parse(formData);

        await updateAppConfig(parsed);

        revalidatePath("/", "layout"); // Revalidate everything
        revalidatePath("/[lang]", "layout");
        return { success: true };
    } catch (e: any) {
        console.error("Failed to update config", e);
        if (e.name === "ZodError" || e.errors) {
            const issues = (e.errors || []).map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
            return { success: false, error: `Validation Error: ${issues || e.message}` };
        }
        return { success: false, error: `Error: ${e.message}` };
    }
}

export async function uploadImageAction(formData: FormData) {
    try {
        await ensureAdmin();
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const { token, owner, repo, branch } = env.github;

        if (!token || !owner || !repo) {
            console.error("Missing GitHub configuration", { owner, repo, hasToken: !!token });
            return {
                success: false,
                error: "GitHub integration is not fully configured. Please check your atmosphere/environment variables."
            };
        }

        const octokit = new Octokit({ auth: token });

        // 1. Get file content as buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");

        // 2. Generate unique filename
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
        const filename = `${Date.now()}-${safeName}`;
        const path = `public/images/${filename}`;

        // 3. Upload to GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `Upload image: ${filename} via Admin UI`,
            content: base64,
            branch,
        });

        // 4. Return the public path
        const publicPath = `/images/${filename}`;

        return {
            success: true,
            path: publicPath
        };
    } catch (e: any) {
        console.error("Upload error", e);
        return {
            success: false,
            error: `Error: ${e.message}`
        };
    }
}

// Leads Management Actions
import { Lead } from "@/lib/config-schema";
import { createClient } from "@/lib/supabase";

export async function saveLeadAction(leadData: Lead) {
    try {
        if (!env.supabase.url || !env.supabase.serviceKey) {
            console.warn("Supabase not configured — skipping lead save");
            return { success: false, error: "Lead storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." };
        }
        const supabase = await createClient();

        // Deduplication: if quote_id exists, check if this email already submitted for this quote
        if (leadData.quote_id) {
            const { data: existing } = await supabase
                .from("leads")
                .select("id")
                .eq("email", leadData.email)
                .eq("quote_id", leadData.quote_id)
                .maybeSingle();

            if (existing) {
                console.log("Lead already exists for this quote and email, skipping insert.");
                return { success: true, alreadyExists: true };
            }
        }

        const { error } = await supabase
            .from("leads")
            .insert({
                ...leadData,
                gdpr_accepted_at: leadData.gdpr_accepted_at || new Date().toISOString(),
            });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to save lead", e);
        return { success: false, error: typeof e.message === 'string' ? e.message.substring(0, 200) : 'Unknown database error' };
    }
}

export async function fetchLeadsAction(options: {
    page?: number,
    pageSize?: number,
    search?: string,
    orderBy?: string,
    orderDir?: 'asc' | 'desc'
}) {
    try {
        await ensureAdmin();

        if (!env.supabase.url || !env.supabase.serviceKey) {
            return { success: false, error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables in your Vercel/hosting dashboard." };
        }

        const { page = 1, pageSize = 20, search, orderBy = 'created_at', orderDir = 'desc' } = options;
        const supabase = await createClient();

        let query = supabase.from("leads").select("*", { count: "exact" });

        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await query
            .order(orderBy, { ascending: orderDir === 'asc' })
            .range(from, to);

        if (error) throw error;

        return {
            success: true,
            data: data as Lead[],
            total: count || 0,
            page,
            pageSize
        };
    } catch (e: any) {
        console.error("Failed to fetch leads", e);
        return { success: false, error: typeof e.message === 'string' ? e.message.substring(0, 200) : 'Unknown database error' };
    }
}

export async function deleteLeadAction(id: string) {
    try {
        await ensureAdmin();
        if (!env.supabase.url || !env.supabase.serviceKey) {
            return { success: false, error: "Supabase is not configured." };
        }
        const supabase = await createClient();
        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete lead", e);
        return { success: false, error: typeof e.message === 'string' ? e.message.substring(0, 200) : 'Unknown error' };
    }
}

export async function bulkDeleteLeadsAction(ids: string[]) {
    try {
        await ensureAdmin();
        if (!env.supabase.url || !env.supabase.serviceKey) {
            return { success: false, error: "Supabase is not configured." };
        }
        const supabase = await createClient();
        const { error } = await supabase
            .from("leads")
            .delete()
            .in("id", ids);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete leads", e);
        return { success: false, error: typeof e.message === 'string' ? e.message.substring(0, 200) : 'Unknown error' };
    }
}

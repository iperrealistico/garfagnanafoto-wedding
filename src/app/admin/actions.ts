"use server";

import { getAppConfig, updateAppConfig } from "@/lib/config-server";
import { AppConfig, AppConfigSchema } from "@/lib/config-schema";
import { revalidatePath } from "next/cache";

import { Octokit } from "@octokit/rest";
import { env } from "@/lib/env-adapter";

export async function updateConfigAction(formData: AppConfig) {
    try {
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
        return { success: false, error: `Database Error: ${e.message}` };
    }
}

export async function uploadImageAction(formData: FormData) {
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

    try {
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
        // In Next.js, files in /public/images/file.jpg are served at /images/file.jpg
        const publicPath = `/images/${filename}`;

        return {
            success: true,
            path: publicPath
        };
    } catch (e: any) {
        console.error("GitHub upload error", e);
        return {
            success: false,
            error: `GitHub error: ${e.message}. Status: ${e.status}`
        };
    }
}

// Leads Management Actions
import { Lead } from "@/lib/config-schema";
import { createClient } from "@/lib/supabase";

export async function saveLeadAction(leadData: Lead) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("leads")
            .insert(leadData);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to save lead", e);
        return { success: false, error: e.message };
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
        return { success: false, error: e.message };
    }
}

export async function deleteLeadAction(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete lead", e);
        return { success: false, error: e.message };
    }
}

export async function bulkDeleteLeadsAction(ids: string[]) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("leads")
            .delete()
            .in("id", ids);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete leads", e);
        return { success: false, error: e.message };
    }
}

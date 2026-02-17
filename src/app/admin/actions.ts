"use server";

import { getAppConfig, updateAppConfig } from "@/lib/config-server";
import { AppConfig, AppConfigSchema } from "@/lib/config-schema";
import { revalidatePath } from "next/cache";

import { Octokit } from "@octokit/rest";

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
        if (e.errors) {
            const issues = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
            return { success: false, error: `Validation Error: ${issues}` };
        }
        return { success: false, error: e.message };
    }
}

export async function uploadImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No file provided" };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    const branch = process.env.GITHUB_BRANCH || "main";

    if (!token || !owner || !repo) {
        console.error("Missing GitHub configuration", { owner, repo, hasToken: !!token });
        return {
            success: false,
            error: "GitHub integration is not fully configured (check GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_NAME)."
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

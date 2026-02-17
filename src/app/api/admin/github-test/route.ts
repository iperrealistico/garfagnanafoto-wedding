import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(req: NextRequest) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;

    if (!token) return NextResponse.json({ success: false, error: "GITHUB_TOKEN is missing" }, { status: 500 });
    if (!owner) return NextResponse.json({ success: false, error: "GITHUB_OWNER is missing" }, { status: 500 });
    if (!repo) return NextResponse.json({ success: false, error: "GITHUB_REPO_NAME is missing" }, { status: 500 });

    try {
        const octokit = new Octokit({ auth: token });

        // Test 1: Get user/org info
        const { data: user } = await octokit.users.getAuthenticated();

        // Test 2: Get repo info
        const { data: repository } = await octokit.repos.get({
            owner,
            repo,
        });

        // Test 3: Check permissions (if accessible)
        // We can check if we can list contents
        const { data: contents } = await octokit.repos.getContent({
            owner,
            repo,
            path: "public",
        });

        return NextResponse.json({
            success: true,
            info: {
                user: user.login,
                repo: repository.full_name,
                branch: repository.default_branch,
                permissions: repository.permissions,
                publicFound: Array.isArray(contents)
            }
        });
    } catch (e: any) {
        console.error("GitHub Diagnostic Error", e);
        return NextResponse.json({
            success: false,
            error: e.message,
            status: e.status,
            docs: e.documentation_url
        }, { status: 500 });
    }
}

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignJWT } from "jose"; // We cannot use bcrypt locally easily without native modules, but we can verify plain password for now as per plan
// Wait, we can't import `jose` in Server Component if not edge compatible? `jose` IS edge compatible.
// But I should use my `auth.ts` utility.
import { login } from "@/lib/auth";

export default function LoginPage() {
    async function handleLogin(formData: FormData) {
        "use server";

        // Call the auth library
        // But wait, `login` sets cookie. Server Action can set cookie.

        // We need to reimplement `login` logic here or import it?
        // Importing `login` from `@/lib/auth` which uses `cookies()` works in Server Actions.
        // However, I need to make sure `auth.ts` exports are usable here.

        const success = await login(formData);
        if (success) {
            redirect("/admin");
        } else {
            // Handle error (redirect back with error or just re-render)
            // For simplicity, redirect with query param
            redirect("/admin/login?error=Invalid password");
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Admin Login</h1>

                <form action={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter admin password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded bg-black py-2 font-bold text-white hover:bg-gray-800 focus:outline-none"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

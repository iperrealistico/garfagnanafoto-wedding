import { PrintPdfPage } from "../../../components/public/print-pdf-page";

export default async function PrintPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolved = await searchParams;
    const query = new URLSearchParams();

    Object.entries(resolved).forEach(([key, value]) => {
        if (typeof value === "string") {
            query.set(key, value);
            return;
        }

        if (Array.isArray(value) && value.length > 0) {
            query.set(key, value[0]);
        }
    });

    return <PrintPdfPage queryString={query.toString()} />;
}

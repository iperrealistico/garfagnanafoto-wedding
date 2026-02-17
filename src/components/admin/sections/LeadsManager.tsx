"use client";

import { useState, useEffect } from "react";
import { fetchLeadsAction, deleteLeadAction, bulkDeleteLeadsAction } from "@/app/admin/actions";
import { Lead } from "@/lib/config-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Download,
    CheckSquare,
    Square
} from "lucide-react";
import { cn, formatError } from "@/lib/utils";

export function LeadsManager() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetchLeadsAction({
                page,
                search,
                orderBy: 'created_at',
                orderDir: 'desc'
            });
            if (res.success) {
                setLeads(res.data || []);
                setTotal(res.total || 0);
            } else {
                toast.error(formatError(res.error));
            }
        } catch (e) {
            toast.error(formatError(e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLeads();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            const res = await deleteLeadAction(id);
            if (res.success) {
                toast.success("Lead deleted");
                fetchLeads();
            } else {
                toast.error(formatError(res.error));
            }
        } catch (e) {
            toast.error(formatError(e));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} leads?`)) return;
        try {
            const res = await bulkDeleteLeadsAction(selectedIds);
            if (res.success) {
                toast.success("Leads deleted");
                setSelectedIds([]);
                fetchLeads();
            } else {
                toast.error(formatError(res.error));
            }
        } catch (e) {
            toast.error(formatError(e));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === leads.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(leads.map(l => l.id as string).filter(Boolean));
        }
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;
        const headers = ["ID", "Date", "First Name", "Last Name", "Email", "Phone", "Location", "Package ID", "Custom", "Requests"];
        const rows = leads.map(l => [
            l.id,
            l.created_at,
            l.first_name,
            l.last_name,
            l.email,
            l.phone,
            l.wedding_location,
            l.package_id,
            l.is_custom,
            l.additional_requests?.replace(/\n/g, " ")
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchLeads} disabled={loading}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={leads.length === 0}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete ({selectedIds.length})
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <button onClick={toggleSelectAll}>
                                        {selectedIds.length === leads.length && leads.length > 0
                                            ? <CheckSquare className="w-4 h-4 text-[#719436]" />
                                            : <Square className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Contact</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Details</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && leads.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 bg-gray-50/50" />
                                    </tr>
                                ))
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className={cn("hover:bg-gray-50 transition-colors", selectedIds.includes(lead.id!) && "bg-[#719436]/5")}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelect(lead.id!)}>
                                                {selectedIds.includes(lead.id!)
                                                    ? <CheckSquare className="w-4 h-4 text-[#719436]" />
                                                    : <Square className="w-4 h-4 text-gray-400" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{lead.first_name} {lead.last_name}</div>
                                            <div className="flex flex-col gap-1 mt-2">
                                                <a href={`mailto:${lead.email}`} className="flex items-center text-xs text-gray-500 hover:text-[#719436]">
                                                    <Mail className="w-3 h-3 mr-1.5" />
                                                    {lead.email}
                                                </a>
                                                <a href={`tel:${lead.phone}`} className="flex items-center text-xs text-gray-500 hover:text-[#719436]">
                                                    <Phone className="w-3 h-3 mr-1.5" />
                                                    {lead.phone}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                {lead.wedding_location && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1.5 text-gray-400" />
                                                        {lead.wedding_location}
                                                    </div>
                                                )}
                                                <div className="flex items-center text-xs">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[10px]",
                                                        lead.is_custom ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {lead.is_custom ? "Custom Flow" : lead.package_id || "Standard"}
                                                    </span>
                                                </div>
                                                {lead.additional_requests && (
                                                    <div className="text-xs text-gray-500 italic mt-2 line-clamp-2 max-w-[200px]">
                                                        "{lead.additional_requests}"
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1.5 text-gray-400" />
                                                {new Date(lead.created_at!).toLocaleDateString()}
                                            </div>
                                            <div className="ml-4.5 text-[10px] text-gray-400">
                                                {new Date(lead.created_at!).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(lead.id!)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-medium">
                        Showing {leads.length} of {total} leads
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-bold min-w-[2rem] text-center">{page}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={leads.length < 20 || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

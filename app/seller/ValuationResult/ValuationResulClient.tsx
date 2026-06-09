"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Leaflet must be loaded client-side only (no SSR)
const PropertyMap = dynamic(() => import("./propertyMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-xs text-gray-400">Loading map…</span>
            </div>
        </div>
    ),
});

type Factor = {
    key: string;
    label: string;
    icon: string;
    value: number;
    explanation: string;
};

type OverviewField = {
    label: string;
    icon: string;
    value: string | number;
    isCondition?: boolean;
    conditionKey?: string;
};

type Props = {
    valuation: Record<string, unknown>;
    factors: Factor[];
    overviewFields: OverviewField[];
    conditionColors: Record<string, string>;
    rawValuation: Record<string, unknown>;
};

export default function ValuationResultClient({
    valuation,
    factors,
    overviewFields,
    conditionColors,
    rawValuation,
}: Props) {
    const router = useRouter();
    const rangeTotal = (valuation.estimatedMax as number) - (valuation.estimatedMin as number);
    const initialPercent = Math.round(
        (((valuation.estimatedValue as number) - (valuation.estimatedMin as number)) / rangeTotal) * 100
    );

    const [pinPercent, setPinPercent] = useState(initialPercent);
    const [openFactor, setOpenFactor] = useState<string | null>(null);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const currentPrice = Math.round(
        (valuation.estimatedMin as number) + (rangeTotal * pinPercent) / 100
    );
    const isEstimated = pinPercent === initialPercent;
    const maxValue = Math.max(...factors.map((f) => f.value));

    const updateFromEvent = useCallback((clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const raw = (clientX - rect.left) / rect.width;
        const clamped = Math.min(1, Math.max(0, raw));
        setPinPercent(Math.round(clamped * 100));
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        updateFromEvent(e.clientX);
        const onMove = (ev: MouseEvent) => { if (isDragging.current) updateFromEvent(ev.clientX); };
        const onUp = () => {
            isDragging.current = false;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        updateFromEvent(e.touches[0].clientX);
        const onMove = (ev: TouchEvent) => { if (isDragging.current) updateFromEvent(ev.touches[0].clientX); };
        const onEnd = () => {
            isDragging.current = false;
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onEnd);
        };
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", onEnd);
    };

    function handleEdit() {
        try {
            sessionStorage.setItem("valuation_prefill", JSON.stringify(rawValuation));
            router.push("/seller/Valuation?edit=true");
        } catch {
            router.push("/seller/Valuation");
        }
    }

    async function handleDownloadPDF() {
        setGeneratingPDF(true);
        try {
            const { default: jsPDF } = await import("jspdf");
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

            const W = 210;
            const H = 297;
            const margin = 18;
            const contentW = W - margin * 2;
            let y = 0;

            const navy = [11, 30, 74] as [number, number, number];
            const emerald = [5, 150, 105] as [number, number, number];
            const lightGray = [248, 249, 250] as [number, number, number];
            const midGray = [107, 114, 128] as [number, number, number];
            const darkGray = [31, 41, 55] as [number, number, number];
            const white = [255, 255, 255] as [number, number, number];
            const borderGray = [229, 231, 235] as [number, number, number];

            const setFont = (style: "normal" | "bold" | "italic" = "normal", size = 10, color: [number, number, number] = darkGray) => {
                doc.setFont("helvetica", style);
                doc.setFontSize(size);
                doc.setTextColor(...color);
            };
            const fillRect = (x: number, ry: number, w: number, h: number, color: [number, number, number]) => {
                doc.setFillColor(...color);
                doc.rect(x, ry, w, h, "F");
            };
            const line = (x1: number, ry1: number, x2: number, ry2: number, color: [number, number, number] = borderGray, lw = 0.3) => {
                doc.setDrawColor(...color);
                doc.setLineWidth(lw);
                doc.line(x1, ry1, x2, ry2);
            };

            // Header
            fillRect(0, 0, W, 52, navy);
            setFont("bold", 22, white);
            doc.addImage("/valtrust-isologo-white.png", "PNG", margin, 2.5, 50, 50, "", "NONE", 0);
            setFont("normal", 7, [180, 200, 230]);
            doc.text("PROPERTY VALUATION", W - margin, 18, { align: "right" });
            setFont("normal", 7, [180, 200, 230]);
            doc.text("CERTIFICATION REPORT", W - margin, 24, { align: "right" });
            const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            doc.text(`Issued: ${dateStr}`, W - margin, 30, { align: "right" });
            doc.text(`Ref: VLT-${Date.now().toString().slice(-8)}`, W - margin, 36, { align: "right" });
            fillRect(0, 48, W, 4, emerald);
            y = 64;

            // Value hero
            doc.setFillColor(...lightGray);
            doc.setDrawColor(...borderGray);
            doc.setLineWidth(0.3);
            (doc as any).roundedRect(margin, y, contentW, 38, 3, 3, "FD");
            setFont("normal", 8, midGray);
            doc.text("ESTIMATED MARKET VALUE", margin + 8, y + 9);
            setFont("bold", 26, navy);
            doc.text(`$${(valuation.estimatedValue as number).toLocaleString()} USD`, margin + 8, y + 22);
            const pillY = y + 28;
            fillRect(margin + 8, pillY, 40, 6, [209, 250, 229]);
            setFont("bold", 6.5, emerald);
            doc.text(`MIN  $${(valuation.estimatedMin as number).toLocaleString()}`, margin + 10, pillY + 4.2);
            fillRect(margin + 52, pillY, 40, 6, [209, 250, 229]);
            doc.text(`MAX  $${(valuation.estimatedMax as number).toLocaleString()}`, margin + 54, pillY + 4.2);
            setFont("normal", 7, midGray);
            doc.text("CONFIDENCE", W - margin - 30, y + 9);
            setFont("bold", 18, navy);
            doc.text("87%", W - margin - 30, y + 22);
            setFont("normal", 6.5, midGray);
            doc.text("High confidence", W - margin - 30, y + 28);
            y += 46;

            // Two columns
            const colW = (contentW - 6) / 2;
            const col1X = margin;
            const col2X = margin + colW + 6;
            const sectionStartY = y;

            // Col 1: Details
            setFont("bold", 9, navy);
            doc.text("PROPERTY DETAILS", col1X, y);
            line(col1X, y + 2, col1X + colW, y + 2, navy, 0.5);
            y += 7;

            const detailRows: [string, string][] = [
                ["Property Type", String(valuation.type ?? "—")],
                ["Location", `${valuation.municipality}, ${valuation.department}`],
                ["Zone", String(valuation.zone ?? "—")],
                ["Address", String(valuation.exactAddress ?? "—")],
                ["Building Area", `${valuation.areaM2} m²`],
                ["Land Area", `${valuation.landAreaM2} m²`],
                ["Bedrooms", String(valuation.bedrooms ?? "—")],
                ["Bathrooms", String(valuation.bathrooms ?? "—")],
                ["Parking", String(valuation.parkingSpaces ?? "—")],
                ["Year Built", valuation.yearBuilt && (valuation.yearBuilt as number) > 0 ? String(valuation.yearBuilt) : "—"],
                ["Levels", String(valuation.levels ?? "—")],
                ["Condition", String(valuation.condition ?? "—").replace("_", " ").toUpperCase()],
            ];

            detailRows.forEach(([label, value], i) => {
                const rowY = y + i * 7;
                if (i % 2 === 0) fillRect(col1X, rowY - 1, colW, 7, [252, 252, 253]);
                setFont("normal", 7, midGray);
                doc.text(label, col1X + 2, rowY + 4);
                setFont("bold", 7, darkGray);
                doc.text(value, col1X + colW - 2, rowY + 4, { align: "right" });
            });
            y += detailRows.length * 7 + 4;

            // Col 2: Factors
            let col2Y = sectionStartY;
            setFont("bold", 9, navy);
            doc.text("VALUE FACTORS", col2X, col2Y);
            line(col2X, col2Y + 2, col2X + colW, col2Y + 2, navy, 0.5);
            col2Y += 7;

            factors.forEach(({ label, value, explanation }) => {
                const barFill = maxValue > 0 ? (value / maxValue) * (colW - 4) : 0;
                setFont("normal", 7, darkGray);
                doc.text(label, col2X + 2, col2Y + 3);
                setFont("bold", 7, emerald);
                doc.text(`+$${value.toLocaleString()}`, col2X + colW - 2, col2Y + 3, { align: "right" });
                fillRect(col2X + 2, col2Y + 5, colW - 4, 2.5, borderGray);
                fillRect(col2X + 2, col2Y + 5, barFill, 2.5, emerald);
                col2Y += 12;
                setFont("normal", 6, midGray);
                const lines = doc.splitTextToSize(explanation, colW - 4);
                lines.slice(0, 2).forEach((ln: string, li: number) => { doc.text(ln, col2X + 2, col2Y + li * 4); });
                col2Y += lines.slice(0, 2).length * 4 + 4;
                line(col2X, col2Y, col2X + colW, col2Y, borderGray);
                col2Y += 3;
            });

            // Amenities
            const amenitiesY = Math.max(y, col2Y) + 6;
            setFont("bold", 9, navy);
            doc.text("PROPERTY AMENITIES & FEATURES", margin, amenitiesY);
            line(margin, amenitiesY + 2, W - margin, amenitiesY + 2, navy, 0.5);

            const amenityList: [string, boolean][] = [
                ["Air Conditioning", valuation.hasAC as boolean],
                ["Smart Home", valuation.hasSmartHome as boolean],
                ["Private Pool", valuation.hasPool as boolean],
                ["Security Gate", valuation.hasSecurityGate as boolean],
                ["CCTV / Cameras", valuation.hasCCTV as boolean],
                ["Gym", valuation.hasGym as boolean],
                ["Elevator", valuation.hasElevator as boolean],
                ["Green Areas", valuation.hasGreenAreas as boolean],
                ["Living / Dining Room", valuation.hasLivingDiningRoom as boolean],
                ["Laundry Room", valuation.hasLaundryRoom as boolean],
                ["Storage / Cellar", valuation.hasStorageCellar as boolean],
                ["Studio / Home Office", valuation.hasStudioHomeOffice as boolean],
            ];

            let aRow = 0, aCol = 0;
            const amenityColW = contentW / 3;
            amenityList.forEach(([label, present]) => {
                const ax = margin + aCol * amenityColW;
                const ay = amenitiesY + 8 + aRow * 7;
                fillRect(ax + 2, ay + 0.5, 3, 3, present ? emerald : [209, 213, 219]);
                setFont("normal", 7, present ? darkGray : midGray);
                doc.text(label, ax + 7, ay + 3.5);
                aCol++;
                if (aCol >= 3) { aCol = 0; aRow++; }
            });

            const amenityEndY = amenitiesY + 8 + Math.ceil(amenityList.length / 3) * 7 + 4;

            // Description
            let descEndY = amenityEndY;
            if (valuation.publicDescription) {
                descEndY += 4;
                setFont("bold", 9, navy);
                doc.text("PROPERTY DESCRIPTION", margin, descEndY);
                line(margin, descEndY + 2, W - margin, descEndY + 2, navy, 0.5);
                descEndY += 7;
                setFont("normal", 7.5, darkGray);
                const descLines = doc.splitTextToSize(String(valuation.publicDescription), contentW);
                descLines.slice(0, 6).forEach((ln: string, i: number) => { doc.text(ln, margin, descEndY + i * 5); });
                descEndY += Math.min(6, descLines.length) * 5 + 4;
            }

            // Methodology
            const methodY = descEndY + 4;
            doc.setFillColor(239, 246, 255);
            doc.setDrawColor(191, 219, 254);
            doc.setLineWidth(0.3);
            (doc as any).roundedRect(margin, methodY, contentW, 22, 2, 2, "FD");
            setFont("bold", 7.5, navy);
            doc.text("VALUATION METHODOLOGY", margin + 4, methodY + 6);
            setFont("normal", 6.5, [30, 64, 175]);
            const methodText = "This estimate was generated using a comparative market analysis model that evaluates location premiums, infrastructure quality, physical property attributes (size, bedrooms, bathrooms), condition-adjusted depreciation, and current market trends in El Salvador. The estimate represents a probable market range and should not be used as a substitute for a licensed appraisal.";
            doc.splitTextToSize(methodText, contentW - 8).slice(0, 3).forEach((ln: string, i: number) => {
                doc.text(ln, margin + 4, methodY + 12 + i * 4);
            });

            // Footer
            const footerY = H - 18;
            fillRect(0, footerY, W, 18, navy);
            fillRect(0, footerY, W, 1.5, emerald);
            setFont("normal", 6.5, [180, 200, 230]);
            doc.text("© Valtrust Real Estate  ·  This document is for informational purposes only and does not constitute a formal appraisal.", margin, footerY + 7);
            doc.text("Values are estimates based on market data and user-provided information. A physical inspection is recommended.", margin, footerY + 12);
            setFont("bold", 6.5, white);
            doc.text("valtrust.com", W - margin, footerY + 9, { align: "right" });

            doc.save(`Valtrust-Valuation-${Date.now()}.pdf`);
        } catch (err) {
            console.error("PDF generation error:", err);
            alert("There was an error generating the PDF. Please try again.");
        } finally {
            setGeneratingPDF(false);
        }
    }

    return (
        <section className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4 mt-15">
            <div className="max-w-5xl mx-auto flex flex-col gap-y-4 sm:gap-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-4 gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-900">Valuation Result</h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            As of {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={generatingPDF}
                            className="flex items-center gap-x-2 text-sm font-medium text-white bg-[#0B1E4A] hover:bg-[#0D2860] rounded-xl px-4 py-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {generatingPDF ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => router.push("/seller")}
                            className="flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 transition-colors"
                        >
                            <img src="/valuationResult/arrow-icon.png" alt="" className="h-4 w-4" />
                            <span className="hidden sm:inline">Back to Dashboard</span>
                            <span className="sm:hidden">Dashboard</span>
                        </button>
                    </div>
                </div>

                {/* ── Estimated Value Card ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="bg-gray-100 rounded-xl w-full lg:w-[340px] h-48 sm:h-[200px] lg:h-[220px] flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="/ValuationResult/houseExample-icon.png" alt="Property" className="object-cover w-full h-full" />
                    </div>

                    <div className="flex flex-col justify-center w-full gap-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-800">Estimated Property Value</p>
                                <p className="text-[11px] text-gray-400">Drag the slider to explore the value range</p>
                            </div>
                            {!isEstimated && (
                                <button
                                    onClick={() => setPinPercent(initialPercent)}
                                    className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                    </svg>
                                    Reset estimate
                                </button>
                            )}
                        </div>

                        <div className="mt-2 mb-1">
                            <div
                                className="relative mb-1 select-none"
                                style={{ marginLeft: `${pinPercent}%`, transform: "translateX(-50%)", width: "fit-content" }}
                            >
                                <p className="text-[10px] text-gray-400 text-center mb-1">
                                    {isEstimated ? "Estimated" : "Exploring"}
                                </p>
                                <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap block text-center shadow-sm transition-colors ${isEstimated ? "bg-emerald-600" : "bg-blue-500"}`}>
                                    ${currentPrice.toLocaleString()} USD
                                </span>
                                <div className="flex justify-center mt-1">
                                    <div className={`w-px h-3 ${isEstimated ? "bg-emerald-300" : "bg-blue-300"}`} />
                                </div>
                            </div>

                            <div
                                ref={trackRef}
                                className="relative h-2 rounded-full bg-gray-100 cursor-pointer"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                            >
                                <div
                                    className={`absolute left-0 top-0 h-full rounded-full transition-colors ${isEstimated ? "bg-emerald-100" : "bg-blue-100"}`}
                                    style={{ width: `${pinPercent}%` }}
                                />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 pointer-events-none" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-300 pointer-events-none" />
                                <div
                                    className={`absolute top-1/2 w-4 h-4 rounded-full shadow border-2 border-white cursor-grab active:cursor-grabbing transition-colors pointer-events-none ${isEstimated ? "bg-emerald-600" : "bg-blue-500"}`}
                                    style={{ left: `${pinPercent}%`, transform: "translate(-50%, -50%)" }}
                                />
                            </div>

                            <div className="flex justify-between mt-3">
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-0.5 rounded-full border border-emerald-100">
                                        ${(valuation.estimatedMin as number).toLocaleString()} USD
                                    </span>
                                    <span className="text-[10px] text-gray-400 ml-1">Minimum</span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-0.5 rounded-full border border-emerald-100">
                                        ${(valuation.estimatedMax as number).toLocaleString()} USD
                                    </span>
                                    <span className="text-[10px] text-gray-400 mr-1">Maximum</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Estimated market value based on the information you provided and current market conditions.
                        </p>
                    </div>
                </div>

                {/* ── Location Map Card (Editada para evitar que cubra el Navbar) ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 isolate z-0">
                    <div className="flex items-center gap-x-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-[#0B1E4A]/8 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-[#0B1E4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Property Location</p>
                            <p className="text-[11px] text-gray-400">
                                {valuation.exactAddress
                                    ? `${valuation.exactAddress as string}, `
                                    : ""}
                                {valuation.municipality as string}, {valuation.department as string}
                            </p>
                        </div>
                    </div>

                    {/* Contenedor del mapa con z-0 para asegurar que no se "escape" de su capa */}
                    <div className="h-[220px] sm:h-[260px] w-full rounded-xl overflow-hidden border border-gray-100 relative z-0">
                        <PropertyMap
                            address={String(valuation.exactAddress ?? "")}
                            municipality={String(valuation.municipality ?? "")}
                            department={String(valuation.department ?? "")}
                        />
                    </div>
                </div>

                {/* ── Bottom Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                    {/* Property Overview */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-semibold text-gray-800">Property Overview</p>
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-x-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                        </div>
                        <div className="flex flex-col gap-y-3">
                            {overviewFields.map(({ label, icon, value, isCondition, conditionKey }) => (
                                <div key={label} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-x-2 text-gray-500">
                                        <img src={icon} alt="" className="h-4 w-4 opacity-60" />
                                        <span>{label}</span>
                                    </div>
                                    {isCondition && conditionKey ? (
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${conditionColors[conditionKey] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                                            {value}
                                        </span>
                                    ) : (
                                        <span className="text-gray-800 font-medium">{value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Value Breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <p className="text-sm font-semibold text-gray-800 mb-1">Value Breakdown</p>
                        <p className="text-[11px] text-gray-400 mb-4">Click any factor to see why</p>
                        <div className="flex flex-col gap-y-3">
                            {factors.map(({ key, label, icon, value, explanation }) => {
                                const barWidth = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
                                const isOpen = openFactor === key;
                                return (
                                    <div key={key} className="flex flex-col">
                                        <button
                                            onClick={() => setOpenFactor(isOpen ? null : key)}
                                            className="flex flex-col gap-y-1.5 text-left w-full group"
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-x-2 text-gray-500 group-hover:text-gray-800 transition-colors">
                                                    <img src={icon} alt="" className="h-4 w-4 opacity-60" />
                                                    <span>{label}</span>
                                                    <svg
                                                        className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                                <span className="text-emerald-600 font-semibold text-xs">
                                                    +${value.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${barWidth}%` }} />
                                            </div>
                                        </button>
                                        {isOpen && (
                                            <div className="mt-2 mb-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 leading-relaxed">
                                                {explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
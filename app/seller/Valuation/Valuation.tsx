"use client";

import { useState, useEffect, useRef } from "react";
import { ZONES } from "./zones";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateValuation } from "./actions";

export type ValuationFormInput = {
    department: string;
    municipality: string;
    zone: string;
    exactAddress: string;
    postalCode: number;
    type: string;
    condition: string;
    areaM2: number;
    landAreaM2: number;
    levels: number;
    yearBuilt: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    kitchenType: string;
    hasLivingDiningRoom: boolean;
    hasLaundryRoom: boolean;
    hasStorageCellar: boolean;
    hasStudioHomeOffice: boolean;
    hasServiceQuarter: boolean;
    hasAC: boolean;
    hasSmartHome: boolean;
    hasPool: boolean;
    hasSecurityGate: boolean;
    hasCCTV: boolean;
    hasGym: boolean;
    hasElevator: boolean;
    hasGreenAreas: boolean;
    hasOtherAmenity: boolean;
    otherAmenityDescription: string;
    publicDescription: string;
    maintenanceFee: number;
    petsAllowed: string;
    includedServices: string;
};

const EMPTY_FORM: ValuationFormInput = {
    department: "", municipality: "", zone: "", exactAddress: "", postalCode: 0,
    type: "", condition: "good", areaM2: 0, landAreaM2: 0, levels: 0, yearBuilt: 0,
    bedrooms: 0, bathrooms: 0, parkingSpaces: 0, kitchenType: "",
    hasLivingDiningRoom: false, hasLaundryRoom: false, hasStorageCellar: false,
    hasStudioHomeOffice: false, hasServiceQuarter: false, hasAC: false,
    hasSmartHome: false, hasPool: false, hasSecurityGate: false, hasCCTV: false,
    hasGym: false, hasElevator: false, hasGreenAreas: false, hasOtherAmenity: false,
    otherAmenityDescription: "", publicDescription: "", maintenanceFee: 0,
    petsAllowed: "allowed", includedServices: "",
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;
const SUBMIT_LIMIT = 3;
const SUBMIT_WINDOW_MS = 60_000;

function sanitizeString(value: string): string {
    return value.replace(/<[^>]*>/g, "").slice(0, 500);
}

function calcProgress(form: ValuationFormInput): number {
    const required = [
        form.department, form.municipality, form.zone, form.exactAddress,
        form.type, form.condition,
        form.areaM2 > 0, form.levels > 0, form.bedrooms > 0, form.bathrooms > 0,
        form.yearBuilt >= MIN_YEAR && form.yearBuilt <= CURRENT_YEAR,
    ];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
}

function SectionCard({ icon, title, children, step }: {
    icon: string; title: string; children: React.ReactNode; step: number;
}) {
    return (
        <div className="flex flex-col bg-[#0B1E4A] w-full rounded-2xl overflow-hidden">
            <div className="flex items-center gap-x-3 px-4 sm:px-6 pt-5 pb-4 border-b border-white/10">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white text-xs font-semibold shrink-0">
                    {step}
                </span>
                <img src={icon} alt="" className="h-5 opacity-80" />
                <p className="text-white text-base font-semibold tracking-wide">{title}</p>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-white/60 text-[11px] font-medium tracking-[0.08em] uppercase mb-1">{children}</p>
    );
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-red-400 text-[10px] mt-1">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {msg}
        </p>
    );
}

function ToggleChip({ name, label, checked, onChange }: {
    name: string; label: string; checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-emerald-500" : "bg-white/20"}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
                <input name={name} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
            </div>
            <span className={`text-sm transition-colors ${checked ? "text-white" : "text-white/60"}`}>{label}</span>
        </label>
    );
}

// ── CAMBIO 1: recibe sellerClerkId como prop ──
export default function Valuation({ sellerClerkId }: { sellerClerkId?: string }) {
    const [form, setForm] = useState<ValuationFormInput>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof ValuationFormInput, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const submitTimestamps = useRef<number[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const progress = calcProgress(form);

    useEffect(() => {
        if (searchParams.get("edit") === "true") {
            try {
                const saved = sessionStorage.getItem("valuation_prefill");
                if (saved) {
                    setForm(JSON.parse(saved) as ValuationFormInput);
                    setIsEditMode(true);
                    sessionStorage.removeItem("valuation_prefill");
                }
            } catch { /* ignore */ }
        }
    }, [searchParams]);

    const municipalities = form.department ? Object.keys(ZONES[form.department] || {}) : [];
    const zones = form.department && form.municipality ? ZONES[form.department]?.[form.municipality] || [] : [];

    function Change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked
                : type === "number" ? (value === "" ? 0 : Number(value.replace(/[^0-9.]/g, "")))
                    : sanitizeString(value),
        }));
    }

    function validate(): boolean {
        const e: Partial<Record<keyof ValuationFormInput, string>> = {};
        if (!form.department) e.department = "Required";
        if (!form.municipality) e.municipality = "Required";
        if (!form.zone) e.zone = "Required";
        if (!form.exactAddress.trim()) e.exactAddress = "Required";
        if (!form.type) e.type = "Required";
        if (!form.condition) e.condition = "Required";
        if (form.areaM2 <= 0) e.areaM2 = "Must be greater than 0";
        if (form.levels <= 0) e.levels = "Must be greater than 0";
        if (form.bedrooms <= 0) e.bedrooms = "Must be greater than 0";
        if (form.bathrooms <= 0) e.bathrooms = "Must be greater than 0";
        if (form.yearBuilt <= 0) e.yearBuilt = "Required";
        else if (form.yearBuilt < MIN_YEAR) e.yearBuilt = `Must be ${MIN_YEAR} or later`;
        else if (form.yearBuilt > CURRENT_YEAR) e.yearBuilt = `Cannot be in the future (max ${CURRENT_YEAR})`;
        setErrors(e);
        if (Object.keys(e).length > 0) {
            const first = Object.keys(e)[0];
            document.querySelector(`[name="${first}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return Object.keys(e).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;
        const now = Date.now();
        submitTimestamps.current = submitTimestamps.current.filter((t) => now - t < SUBMIT_WINDOW_MS);
        if (submitTimestamps.current.length >= SUBMIT_LIMIT) {
            alert("Too many requests. Please wait a moment before trying again.");
            return;
        }
        submitTimestamps.current.push(now);
        setIsSubmitting(true);
        try {
            // ── CAMBIO 2: pasa sellerClerkId al action ──
            const result = await calculateValuation({ ...form, sellerClerkId });
            if (result?.publicId) router.push(`/seller/ValuationResult?id=${result.publicId}`);
        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving your house estimate.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputCls = (field: keyof ValuationFormInput) =>
        `bg-white/10 border ${errors[field] ? "border-red-400" : "border-white/20"} focus:border-white/50 focus:bg-white/15 outline-none w-full h-9 px-3 text-white text-sm rounded-lg placeholder:text-white/30 transition-colors`;

    const selectCls = (field: keyof ValuationFormInput) =>
        `bg-[#0B1E4A] border ${errors[field] ? "border-red-400" : "border-white/20"} focus:border-white/50 outline-none w-full h-9 px-3 text-white text-sm rounded-lg transition-colors appearance-none cursor-pointer`;

    return (
        <section className="flex flex-col items-center bg-gray-50 py-8 sm:py-12 px-4 min-h-screen mt-17">
            <div className="flex flex-col items-center w-full max-w-lg gap-y-6 sm:gap-y-8">

                {/* Hero header */}
                <div className="flex flex-col items-center text-center gap-y-3 sm:gap-y-4 w-full">
                    {isEditMode && (
                        <div className="flex items-center gap-x-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2 rounded-xl w-full justify-center">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editing your previous valuation — update any fields and recalculate.
                        </div>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-semibold text-[#0D4687] tracking-tight leading-tight">
                        Ready to discover your<br />property value?
                    </h1>
                    <p className="text-sm sm:text-base text-[#0B1E4A]/70 max-w-sm">
                        Complete a few details below to get your instant property estimate.
                    </p>

                    {/* Progress bar */}
                    <div className="w-full mt-1 sm:mt-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-gray-500 font-medium">Form completion</span>
                            <span className="text-xs font-semibold text-[#0D4687]">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#0D4687] rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── SECTION 1: Location ── */}
                <SectionCard icon="/Valuation/location-icon.png" title="Location" step={1}>
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <Label>Department / State</Label>
                            <div className="relative">
                                <select name="department" className={selectCls("department")} value={form.department}
                                    onChange={(e) => { Change(e); setForm((p) => ({ ...p, municipality: "", zone: "" })); }}>
                                    <option value="">Select department…</option>
                                    {Object.keys(ZONES).map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <FieldError msg={errors.department} />
                        </div>

                        <div>
                            <Label>Municipality / City</Label>
                            <div className="relative">
                                <select name="municipality" className={selectCls("municipality")} value={form.municipality}
                                    onChange={(e) => { Change(e); setForm((p) => ({ ...p, zone: "" })); }}
                                    disabled={!form.department}>
                                    <option value="">Select municipality…</option>
                                    {municipalities.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <FieldError msg={errors.municipality} />
                        </div>

                        <div>
                            <Label>Zone / Neighborhood</Label>
                            <div className="relative">
                                <select name="zone" className={selectCls("zone")} value={form.zone} onChange={Change} disabled={!form.municipality}>
                                    <option value="">Select zone…</option>
                                    {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <FieldError msg={errors.zone} />
                        </div>

                        <div>
                            <Label>Exact Address</Label>
                            <input name="exactAddress" value={form.exactAddress} onChange={Change}
                                className={inputCls("exactAddress")} placeholder="Street, avenue, house number…" type="text" maxLength={200} />
                            <FieldError msg={errors.exactAddress} />
                        </div>

                        <div>
                            <Label>Postal Code</Label>
                            <input name="postalCode" min={0} max={99999} value={form.postalCode || ""} onChange={Change}
                                className={inputCls("postalCode")} placeholder="e.g. 10101" type="number" />
                        </div>
                    </div>
                </SectionCard>

                {/* ── SECTION 2: Property Details ── */}
                <SectionCard icon="/Valuation/property-icon.png" title="Property Details" step={2}>
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <Label>Property Type</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "house", label: "House" },
                                    { value: "apartment", label: "Apartment" },
                                    { value: "land", label: "Land" },
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => { setForm((p) => ({ ...p, type: value })); setErrors((p) => ({ ...p, type: undefined })); }}
                                        className={`h-10 rounded-lg text-sm font-medium border transition-colors ${form.type === value
                                            ? "bg-white text-[#0B1E4A] border-white"
                                            : "bg-white/10 text-white/60 border-white/20 hover:bg-white/15 hover:text-white"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <FieldError msg={errors.type} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label>Construction area (m²)</Label>
                                <input name="areaM2" min={0} max={99999} value={form.areaM2 || ""} onChange={Change}
                                    className={inputCls("areaM2")} placeholder="0" type="number" />
                                <FieldError msg={errors.areaM2} />
                            </div>
                            <div>
                                <Label>Lot area (m²)</Label>
                                <input name="landAreaM2" min={0} max={99999} value={form.landAreaM2 || ""} onChange={Change}
                                    className={inputCls("landAreaM2")} placeholder="0" type="number" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label>Levels / Floors</Label>
                                <input name="levels" min={1} max={100} value={form.levels || ""} onChange={Change}
                                    className={inputCls("levels")} placeholder="e.g. 1" type="number" />
                                <FieldError msg={errors.levels} />
                            </div>
                            <div>
                                <Label>Year Built <span className="normal-case font-normal opacity-50">(max {CURRENT_YEAR})</span></Label>
                                <input name="yearBuilt" min={MIN_YEAR} max={CURRENT_YEAR} value={form.yearBuilt || ""} onChange={Change}
                                    className={inputCls("yearBuilt")} placeholder={`e.g. ${CURRENT_YEAR - 5}`} type="number" />
                                <FieldError msg={errors.yearBuilt} />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── SECTION 3: Rooms & Spaces ── */}
                <SectionCard icon="/Valuation/bed-icon.png" title="Rooms & Spaces" step={3}>
                    <div className="flex flex-col gap-y-5">
                        {[
                            { field: "bedrooms" as keyof ValuationFormInput, label: "Bedrooms", max: 20, error: errors.bedrooms },
                            { field: "bathrooms" as keyof ValuationFormInput, label: "Bathrooms", max: 20, error: errors.bathrooms },
                            { field: "parkingSpaces" as keyof ValuationFormInput, label: "Parking Spaces", max: 10, error: undefined },
                        ].map(({ field, label, max, error }) => (
                            <div key={field}>
                                <Label>{label}</Label>
                                <div className="flex items-center gap-x-3">
                                    <button type="button"
                                        onClick={() => setForm((p) => ({ ...p, [field]: Math.max(0, (p[field] as number) - 1) }))}
                                        className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 text-white text-lg font-light flex items-center justify-center hover:bg-white/20 transition-colors">
                                        −
                                    </button>
                                    <span className="text-white text-lg font-semibold w-8 text-center">
                                        {form[field] as number}
                                    </span>
                                    <button type="button"
                                        onClick={() => setForm((p) => ({ ...p, [field]: Math.min(max, (p[field] as number) + 1) }))}
                                        className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 text-white text-lg font-light flex items-center justify-center hover:bg-white/20 transition-colors">
                                        +
                                    </button>
                                </div>
                                <FieldError msg={error} />
                            </div>
                        ))}

                        <div>
                            <Label>Kitchen Type</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: "closed", label: "Closed" },
                                    { value: "open", label: "Open" },
                                    { value: "semi_open", label: "Semi-Open" },
                                ].map(({ value, label }) => (
                                    <button key={value} type="button"
                                        onClick={() => setForm((p) => ({ ...p, kitchenType: value }))}
                                        className={`h-9 rounded-lg text-sm border transition-colors ${form.kitchenType === value
                                            ? "bg-white text-[#0B1E4A] border-white font-medium"
                                            : "bg-white/10 text-white/60 border-white/20 hover:bg-white/15 hover:text-white"
                                            }`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Additional Rooms</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-4 mt-1">
                                {[
                                    { name: "hasLivingDiningRoom", label: "Living / Dining Room" },
                                    { name: "hasLaundryRoom", label: "Laundry Room" },
                                    { name: "hasStorageCellar", label: "Storage / Cellar" },
                                    { name: "hasStudioHomeOffice", label: "Studio / Home Office" },
                                    { name: "hasServiceQuarter", label: "Service Quarter" },
                                ].map(({ name, label }) => (
                                    <ToggleChip key={name} name={name} label={label}
                                        checked={form[name as keyof ValuationFormInput] as boolean} onChange={Change} />
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── SECTION 4: Condition ── */}
                <SectionCard icon="/Valuation/tools-icon.png" title="Condition & Extras" step={4}>
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <Label>Property Condition</Label>
                            <div className="flex flex-col gap-y-2 mt-1">
                                {[
                                    { value: "brand_new", label: "Brand New", sub: "Never lived in" },
                                    { value: "excellent", label: "Excellent", sub: "Recently renovated" },
                                    { value: "good", label: "Good", sub: "Well maintained" },
                                    { value: "regular", label: "Regular", sub: "Minor wear" },
                                    { value: "needs_renovation", label: "Needs Renovation", sub: "Significant repairs needed" },
                                ].map(({ value, label, sub }) => (
                                    <label key={value} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-x-3">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${form.condition === value ? "border-emerald-400 bg-emerald-400" : "border-white/30"}`}>
                                                {form.condition === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium transition-colors ${form.condition === value ? "text-white" : "text-white/60"}`}>{label}</p>
                                                <p className="text-[10px] text-white/30">{sub}</p>
                                            </div>
                                        </div>
                                        <input type="radio" name="condition" value={value} checked={form.condition === value} onChange={Change} className="sr-only" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <Label>Interiors & Extras</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-4 mt-1">
                                {[
                                    { name: "hasAC", label: "Air Conditioning" },
                                    { name: "hasSmartHome", label: "Smart Home" },
                                    { name: "hasPool", label: "Private Pool" },
                                ].map(({ name, label }) => (
                                    <ToggleChip key={name} name={name} label={label}
                                        checked={form[name as keyof ValuationFormInput] as boolean} onChange={Change} />
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── SECTION 5: Security & Amenities ── */}
                <SectionCard icon="/Valuation/shield-icon.png" title="Security & Amenities" step={5}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-4">
                        {[
                            { name: "hasSecurityGate", label: "Security Gate" },
                            { name: "hasCCTV", label: "CCTV / Cameras" },
                            { name: "hasGym", label: "Gym" },
                            { name: "hasElevator", label: "Elevator" },
                            { name: "hasGreenAreas", label: "Green Areas" },
                            { name: "hasOtherAmenity", label: "Other" },
                        ].map(({ name, label }) => (
                            <ToggleChip key={name} name={name} label={label}
                                checked={form[name as keyof ValuationFormInput] as boolean} onChange={Change} />
                        ))}
                        {form.hasOtherAmenity && (
                            <div className="col-span-1 sm:col-span-2 mt-1">
                                <Label>Specify other amenity</Label>
                                <textarea name="otherAmenityDescription" value={form.otherAmenityDescription} onChange={Change}
                                    maxLength={300} rows={2}
                                    className="bg-white/10 border border-white/20 focus:border-white/50 outline-none w-full px-3 py-2 text-white text-sm rounded-lg placeholder:text-white/30 resize-none transition-colors"
                                    placeholder="Describe the amenity…" />
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* ── SECTION 6: Additional Info ── */}
                <SectionCard icon="/Valuation/info-icon.png" title="Additional Information" step={6}>
                    <div className="flex flex-col gap-y-4">
                        <div>
                            <Label>Public Description</Label>
                            <textarea name="publicDescription" value={form.publicDescription} onChange={Change}
                                maxLength={500} rows={3}
                                className="bg-white/10 border border-white/20 focus:border-white/50 outline-none w-full px-3 py-2 text-white text-sm rounded-lg placeholder:text-white/30 resize-none transition-colors"
                                placeholder="Describe the key features of the property…" />
                            <p className="text-white/30 text-[10px] mt-1 text-right">{form.publicDescription.length}/500</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label>Maintenance / HOA</Label>
                                <input name="maintenanceFee" min={0} max={99999} value={form.maintenanceFee || ""} onChange={Change}
                                    className={inputCls("maintenanceFee")} placeholder="$ 0.00" type="number" />
                            </div>
                            <div>
                                <Label>Included Services</Label>
                                <input name="includedServices" value={form.includedServices} onChange={Change} maxLength={200}
                                    className={inputCls("includedServices")} placeholder="Water, Trash…" type="text" />
                            </div>
                        </div>

                        <div>
                            <Label>Pets</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: "allowed", label: "Allowed" },
                                    { value: "not_allowed", label: "Not Allowed" },
                                ].map(({ value, label }) => (
                                    <button key={value} type="button"
                                        onClick={() => setForm((p) => ({ ...p, petsAllowed: value }))}
                                        className={`h-9 rounded-lg text-sm border transition-colors ${form.petsAllowed === value
                                            ? "bg-white text-[#0B1E4A] border-white font-medium"
                                            : "bg-white/10 text-white/60 border-white/20 hover:bg-white/15 hover:text-white"
                                            }`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ── SUBMIT ── */}
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col gap-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-900 text-base font-semibold">Check Property Value</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isEditMode ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-gray-100 text-gray-500"}`}>
                            {isEditMode ? "Editing" : "Draft"}
                        </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-x-3">
                        <div className="relative w-10 h-10 shrink-0">
                            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0D4687" strokeWidth="3"
                                    strokeDasharray={`${progress} ${100 - progress}`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#0D4687]">{progress}%</span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700">
                                {progress === 100 ? "All required fields complete" : `${Math.round(11 * progress / 100)} of 11 required fields filled`}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                                {progress < 100 ? "Complete all fields to get the most accurate estimate." : "Ready to calculate your estimate."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 bg-[#0B1E4A] hover:bg-[#0D2860] w-full h-14 text-white text-sm font-semibold rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Calculating…
                            </span>
                        ) : (
                            <>
                                <img src="/Valuation/stadistics-icon.png" alt="" className="h-4" />
                                {isEditMode ? "Recalculate Estimate" : "Get Instant House Estimate"}
                            </>
                        )}
                    </button>

                    <p className="text-gray-400 text-xs text-center">
                        By submitting, you agree to Valtrust Real Estate&apos;s{" "}
                        <span className="underline cursor-pointer hover:text-gray-600 transition-colors">terms and conditions</span>.
                    </p>
                </div>

            </div>
        </section>
    );
}
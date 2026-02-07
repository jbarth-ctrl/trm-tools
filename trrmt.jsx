import React, { useState, useMemo, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Download, 
  Eye, 
  Edit3, 
  CheckCircle, 
  RefreshCcw, 
  ArrowLeft, 
  Loader2 
} from 'lucide-react';

const FORMAT_TEMPLATES = {
    "Social Media Paid Campaign": {
        description: "We will leverage Thomann’s reach via social media ad formats, ensuring your product targets the right audience without cluttering organic feeds. Using high-impact, original creatives from our in-house photography and/or design teams, our performance team optimizes your budget across different channels (Meta, TikTok, Pinterest & Snapchat) based on historical benchmarks from thousands of successful campaigns.",
        defaultBudget: 2000,
        kpis: ["Ad Impressions", "Clicks", "CTR"],
        fields: { "Runtime": "7 days", "Estimated Ad Impressions": "350.000" }
    },
    "Thomann Onsite Retail Media Campaign": {
        description: "We will implement high-visibility placements on targeted category and search result pages. By intercepting high-intent users at the point of sale, this component converts passive interest into active consideration, securing the product’s position as a top-tier alternative during the final decision phase.",
        defaultBudget: 2000,
        kpis: ["Ad Impressions", "Clicks", "CTR", "Conversions", "CVR"],
        fields: { "Runtime": "7 days", "Estimated Ad Impressions": "35.000" }
    },
    "Rich Content": {
        description: "We will enhance product detail pages with additional photography, integrated video content, and easy to understand descriptions. This immersive multimedia approach reduces purchase barriers and provides a premium brand experience. To maximize global reach, these pages are subject to localization into core international languages, ensuring consistency across key markets.",
        defaultBudget: 600,
        kpis: ["Publishing Status"],
        fields: { "Products": "all relevant campaign products" }
    },
    "YouTube Demo Video (Thomann Channel)": {
        description: "Our expert hosts will produce a professional product demonstration for the Thomann YouTube channel, leveraging established authority to build trust. To maximize impact beyond organic subscribers, the content will be backed by a targeted YouTube ad campaign, driving broader reach and attracting new potential customers to the brand.",
        defaultBudget: 4000,
        kpis: ["Publishing Status"],
        fields: { "Channel": "Thomann’s" }
    },
    "Short Format Video (Thomann Channels)": {
        description: "Our hosts will produce high-impact, short-form demonstration or performance videos optimized for rapid engagement. This content will be deployed on the Thomann YouTube channel and strategically repurposed across all core social media platforms to maximize brand touchpoints and drive viral visibility within the community.",
        defaultBudget: 1000,
        kpis: ["Publishing Status"],
        fields: { "Channel": "Thomann’s" }
    },
    "Demo Video (External Channel)": {
        description: "We will partner with a specialized industry influencer to produce an independent product field test and demonstration. Leveraging an external creator provides authentic third-party validation and direct access to a dedicated, high-affinity audience. Specific creator selection and production timelines will be finalized following brand alignment.",
        defaultBudget: 1000,
        kpis: ["Publishing Status"],
        fields: { "Channel": "External Creator" }
    },
    "Custom Landing Page": {
        description: "We will develop a bespoke landing page designed to provide an immersive brand experience and deep-funnel educational value, elevating the customer journey beyond standard shop listings through the consolidation of brand-supplied rich media and technical insights.",
        defaultBudget: 1000,
        kpis: ["Publishing Status"],
        fields: {}
    },
    "MusikerNetzwerk Banner Campaign": {
        description: "We will deploy targeted display banners across the MusikerNetzwerk, ensuring high-relevance placements on websites that align with the product’s specific niche.",
        defaultBudget: 2000,
        kpis: ["Ad Impressions", "Clicks", "CTR"],
        fields: { "Runtime": "30 days", "Estimated Ad Impressions": "150.000" }
    },
    "“Hello New Gear” Blog Post": {
        description: "The product will be spotlighted in our high-reach \"Hello New Gear\" blog series, localized into six core languages.",
        defaultBudget: 500,
        kpis: ["Publishing Status"],
        fields: {}
    },
    "Instagram Giveaway": {
        description: "We will execute a high-engagement giveaway on our Instagram channel to drive brand interaction and audience growth.",
        defaultBudget: 1000,
        kpis: ["Publishing Status"],
        fields: { "Channel": "Instagram (Thomann Music)" }
    },
    "Homepage Banners - Thomann.de": {
        description: "We will implement a prominent homepage banner to anchor the campaign, providing a direct gateway to the dedicated series landing page.",
        defaultBudget: 12000,
        kpis: ["Ad Impressions"],
        fields: { "Runtime": "4 days" }
    },
    "Newsletter Placement": {
        description: "We will feature the product range in a curated Thomann newsletter, specifically segmented to reach a high-affinity audience.",
        defaultBudget: 2000,
        kpis: ["Sends", "Opens", "Open-Rate", "Clicks", "Click-To-Open-Rate"],
        fields: {}
    },
    "Affiliate Activation": {
        description: "We will leverage our professional affiliate network by soliciting bespoke content proposals tailored to the new product’s unique selling points.",
        defaultBudget: 5000,
        kpis: ["Publishing Status"],
        fields: { "Number of Expected Content Pieces": "5-7" }
    },
    "Screen Placements - Thomann Store": {
        description: "We will integrate dedicated content into the high-definition video loops across our new digital screen network in the Thomann retail store.",
        defaultBudget: 500,
        kpis: ["Playouts"],
        fields: { "Runtime": "30 Days", "Department": "PA & Lighting" }
    },
    "YouTube Pre Roll Ads": {
        description: "We will execute a strategic ad campaign on YouTube, utilizing proprietary Thomann audience data and advanced contextual targeting.",
        defaultBudget: 2000,
        kpis: ["Ad Impressions", "Clicks", "CTR"],
        fields: { "Runtime": "14 days" }
    },
    "Google Remarketing Campaign": {
        description: "We will deploy a Google Display Network campaign targeting high-intent users based on their specific browsing and shopping behavior on Thomann.de.",
        defaultBudget: 2000,
        kpis: ["Ad Impressions", "Clicks", "CTR"],
        fields: { "Runtime": "7 days", "Estimated Ad Impressions": "1.200.000" }
    }
};

const ThomannLogo = ({ color = "#00b5bd", className = "w-12 h-12" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeWidth="4"/>
        <path 
            d="M35 30 V45 H25 V55 H35 V75 C35 82 40 85 48 85 H60 V75 H52 C48 75 46 74 46 70 V55 H65 V45 H46 V30 Z" 
            fill={color} 
            transform="rotate(-5 50 50)"
        />
    </svg>
);

export default function App() {
    const [activeTab, setActiveTab] = useState('input');
    const [brandName, setBrandName] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [timing, setTiming] = useState('');
    const [generalTargeting, setGeneralTargeting] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const addFormat = (formatName) => {
        const template = FORMAT_TEMPLATES[formatName];
        setSelectedFormats([...selectedFormats, {
            id: crypto.randomUUID(),
            name: formatName,
            description: template.description,
            budget: template.defaultBudget,
            kpis: template.kpis,
            fields: template.fields ? { ...template.fields } : {}
        }]);
    };

    const updateBudget = (id, value) => {
        setSelectedFormats(selectedFormats.map(f => f.id === id ? { ...f, budget: parseFloat(value) || 0 } : f));
    };

    const updateField = (formatId, fieldKey, value) => {
        setSelectedFormats(selectedFormats.map(f => f.id === formatId ? { ...f, fields: { ...f.fields, [fieldKey]: value } } : f));
    };

    const removeFormat = (id) => setSelectedFormats(selectedFormats.filter(f => f.id !== id));

    const totalNet = useMemo(() => selectedFormats.reduce((sum, item) => sum + item.budget, 0), [selectedFormats]);

    const sortedSelectedFormats = useMemo(() => {
        return [...selectedFormats].sort((a, b) => b.budget - a.budget);
    }, [selectedFormats]);

    const availableFormatNames = useMemo(() => {
        const selectedNames = new Set(selectedFormats.map(f => f.name));
        return Object.keys(FORMAT_TEMPLATES)
            .filter(name => !selectedNames.has(name))
            .sort((a, b) => a.localeCompare(b));
    }, [selectedFormats]);

    const handleDownload = async () => {
        const element = document.getElementById('proposal-content');
        if (!element || !window.html2pdf) return;
        
        setIsGenerating(true);
        
        // Build dynamic filename: Thomann_Proposal_[Partner]_[Campaign]_[Timing].pdf
        const partnerPart = brandName.trim().replace(/\s+/g, '_');
        const campaignPart = campaignName.trim().replace(/\s+/g, '_');
        const timingPart = timing.trim().replace(/\s+/g, '_');
        
        let filename = "Thomann_Proposal";
        if (partnerPart) filename += `_${partnerPart}`;
        if (campaignPart) filename += `_${campaignPart}`;
        if (timingPart) filename += `_${timingPart}`;
        filename += ".pdf";
        
        const opt = {
            margin: [15, 15, 20, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 3, 
                useCORS: true, 
                letterRendering: true,
                logging: false,
                windowWidth: 840
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['.prevent-split'] }
        };
        
        try {
            const worker = window.html2pdf().set(opt).from(element).toPdf();
            
            await worker.get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(8);
                    pdf.setTextColor(160);
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    
                    pdf.text('Thomann GmbH • retailmedia.thomann.de', 15, pageHeight - 10);
                    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
                }
            }).save();
            
            setShowSuccess(true);
        } catch (err) {
            console.error("PDF generation failed:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const resetApp = () => {
        setBrandName('');
        setCampaignName('');
        setTiming('');
        setGeneralTargeting('');
        setAdditionalDetails('');
        setSelectedFormats([]);
        setShowSuccess(false);
        setActiveTab('input');
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-pdf">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ThomannLogo className="w-8 h-8" />
                        <h1 className="text-[10px] font-bold uppercase tracking-widest">
                            Thomann <span className="text-[#00b5bd]">Retail Media</span>
                        </h1>
                    </div>
                    <nav className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('input')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'input' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
                            <Edit3 size={12} /> Editor
                        </button>
                        <button onClick={() => setActiveTab('output')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'output' ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
                            <Eye size={12} /> Preview
                        </button>
                    </nav>
                    <div className="text-[10px] font-bold text-[#00b5bd] uppercase tracking-widest hidden sm:block">
                        Total: € {totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                {activeTab === 'input' ? (
                    <div className="max-w-6xl mx-auto p-8 flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#00b5bd]">Project Context</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Partner</label>
                                        <input type="text" className="w-full py-2 bg-transparent border-b border-slate-200 outline-none focus:border-[#00b5bd] font-bold text-lg" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Fender" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Campaign Name</label>
                                        <input type="text" className="w-full py-2 bg-transparent border-b border-slate-200 outline-none focus:border-[#00b5bd] font-bold text-lg" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Q3 Launch" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Timing</label>
                                        <input type="text" className="w-full py-2 bg-transparent border-b border-slate-200 outline-none focus:border-[#00b5bd] font-bold text-lg" value={timing} onChange={(e) => setTiming(e.target.value)} placeholder="e.g. September 2025" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Targeting</label>
                                        <input type="text" className="w-full py-2 bg-transparent border-b border-slate-200 outline-none focus:border-[#00b5bd] font-bold text-lg" value={generalTargeting} onChange={(e) => setGeneralTargeting(e.target.value)} placeholder="e.g. Electric Guitarists" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 pt-4">
                                    <div>
                                        <label className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Internal Context</label>
                                        <textarea className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 outline-none focus:ring-1 focus:ring-[#00b5bd] resize-none" value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} placeholder="Brief internal background or specific goals..." />
                                    </div>
                                </div>
                            </section>

                            <div className="space-y-4">
                                {selectedFormats.map((format) => (
                                    <div key={format.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-800">{format.name}</h4>
                                            <button onClick={() => removeFormat(format.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Object.entries(format.fields).map(([key, val]) => (
                                                    <div key={key}>
                                                        <label className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">{key}</label>
                                                        <input type="text" className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs font-bold rounded mt-1 outline-none focus:border-[#00b5bd]" value={val} onChange={(e) => updateField(format.id, key, e.target.value)} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full md:w-32">
                                                <label className="text-[8px] font-bold uppercase text-slate-400 tracking-wider">Budget (€)</label>
                                                <input type="number" className="w-full mt-1 bg-slate-50 border border-slate-100 px-3 py-2 text-xs font-extrabold text-right rounded outline-none focus:border-[#00b5bd]" value={format.budget} onChange={(e) => updateBudget(format.id, e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-80 no-pdf">
                            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest mb-6">Format Library</h2>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableFormatNames.map(name => (
                                        <button 
                                            key={name} 
                                            onClick={() => addFormat(name)} 
                                            className="w-full p-3 bg-slate-50 border border-slate-100 hover:border-[#00b5bd] rounded-xl text-left flex justify-between items-center text-[9px] font-bold uppercase transition-all hover:text-[#00b5bd] group"
                                        >
                                            <span className="truncate pr-2">{name}</span>
                                            <PlusCircle size={14} className="flex-shrink-0 text-slate-300 group-hover:text-[#00b5bd]" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 px-6 bg-slate-100 min-h-full no-pdf">
                        <div className="max-w-[840px] mx-auto">
                            <div className="mb-6 flex justify-end">
                                <button 
                                    disabled={isGenerating || selectedFormats.length === 0}
                                    onClick={handleDownload} 
                                    className="px-8 py-4 bg-[#00b5bd] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                    {isGenerating ? 'Building High-Res PDF...' : 'Download PDF Proposal'}
                                </button>
                            </div>

                            <div id="proposal-content" className="bg-white p-12 md:p-16 text-slate-900 shadow-xl print-container">
                                <div className="flex justify-between items-start mb-20">
                                    <div className="space-y-6">
                                        <ThomannLogo className="w-12 h-12" />
                                        <div className="pt-4">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#00b5bd] mb-2">Retail Media Proposal</p>
                                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black leading-none">{brandName || '[Partner Name]'}</h1>
                                            <p className="text-xl font-medium text-slate-400 mt-2">{campaignName || 'Campaign Concept'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right pt-2">
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Created on</p>
                                        <p className="font-bold text-xs text-black">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                {(timing || generalTargeting || additionalDetails) && (
                                    <div className="mb-16 py-10 border-y border-slate-100 grid grid-cols-12 gap-8 prevent-split">
                                        <div className="col-span-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00b5bd]">Strategic Overview</h3>
                                        </div>
                                        <div className="col-span-8 space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                {timing && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-black uppercase block text-[8px] mb-1 tracking-wider">Timing</span>
                                                        <span className="text-black font-extrabold uppercase text-sm">{timing}</span>
                                                    </div>
                                                )}
                                                {generalTargeting && (
                                                    <div className="text-xs">
                                                        <span className="font-bold text-black uppercase block text-[8px] mb-1 tracking-wider">Targeting</span>
                                                        <span className="text-black font-extrabold uppercase text-sm">{generalTargeting}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {additionalDetails && (
                                                <div className="text-xs text-slate-600 leading-relaxed pt-4 border-t border-slate-50">
                                                    <span className="font-bold text-black uppercase block text-[8px] mb-1 tracking-wider">Campaign Context</span>
                                                    <p className="text-black/80">{additionalDetails}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-16 mb-20">
                                    {sortedSelectedFormats.map((format) => (
                                        <div key={`p-${format.id}`} className="grid grid-cols-12 gap-8 prevent-split border-l-2 border-slate-50 pl-6">
                                            <div className="col-span-4">
                                                <h4 className="text-black font-black uppercase text-xs tracking-wider mb-4 leading-tight">{format.name}</h4>
                                                <div className="space-y-4">
                                                    {Object.entries(format.fields).map(([key, val]) => (
                                                        <div key={key}>
                                                            <span className="block text-[7px] uppercase font-bold text-slate-400 mb-0.5">{key}</span>
                                                            <span className="block text-[10px] font-extrabold text-black uppercase">{val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-8">
                                                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">{format.description}</p>
                                                <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                                    <span className="text-[8px] font-bold uppercase text-[#00b5bd] tracking-widest">Reporting KPIs:</span>
                                                    <span className="text-[8px] font-extrabold text-black uppercase">{format.kpis?.join(' • ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-20 prevent-split">
                                    <div className="bg-slate-50 p-12 rounded-3xl border border-slate-100">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#00b5bd] mb-8">Investment Recapitulation</h3>
                                        <div className="space-y-4 mb-10">
                                            {sortedSelectedFormats.map(f => (
                                                <div key={`inv-${f.id}`} className="flex justify-between items-center text-[11px] font-bold border-b border-slate-200/50 pb-3">
                                                    <span className="text-slate-500 uppercase tracking-tight">{f.name}</span>
                                                    <span className="text-black">€ {f.budget.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-baseline pt-6 border-t-2 border-slate-200">
                                            <div className="space-y-1">
                                                <h4 className="text-lg font-black uppercase tracking-tighter text-black">Total Net Investment</h4>
                                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Excl. applicable VAT</p>
                                            </div>
                                            <span className="text-3xl font-black text-[#00b5bd] tracking-tighter">€ {totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {showSuccess && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 max-w-lg w-full border border-slate-100">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Proposal Ready</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-10 italic">"Quality is remembered long after price is forgotten."</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={resetApp} className="w-full bg-[#00b5bd] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2">
                                <RefreshCcw size={14} /> New Campaign
                            </button>
                            <button onClick={() => setShowSuccess(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                <ArrowLeft size={14} /> Review Document
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .prevent-split { page-break-inside: avoid !important; break-inside: avoid !important; }
                .print-container {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    width: 100%;
                    max-width: 840px;
                    margin: 0 auto;
                }
                @media print { .no-pdf { display: none !important; } }
            `}</style>
        </div>
    );
}

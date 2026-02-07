import Link from "next/link";

export default function ImprintPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
            <div className="max-w-[800px] mx-auto">
                <Link href="/" className="text-sm font-bold text-[#1e3a5f] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight italic">Imprint / Legal Notice</h1>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm space-y-10">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a853] mb-4">Operator Information</h2>
                        <div className="text-slate-700 space-y-1 font-medium text-lg">
                            <p className="font-black text-slate-900">Martin Vasko</p>
                            <p>Ulica Jozefa Adamca 9983/24</p>
                            <p>917 01 Trnava, Slovakia</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a853] mb-4">Company Details</h2>
                        <div className="text-slate-700 space-y-1 font-medium italic">
                            <p><span className="font-bold text-slate-900 not-italic">IČO:</span> 56440553</p>
                            <p><span className="font-bold text-slate-900 not-italic">Legal Form:</span> Sole Trader (Živnostník)</p>
                            <p><span className="font-bold text-slate-900 not-italic">Registered in:</span> Trade Register of the District Office Trnava</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a853] mb-4">Contact</h2>
                        <div className="text-slate-700 space-y-1 font-medium text-lg">
                            <p><span className="font-bold text-slate-900">Email:</span> <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a></p>
                            <p><span className="font-bold text-slate-900">Website:</span> <Link href="/" className="text-[#1e3a5f] underline">rentclock.online</Link></p>
                        </div>
                    </section>

                    <section className="pt-6 border-t border-slate-100 italic">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4a853] mb-4">Online Dispute Resolution</h2>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            The European Commission provides a platform for online dispute resolution (OS), which you can find here: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline">https://ec.europa.eu/consumers/odr</a>. We are not obliged or willing to participate in a dispute resolution procedure before a consumer arbitration board.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

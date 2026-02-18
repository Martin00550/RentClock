import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service | RentClock",
    description: "Terms and conditions for using the RentClock lease management platform.",
    alternates: {
        canonical: "/terms",
    },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-[800px] mx-auto">
                <Link href="/" className="text-sm font-bold text-[#1e3a5f] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed mb-6">
                        <strong>Effective Date:</strong> January 2026
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        By using RentClock, you agree to the following terms. Please read them carefully.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Service Description</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        RentClock is a lease management tool that helps property owners track critical dates such as rent increases and lease expirations. RentClock provides automated reminders via email and SMS.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Disclaimer</h2>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
                        <strong>IMPORTANT:</strong> RentClock is for informational purposes only and does not constitute legal or financial advice. Please verify dates and amounts against your original lease agreement and consult with local legal counsel before issuing formal notices. Lease notification requirements vary by state.
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                        <li>You are responsible for verifying all extracted dates against your source documents.</li>
                        <li>You agree not to upload documents containing sensitive personal information of third parties without authorization.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Limitation of Liability</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        RentClock is provided &quot;as is&quot; without warranties of any kind. RentClock is not liable for any damages arising from missed dates, incorrect data extraction, or your reliance on the service.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Termination</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        RentClock reserves the right to suspend or terminate accounts that violate these terms. You may cancel your subscription at any time.
                    </p>


                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. SMS Messaging Policy</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        By enabling SMS alerts in your account dashboard, you consent to receive automated transactional text messages from RentClock.
                        <br /><br />
                        <strong>Opt-In:</strong> SMS alerts are disabled by default. You must manually toggle alerts on for each specific lease in your dashboard.
                        <br />
                        <strong>Frequency:</strong> Messages are sent based on your specific lease dates (typically at 90, 60, 30, and 7-day intervals).
                        <br />
                        <strong>Opt-Out:</strong> You can disable SMS alerts at any time by toggling them off in your dashboard settings. Alternatively, you can reply &quot;STOP&quot; to any message to be unsubscribed from all future SMS. Reply &quot;HELP&quot; for more information.
                        <br />
                        <strong>Rates:</strong> Message and data rates may apply.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Legal Entity</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        RentClock is operated by:
                        <br />
                        <strong>Martin Vasko</strong>
                        <br />
                        Ulica Jozefa Adamca 9983/24
                        <br />
                        917 01 Trnava, Slovakia
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Contact Us</h2>
                    <p className="text-slate-600 leading-relaxed">
                        For questions about these terms, please contact: <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

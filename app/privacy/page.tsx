import Link from "next/link";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy | RentClock",
    description: "How RentClock handles and protects your commercial lease data.",
    alternates: {
        canonical: "/privacy",
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-[800px] mx-auto">
                <Link href="/" className="text-sm font-bold text-[#1e3a5f] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed mb-6">
                        <strong>Effective Date:</strong> January 2026
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        <p className="mb-4">By using RentClock, you agree to the collection and use of information in accordance with this policy. </p>RentClock is committed to protecting your privacy. This Privacy Policy explains how RentClock collects, uses, and safeguards your information when you use the service.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information RentClock Collects</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                        <li><strong>Account Information:</strong> Email address and name provided during signup (via Clerk authentication).</li>
                        <li><strong>Lease Documents:</strong> PDF, DOCX, or image files you upload for date extraction.</li>
                        <li><strong>Usage Data:</strong> How you interact with the application (pages visited, features used).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How RentClock Uses Your Information</h2>
                    <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                        <li>To provide and maintain the RentClock service.</li>
                        <li>To send you critical date reminders via email or SMS (with your consent).</li>
                        <li>To improve our service based on usage patterns.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Data Storage & Security</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        Your data is encrypted at rest and in transit using industry-standard TLS. Documents are stored in private, access-controlled cloud storage (Supabase). RentClock does not sell or share your data with third parties for marketing purposes. No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Your Rights</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        You may request deletion of your account and all associated data at any time by contacting us at <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a>.
                    </p>


                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
                    <p className="text-slate-600 leading-relaxed">
                        For any privacy-related questions, please contact us at <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a>.
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-4">
                        <strong>Legal Entity:</strong>
                        <br />
                        Martin Vasko
                        <br />
                        Ulica Jozefa Adamca 9983/24
                        <br />
                        917 01 Trnava, Slovakia
                        <br />
                        IČO: 56440553
                    </p>
                </div>
            </div>
        </div>
    );
}

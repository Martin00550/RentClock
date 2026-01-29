import Link from "next/link";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-[800px] mx-auto">
                <Link href="/" className="text-sm font-bold text-[#1e3a5f] hover:underline mb-8 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Refund Policy</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed mb-6">
                        <strong>Effective Date:</strong> January 2026
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        At RentClock, we want you to be completely satisfied with our service. We provide a transparent and fair refund policy.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Money-Back Guarantee</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        We offer a <strong>7-day money-back guarantee</strong> on all new subscriptions. If you are not satisfied with RentClock for any reason during your first 7 days, let us know and we will refund your initial payment in full.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How to Request a Refund</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        To request a refund, please email our support team at <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a> with your account email address and a brief explanation of why the product didn&apos;t meet your needs.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cancellations</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        You can cancel your subscription at any time from your dashboard. After the 7-day window, your cancellation will take effect at the end of the current billing cycle, and you will not be charged again. We do not provide prorated refunds for cancellations made mid-cycle after the initial 7-day period.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contact Us</h2>
                    <p className="text-slate-600 leading-relaxed">
                        If you have any questions about our Refund Policy, please contact us:
                    </p>
                    <p className="text-slate-600 leading-relaxed mt-4">
                        <strong>Email:</strong> <a href="mailto:support@rentclock.online" className="text-[#1e3a5f] underline">support@rentclock.online</a>
                        <br /><br />
                        <strong>Legal Entity:</strong>
                        <br />
                        Martin Vasko
                        <br />
                        Ulica Jozefa Adamca 9983/24
                        <br />
                        917 01 Trnava, Slovakia
                    </p>
                </div>
            </div>
        </div>
    );
}

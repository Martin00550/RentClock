/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { Lease } from "@/lib/types";
import { formatCurrency } from "@/lib/lease-utils";

// Define styles with "Trust Navy" palette
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: "Helvetica",
        fontSize: 11,
        lineHeight: 1.5,
        color: "#334155", // Slate-700
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
        borderBottom: 2,
        borderBottomColor: "#1e3a5f", // Trust Navy
        paddingBottom: 20,
    },
    logoText: {
        fontSize: 10,
        color: "#1e3a5f",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    watermark: {
        position: "absolute",
        top: 40,
        right: 40,
        opacity: 0.1,
    },
    title: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a", // Slate-900
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 30,
    },
    section: {
        marginBottom: 25,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    label: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        color: "#1e3a5f",
        marginBottom: 2,
        textTransform: "uppercase",
    },
    value: {
        fontSize: 11,
        color: "#0f172a",
    },
    highlightBox: {
        backgroundColor: "#f8fafc",
        borderLeft: 3,
        borderLeftColor: "#1e3a5f",
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    highlightRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    highlightLabel: {
        fontSize: 10,
        color: "#64748b",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    highlightValue: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#1e3a5f",
    },
    footer: {
        position: "absolute",
        bottom: 50,
        left: 50,
        right: 50,
        textAlign: "center",
        fontSize: 9,
        color: "#94a3b8",
        borderTop: 1,
        borderTopColor: "#e2e8f0",
        paddingTop: 15,
    },
    signatureBlock: {
        marginTop: 60,
    },
    signatureLine: {
        width: 200,
        borderBottom: 1,
        borderBottomColor: "#334155",
        marginTop: 40,
        marginBottom: 5,
    },
});

interface LeaseNoticePDFProps {
    lease: Lease;
    type: "rent-increase" | "renewal";
}

export function LeaseNoticePDF({ lease, type }: LeaseNoticePDFProps) {
    const today = new Date();
    const isIncrease = type === "rent-increase";

    // Rent Increase Data
    const currentRent = formatCurrency(lease.monthly_rent);
    const increaseAmount = lease.rent_increase_amount ? formatCurrency(lease.rent_increase_amount) : "N/A";
    const newRent = lease.rent_increase_amount ? formatCurrency(lease.monthly_rent + lease.rent_increase_amount) : "N/A";
    const effectiveDate = lease.rent_increase_date
        ? format(new Date(lease.rent_increase_date), "MMMM d, yyyy")
        : "[DATE]";

    // Renewal Data
    const expirationDate = lease.lease_end_date
        ? format(new Date(lease.lease_end_date), "MMMM d, yyyy")
        : "[EXP DATE]";

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.logoText}>Official Notice</Text>
                    <Text style={{ fontSize: 9, color: "#94a3b8" }}>Generated via RentClock</Text>
                </View>

                {/* CONTENT */}
                <View style={styles.section}>
                    <Text style={{ fontSize: 10, marginBottom: 20 }}>{format(today, "MMMM d, yyyy")}</Text>

                    <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 5 }}>VIA CERTIFIED MAIL & EMAIL</Text>
                    <Text>To: {lease.tenant_name}</Text>
                    <Text>Re: {lease.property_address}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>
                        {isIncrease ? "Notice of Rent Adjustment" : "Lease Expiration Reminder"}
                    </Text>

                    <Text style={{ marginBottom: 15 }}>
                        Dear {lease.tenant_name},
                    </Text>

                    <Text style={{ marginBottom: 15 }}>
                        {isIncrease
                            ? `This letter serves as formal notice that pursuant to your lease agreement, the monthly rent for the above-referenced property will be adjusted effective ${effectiveDate}.`
                            : `This letter serves as a reminder that your lease agreement for the above-referenced property is scheduled to expire on ${expirationDate}.`
                        }
                    </Text>

                    {isIncrease && (
                        <View style={styles.highlightBox}>
                            <View style={styles.highlightRow}>
                                <Text style={styles.highlightLabel}>Current Rent:</Text>
                                <Text style={styles.value}>{currentRent}</Text>
                            </View>
                            <View style={styles.highlightRow}>
                                <Text style={styles.highlightLabel}>Adjustment:</Text>
                                <Text style={styles.value}>+ {increaseAmount}</Text>
                            </View>
                            <View style={{ height: 1, backgroundColor: "#e2e8f0", marginVertical: 8 }} />
                            <View style={styles.highlightRow}>
                                <Text style={styles.highlightLabel}>New Monthly Rent:</Text>
                                <Text style={styles.highlightValue}>{newRent}</Text>
                            </View>
                            <View style={styles.highlightRow}>
                                <Text style={styles.highlightLabel}>Effective Date:</Text>
                                <Text style={styles.highlightValue}>{effectiveDate}</Text>
                            </View>
                        </View>
                    )}

                    {!isIncrease && (
                        <View style={styles.highlightBox}>
                            <View style={styles.highlightRow}>
                                <Text style={styles.highlightLabel}>Expiration Date:</Text>
                                <Text style={{ ...styles.highlightValue, color: "#ef4444" }}>{expirationDate}</Text>
                            </View>
                        </View>
                    )}

                    <Text style={{ marginBottom: 15 }}>
                        {isIncrease
                            ? "Please update your payment records accordingly to ensure timely receipt of the new rental amount. All other terms and conditions of your lease agreement remain in full force and effect."
                            : "We value your tenancy and would like to discuss your renewal options. Please contact our office at your earliest convenience to confirm your plans for the upcoming term."
                        }
                    </Text>

                    <Text>
                        Thank you for your cooperation.
                    </Text>
                </View>

                {/* SIGNATURE */}
                <View style={styles.signatureBlock}>
                    <Text>Sincerely,</Text>
                    <View style={styles.signatureLine} />
                    <Text style={{ marginBottom: 2 }}>Property Management</Text>
                    <Text style={{ fontSize: 10, color: "#64748b" }}>{lease.property_address}</Text>
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text>Professional Portfolio Management • Secured by RentClock</Text>
                </View>
            </Page>
        </Document>
    );
}

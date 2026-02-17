import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { AppConfig, Lead } from "@/lib/config-schema";
import { PricingResult } from "@/lib/pricing-engine";
import { getLocalized } from "@/lib/i18n-utils";

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: "Helvetica",
        fontSize: 11,
        color: "#1a1a1a",
    },
    watermark: {
        position: "absolute",
        top: '40%',
        left: '10%',
        fontSize: 100,
        fontWeight: "bold",
        color: "rgba(0,0,0,0.02)",
        transform: "rotate(-45deg)",
        opacity: 0.1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        paddingBottom: 20,
        marginBottom: 30,
    },
    logoSection: {
        flexDirection: "column",
    },
    logoText: {
        fontSize: 24,
        fontWeight: "black",
        letterSpacing: -1,
    },
    logoSubtext: {
        fontSize: 9,
        color: "#719436",
        textTransform: "uppercase",
        fontWeight: "bold",
        marginTop: 2,
    },
    contactInfo: {
        textAlign: "right",
        fontSize: 8,
        color: "#666",
        lineHeight: 1.4,
    },
    infoGrid: {
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
    },
    infoCol: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 8,
        color: "#999",
        textTransform: "uppercase",
        fontWeight: "bold",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 12,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        borderLeftWidth: 3,
        borderLeftColor: "#719436",
        paddingLeft: 10,
        marginBottom: 15,
        marginTop: 10,
    },
    pkgDesc: {
        fontSize: 9,
        color: "#666",
        marginBottom: 20,
        lineHeight: 1.5,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 8,
        fontWeight: "bold",
        color: "#999",
        fontSize: 8,
        textTransform: "uppercase",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
        paddingVertical: 10,
        alignItems: "center",
    },
    colDesc: { flex: 4 },
    colPrice: { flex: 1, textAlign: "right" },
    summarySection: {
        marginTop: 20,
        alignItems: "flex-end",
    },
    summaryRow: {
        flexDirection: "row",
        width: 250,
        justifyContent: "space-between",
        paddingVertical: 3,
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: "#000",
        flexDirection: "row",
        width: 250,
        justifyContent: "space-between",
    },
    totalText: {
        fontSize: 18,
        fontWeight: "black",
    },
    notesSection: {
        marginTop: 40,
        padding: 10,
        backgroundColor: "#fffdf5",
        borderWidth: 1,
        borderColor: "#fef3c7",
    },
    footer: {
        position: "absolute",
        bottom: 50,
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 15,
        textAlign: "center",
        color: "#aaa",
        fontSize: 8,
    },
});

interface QuoteDocumentProps {
    config: AppConfig;
    pricing: PricingResult;
    pkgName: string;
    pkgDescription?: string;
    date: string;
    leadData?: Partial<Lead>;
    additionalRequests?: string;
    lang?: string;
}

export const QuoteDocument = ({
    config,
    pricing,
    pkgName,
    pkgDescription,
    date,
    leadData,
    additionalRequests,
    lang = "it"
}: QuoteDocumentProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.watermark}>GARFAGNANAFOTO.IT</Text>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Text style={styles.logoText}>GARFAGNANAFOTO</Text>
                        <Text style={styles.logoSubtext}>Wedding Photography & Video</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text>Sillico, Castelnuovo di Garfagnana</Text>
                        <Text>Lucca, Toscana, Italia</Text>
                        <Text>www.garfagnanafoto.it</Text>
                    </View>
                </View>

                {/* Cliente & Document Info */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Cliente</Text>
                        <Text style={styles.infoValue}>
                            {leadData?.first_name || leadData?.last_name
                                ? `${leadData.first_name} ${leadData.last_name}`.trim()
                                : "---"}
                        </Text>
                        {leadData?.wedding_location && (
                            <Text style={{ fontSize: 9, color: "#666", marginTop: 4 }}>
                                Location: {leadData.wedding_location}
                            </Text>
                        )}
                    </View>
                    <View style={{ ...styles.infoCol, textAlign: "right" }}>
                        <Text style={styles.infoLabel}>Documento</Text>
                        <Text style={styles.infoValue}>Preventivo Servizio</Text>
                        <Text style={{ fontSize: 9, color: "#666", marginTop: 4 }}>Data: {date}</Text>
                    </View>
                </View>

                {/* Package Info */}
                <Text style={styles.sectionTitle}>{pkgName}</Text>
                {pkgDescription && <Text style={styles.pkgDesc}>{pkgDescription}</Text>}

                {/* Line Items */}
                <View style={styles.tableHeader}>
                    <View style={styles.colDesc}><Text>Servizio / Voce</Text></View>
                    <View style={styles.colPrice}><Text>Prezzo (Netto)</Text></View>
                </View>
                {pricing.lineItems.map((item) => (
                    <View key={item.id} style={styles.tableRow}>
                        <View style={styles.colDesc}>
                            <Text style={{ fontWeight: "medium" }}>{getLocalized(item.label, lang)}</Text>
                        </View>
                        <View style={styles.colPrice}>
                            <Text>€ {item.priceNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                    </View>
                ))}

                {/* Totals */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={{ color: "#666" }}>Imponibile</Text>
                        <Text>€ {pricing.subtotalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    </View>

                    {pricing.packageAdjustmentNet !== 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={{ color: "#719436", fontStyle: "italic" }}>Sconto/Adeguamento</Text>
                            <Text style={{ color: "#719436" }}>€ {pricing.packageAdjustmentNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                    )}

                    <View style={styles.totalRow}>
                        <Text style={{ ...styles.totalText, fontSize: 14 }}>Totale Netto</Text>
                        <Text style={styles.totalText}>€ {pricing.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    </View>

                    <View style={{ ...styles.summaryRow, marginTop: 4 }}>
                        <Text style={{ fontSize: 9, color: "#999" }}>
                            + IVA {(pricing.vatRate * 100).toFixed(0)}% (€ {pricing.vatAmount.toFixed(2)})
                        </Text>
                        <Text style={{ fontSize: 9, color: "#666", fontWeight: "bold" }}>
                            Totale € {pricing.totalGross.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Additional Requests */}
                {additionalRequests && (
                    <View style={styles.notesSection}>
                        <Text style={styles.infoLabel}>Note Aggiuntive</Text>
                        <Text style={{ fontStyle: "italic", marginTop: 5, lineHeight: 1.4 }}>"{additionalRequests}"</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>{getLocalized(config.legalCopy.deliveryTime, lang)} | {getLocalized(config.legalCopy.paymentTerms, lang)}</Text>
                    <Text style={{ marginTop: 5 }}>{getLocalized(config.legalCopy.disclaimer, lang)}</Text>
                    <Text style={{ marginTop: 10, color: "#ddd" }}>Documento generato il {date} - 17:00:00 (GMT+1)</Text>
                </View>
            </Page>
        </Document>
    );
};

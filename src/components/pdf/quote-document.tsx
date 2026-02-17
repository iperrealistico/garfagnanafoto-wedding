import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import { AppConfig, Package } from "@/lib/config-schema";
import { PricingResult } from "@/lib/pricing-engine";

// Register fonts? Standard fonts are Helvetica, so we use that for simplicity and performance without downloading files.
// If needed, we can register custom fonts.

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 12,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: "#666",
    },
    section: {
        marginBottom: 10,
    },
    pkgTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    pkgDesc: {
        fontSize: 10,
        color: "#444",
        marginBottom: 15,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f0f0f0",
    },
    rowLabel: {
        width: "70%",
    },
    rowValue: {
        width: "30%",
        textAlign: "right",
    },
    totals: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
    },
    totalLabel: {
        fontWeight: "bold",
    },
    totalValue: {
        fontWeight: "bold",
    },
    footer: {
        marginTop: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        fontSize: 9,
        color: "#888",
    },
    legal: {
        marginTop: 5,
    },
});

interface QuoteDocumentProps {
    config: AppConfig;
    pricing: PricingResult;
    pkgName: string;
    pkgDescription?: string;
    date: string;
}

export const QuoteDocument = ({ config, pricing, pkgName, pkgDescription, date }: QuoteDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Garfagnanafoto Wedding</Text>
                <Text style={styles.subtitle}>Preventivo Servizio Fotografico/Video</Text>
                <Text style={styles.subtitle}>Data: {date}</Text>
            </View>

            {/* Package Info */}
            <View style={styles.section}>
                <Text style={styles.pkgTitle}>{pkgName}</Text>
                {pkgDescription && <Text style={styles.pkgDesc}>{pkgDescription}</Text>}
            </View>

            {/* Line Items */}
            <View style={styles.section}>
                {pricing.lineItems.map((item) => (
                    <View key={item.id} style={styles.row}>
                        <Text style={styles.rowLabel}>{item.label}</Text>
                        <Text style={styles.rowValue}>{item.priceNet.toFixed(2)} €</Text>
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text>Imponibile</Text>
                    <Text>{pricing.subtotalNet.toFixed(2)} €</Text>
                </View>

                {pricing.packageAdjustmentNet !== 0 && (
                    <View style={styles.totalRow}>
                        <Text>Sconto/Adeguamento</Text>
                        <Text>{pricing.packageAdjustmentNet.toFixed(2)} €</Text>
                    </View>
                )}

                <View style={{ ...styles.totalRow, marginTop: 5 }}>
                    <Text style={styles.totalLabel}>Totale Netto</Text>
                    <Text style={styles.totalValue}>{pricing.totalNet.toFixed(2)} €</Text>
                </View>

                <View style={styles.totalRow}>
                    <Text>IVA {(pricing.vatRate * 100).toFixed(0)}%</Text>
                    <Text>{pricing.vatAmount.toFixed(2)} €</Text>
                </View>

                <View style={{ ...styles.totalRow, marginTop: 5, fontSize: 14 }}>
                    <Text style={{ fontWeight: "bold" }}>Totale Lordo</Text>
                    <Text style={{ fontWeight: "bold" }}>{pricing.totalGross.toFixed(2)} €</Text>
                </View>
            </View>

            {/* Footer / Legal */}
            <View style={styles.footer}>
                <View style={styles.legal}>
                    <Text>Termini di consegna: {config.legalCopy.deliveryTime}</Text>
                </View>
                <View style={styles.legal}>
                    <Text>Pagamento: {config.legalCopy.paymentTerms}</Text>
                </View>
                <View style={styles.legal}>
                    <Text>{config.legalCopy.disclaimer}</Text>
                </View>
            </View>

        </Page>
    </Document>
);

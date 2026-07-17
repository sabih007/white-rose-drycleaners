import fs from "fs";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const QR_CODE_BUFFER = fs.readFileSync(
  path.join(process.cwd(), "public", "qr.png")
);
const LOGO_BUFFER = fs.readFileSync(
  path.join(process.cwd(), "public", "logo.png")
);

type SerializedBooking = {
  id: string;
  bookingCode: string;
  customerName: string;
  phone: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  createdAt: Date | string;
  items: {
    id: string;
    itemName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

const ACCENT = "#583101";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#171717",
  },
  headerBand: {
    backgroundColor: "#faf3ea",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 81,
    height: 60,
  },
  body: {
    padding: 32,
    paddingTop: 16,
  },
  subtle: {
    fontSize: 9,
    color: "#737373",
    marginTop: 2,
  },
  headerSubtle: {
    fontSize: 9,
    color: "#8a6a45",
    marginTop: 3,
    letterSpacing: 0.5,
  },
  badge: {
    fontSize: 9,
    fontWeight: 700,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: ACCENT,
    color: "#ffffff",
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    marginBottom: 4,
  },
  metaItem: {
    width: "50%",
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 8.5,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: 500,
  },
  deliveryBanner: {
    marginTop: 4,
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#faf3ea",
    borderWidth: 1,
    borderColor: "#e7bc91",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryLabel: {
    fontSize: 9,
    color: "#583101",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  deliveryValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#3a1f00",
    marginTop: 2,
  },
  table: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  colItem: { width: "40%" },
  colQty: { width: "20%" },
  colPrice: { width: "20%" },
  colTotal: { width: "20%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: "#737373",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  totalLabel: {
    fontSize: 10,
    color: "#737373",
    marginRight: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 700,
    color: ACCENT,
  },
  notes: {
    marginTop: 16,
    fontSize: 10,
    color: "#525252",
  },
  footer: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#a3a3a3",
  },
  paymentBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    flexDirection: "row",
    alignItems: "center",
  },
  paymentQr: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 9,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  paymentValue: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 2,
  },
});

const statusLabel: Record<string, string> = {
  RECEIVED: "Received",
  READY: "Ready",
  DELIVERED: "Delivered",
};

function getExpectedDelivery(createdAt: Date | string) {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 5);
  return date;
}

export function ReceiptDocument({
  booking,
  shopName,
}: {
  booking: SerializedBooking;
  shopName: string;
}) {
  const expectedDelivery = getExpectedDelivery(booking.createdAt);

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.headerBand}>
          <View>
            <Image style={styles.logo} src={LOGO_BUFFER} />
            <Text style={styles.headerSubtle}>
              RECEIPT #{booking.bookingCode}
            </Text>
          </View>
          <Text style={styles.badge}>
            {(statusLabel[booking.status] ?? booking.status).toUpperCase()}
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Customer</Text>
              <Text style={styles.metaValue}>{booking.customerName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Phone</Text>
              <Text style={styles.metaValue}>{booking.phone}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Received</Text>
              <Text style={styles.metaValue}>
                {new Date(booking.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Booking #</Text>
              <Text style={styles.metaValue}>{booking.bookingCode}</Text>
            </View>
          </View>

          <View style={styles.deliveryBanner}>
            <View>
              <Text style={styles.deliveryLabel}>Expected Delivery</Text>
              <Text style={styles.deliveryValue}>
                {expectedDelivery.toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Text style={styles.deliveryLabel}>5-day turnaround</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.colItem, styles.tableHeaderText]}>
                Item
              </Text>
              <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
              <Text style={[styles.colPrice, styles.tableHeaderText]}>
                Unit Price
              </Text>
              <Text style={[styles.colTotal, styles.tableHeaderText]}>
                Line Total
              </Text>
            </View>
            {booking.items.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
                ]}
                key={item.id}
              >
                <Text style={styles.colItem}>{item.itemName}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>
                  {item.unitPrice.toFixed(2)}
                </Text>
                <Text style={styles.colTotal}>
                  {item.lineTotal.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalText}>
              {booking.totalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.paymentBox}>
            <Image style={styles.paymentQr} src={QR_CODE_BUFFER} />
            <View>
              <Text style={styles.paymentLabel}>Scan to Pay</Text>
              <Text style={styles.paymentValue}>Meezan Bank</Text>
            </View>
          </View>

          {booking.notes && (
            <Text style={styles.notes}>Notes: {booking.notes}</Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Thank you for choosing {shopName}!
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

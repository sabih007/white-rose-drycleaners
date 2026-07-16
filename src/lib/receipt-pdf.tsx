import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#171717",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 700,
  },
  subtle: {
    fontSize: 9,
    color: "#737373",
    marginTop: 2,
  },
  badge: {
    fontSize: 9,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    color: "#171717",
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  metaItem: {
    width: "50%",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 9,
    color: "#737373",
  },
  metaValue: {
    fontSize: 11,
    marginTop: 1,
  },
  table: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 6,
  },
  colItem: { width: "40%" },
  colQty: { width: "20%" },
  colPrice: { width: "20%" },
  colTotal: { width: "20%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 9,
    color: "#737373",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  totalText: {
    fontSize: 13,
    fontWeight: 700,
  },
  notes: {
    marginTop: 16,
    fontSize: 10,
    color: "#525252",
  },
});

const statusLabel: Record<string, string> = {
  RECEIVED: "Received",
  READY: "Ready",
  DELIVERED: "Delivered",
};

export function ReceiptDocument({
  booking,
  shopName,
}: {
  booking: SerializedBooking;
  shopName: string;
}) {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.shopName}>{shopName}</Text>
            <Text style={styles.subtle}>Receipt #{booking.bookingCode}</Text>
          </View>
          <Text style={styles.badge}>
            {statusLabel[booking.status] ?? booking.status}
          </Text>
        </View>

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

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colItem, styles.tableHeaderText]}>Item</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>Qty</Text>
            <Text style={[styles.colPrice, styles.tableHeaderText]}>
              Unit Price
            </Text>
            <Text style={[styles.colTotal, styles.tableHeaderText]}>
              Line Total
            </Text>
          </View>
          {booking.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.colItem}>{item.itemName}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.colTotal}>{item.lineTotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>
            Total: {booking.totalAmount.toFixed(2)}
          </Text>
        </View>

        {booking.notes && (
          <Text style={styles.notes}>Notes: {booking.notes}</Text>
        )}
      </Page>
    </Document>
  );
}

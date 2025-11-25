import React, { useState, useEffect } from "react";
import { ChevronDown, Download, Eye, Package, Search, MapPin, RotateCcw, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import yourrkartLogo from "@/assets/YourrLogo.png";
import { fetchProducts } from "@/api/productApi";
import { listOrders, updateOrder, listReturnRequests, createReturnRequest } from "@/api/userApi";
import { useCountryCode } from "../../hooks/useCountryCode";

export default function OrdersComponent({ userId }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnFilter, setReturnFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editAddressOrder, setEditAddressOrder] = useState(null);
  const [newAddress, setNewAddress] = useState({});
  const [returnRequests, setReturnRequests] = useState([]);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
  const [returnType, setReturnType] = useState("refund");
  const [returnReason, setReturnReason] = useState("");
  const [returnItems, setReturnItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedReturnStatus, setSelectedReturnStatus] = useState(null);
  const [paidRefundedPage, setPaidRefundedPage] = useState(1);
  const [pendingFailedPage, setPendingFailedPage] = useState(1);
  const ordersPerPage = 5;
  const { countries } = useCountryCode();

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        setLoading(true);
        const [ordersData, returnsData] = await Promise.all([
          listOrders(userId),
          listReturnRequests(),
        ]);

        if (!Array.isArray(ordersData)) {
          throw new Error("Orders data is not an array");
        }

        const filteredOrders = ordersData
          .sort((a, b) => new Date(b.order_date || b.created_at) - new Date(a.order_date || a.created_at));

        const productIds = [...new Set(filteredOrders.flatMap((order) => order.items.map((item) => item.product_id)))];

        const productsResponse = await fetchProducts({ ids: productIds.join(",") });
        const productMap = productsResponse.reduce((map, product) => {
          map[product.id] = { ...product, title: toTitleCase(product.title) };
          return map;
        }, {});

        setOrders(filteredOrders);
        setProducts(productMap);
        setReturnRequests(returnsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load orders or return requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndProducts();
  }, [userId]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filterOrders = (orders, paymentStatuses) => {
    return orders
      .filter((order) => paymentStatuses.includes(order.payment_status))
      .filter((order) => {
        const matchesOrderId = order.order_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProductName = order.items.some((item) =>
          products[item.product_id]?.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return matchesOrderId || matchesProductName;
      })
      .filter((order) => statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase())
      .filter((order) => {
        const relatedReturn = returnRequests.find((req) => req.order.order_id === order.order_id);
        if (returnFilter === "all") return true;
        if (returnFilter === "no-return") return !relatedReturn;
        if (returnFilter === "pending") return relatedReturn && relatedReturn.status.toLowerCase() === "pending";
        if (returnFilter === "rejected") return relatedReturn && relatedReturn.status.toLowerCase() === "rejected";
        if (returnFilter === "completed") return relatedReturn && relatedReturn.status.toLowerCase() === "completed";
        return true;
      });
  };

  const paidRefundedOrders = filterOrders(orders, ["paid", "refunded"]);
  const pendingFailedOrders = filterOrders(orders, ["pending", "failed"]);

  const paidRefundedTotalPages = Math.ceil(paidRefundedOrders.length / ordersPerPage);
  const pendingFailedTotalPages = Math.ceil(pendingFailedOrders.length / ordersPerPage);

  const paginatedPaidRefundedOrders = paidRefundedOrders.slice(
    (paidRefundedPage - 1) * ordersPerPage,
    paidRefundedPage * ordersPerPage
  );

  const paginatedPendingFailedOrders = pendingFailedOrders.slice(
    (pendingFailedPage - 1) * ordersPerPage,
    pendingFailedPage * ordersPerPage
  );

  const handlePageChange = (section, direction) => {
    if (section === "paidRefunded") {
      setPaidRefundedPage((prev) => {
        if (direction === "prev" && prev > 1) return prev - 1;
        if (direction === "next" && prev < paidRefundedTotalPages) return prev + 1;
        return prev;
      });
    } else if (section === "pendingFailed") {
      setPendingFailedPage((prev) => {
        if (direction === "prev" && prev > 1) return prev - 1;
        if (direction === "next" && prev < pendingFailedTotalPages) return prev + 1;
        return prev;
      });
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const formatPrice = (value) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    const addHeader = () => {
      doc.setFillColor(34, 34, 34);
      doc.rect(0, 0, 210, 40, "F");
      doc.addImage(yourrkartLogo, "PNG", margin, 10, 20, 20);
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Yourrkart", margin + 25, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #${order.order_id}`, margin + 25, 35);
    };

    const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, margin, pageHeight - 10);
        doc.text("Yourrkart | support@yourrkart.com | +1-800-123-4567", 210 - margin, pageHeight - 10, { align: "right" });
      }
    };

    addHeader();

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", margin, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order Date: ${new Date(order.order_date || order.created_at).toLocaleDateString()}`, margin, 60);
    doc.text(`Status: ${toTitleCase(order.status)}`, margin, 67);
    doc.text(`Payment Method: ${toTitleCase(order.payment_method)}`, margin, 74);
    doc.text(
      `Delivered Date: ${order.delivered_date ? new Date(order.delivered_date).toLocaleDateString() : "N/A"}`,
      margin,
      81
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address", margin, 95);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addr = order.shipping_address;
    const addressLines = [
      toTitleCase(addr.full_name),
      toTitleCase(addr.address_line_1),
      `${toTitleCase(addr.city)}, ${toTitleCase(addr.state)} ${addr.area_zip_code}`,
      toTitleCase(addr.country),
      `Phone: ${addr.mobile_number}`,
    ];
    addressLines.forEach((line, index) => doc.text(line, margin, 100 + index * 7));

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Items", margin, 135);
    const tableBody = [
      ...order.items.map((item) => [
        products[item.product_id]?.title || `Product ID: ${item.product_id}`,
        item.quantity,
        `${order.currency} ${formatPrice(item.price)}`,
        `${order.currency} ${formatPrice(item.quantity * item.price)}`,
      ]),
      ["Shipping Cost", "", "", `${order.currency} ${formatPrice(order.shipping_cost || 0)}`],
    ];
    autoTable(doc, {
      startY: 140,
      head: [["Product", "Quantity", "Unit Price", "Total"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [34, 34, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: { fontSize: 9, textColor: [33, 33, 33] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: margin, right: margin },
      didDrawPage: () => addHeader(),
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Amount: ${order.currency} ${formatPrice(order.total_amount)}`,
      210 - margin,
      finalY,
      { align: "right" }
    );

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing Yourrkart!", margin, finalY + 20);

    addFooter();

    doc.save(`invoice_${order.order_id}.pdf`);
  };

  const getPhonePrefix = (country) => {
    const countryData = countries.find((c) => c.name === country);
    return countryData ? `+${countryData.phone}` : "+91";
  };

  const handleEditAddress = (order) => {
    setEditAddressOrder(order);
    const mobile = order.shipping_address.mobile_number.replace(getPhonePrefix(order.shipping_address.country), "");
    setNewAddress({ ...order.shipping_address, mobile_number: mobile });
  };

  const handleAddressChange = async (e) => {
    e.preventDefault();
    try {
      const fullPhone = `${getPhonePrefix(newAddress.country)}${newAddress.mobile_number}`;
      const updatedAddress = { ...newAddress, mobile_number: fullPhone };
      const updatedOrder = await updateOrder(userId, editAddressOrder.order_id, {
        shipping_address: updatedAddress,
      });
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.order_id === updatedOrder.order_id ? updatedOrder : o
        )
      );
      setEditAddressOrder(null);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const isReturnEligible = (order) => {
    const deliveredDate = order.delivered_date ? new Date(order.delivered_date) : null;
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    return (
      order.status === "delivered" &&
      order.payment_status === "paid" &&
      deliveredDate &&
      deliveredDate > sevenDaysAgo &&
      !returnRequests.some((req) => req.order.order_id === order.order_id)
    );
  };

  const getReturnIconColor = (returnStatus) => {
    if (!returnStatus) return "";
    switch (returnStatus.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  const handleRequestReturn = (order) => {
    const existingRequest = returnRequests.find((req) => req.order.order_id === order.order_id);
    if (existingRequest) {
      setSelectedReturnStatus(existingRequest);
    } else {
      setSelectedReturnOrder(order);
      setReturnItems(
        order.items.map((item) => ({
          order_item_id: item.id,
          quantity: 0,
          maxQuantity: item.quantity,
          condition: "unused",
        }))
      );
      setReturnType("refund");
      setReturnReason("");
      setErrorMessage(null);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemsToReturn = returnItems.filter((item) => item.quantity > 0);
      if (itemsToReturn.length === 0) {
        setErrorMessage("Please select at least one item to return.");
        return;
      }

      const returnData = {
        order_id: selectedReturnOrder.order_id,
        request_type: returnType,
        reason: returnReason,
        items: itemsToReturn.map((item) => ({
          order_item_id: item.order_item_id,
          quantity: item.quantity,
          condition: item.condition,
        })),
      };

      const newReturnRequest = await createReturnRequest(returnData);
      setReturnRequests((prev) => [...prev, newReturnRequest]);
      setSelectedReturnOrder(null);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error creating return request:", error);
      setErrorMessage(error.error || "Failed to submit return request.");
    }
  };

  const renderInput = (field, value, onChange, placeholder, required = false) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={field} className="text-right text-sm font-medium">
        {toTitleCase(field.replace(/_/g, " "))}{required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={field}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className="col-span-3"
        disabled={field === "full_name"}
        required={required}
      />
    </div>
  );

  const renderPhoneInput = () => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="mobile_number" className="text-right text-sm font-medium">
        Mobile Number<span className="text-red-500">*</span>
      </Label>
      <div className="col-span-3 flex">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {getPhonePrefix(newAddress.country)}
        </span>
        <Input
          id="mobile_number"
          placeholder="Mobile Number"
          value={newAddress.mobile_number || ""}
          onChange={(e) => setNewAddress({ ...newAddress, mobile_number: e.target.value })}
          className="rounded-l-none"
          maxLength={13}
          required
        />
      </div>
    </div>
  );

  const renderCountrySelect = () => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="country" className="text-right text-sm font-medium">
        Country<span className="text-red-500">*</span>
      </Label>
      <Select
        value={newAddress.country || "India"}
        onValueChange={(value) =>
          setNewAddress({
            ...newAddress,
            country: value,
            mobile_number: "",
          })
        }
        required
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent className="max-h-40">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderOrderTable = (orders, title, section, currentPage, totalPages) => (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No Orders Found.</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const relatedReturn = returnRequests.find((req) => req.order.order_id === order.order_id);
                return (
                  <React.Fragment key={order.order_id}>
                    <TableRow className="group">
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{new Date(order.order_date || order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{toTitleCase(order.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentVariant(order.payment_status)}>
                          {toTitleCase(order.payment_status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order.items.length}</TableCell>
                      <TableCell className="text-right">{order.currency} {formatPrice(order.total_amount)}</TableCell>
                      <TableCell className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleOrderDetails(order.order_id)}
                          aria-label="Toggle Order Details"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expandedOrder === order.order_id ? "rotate-180" : ""}`}
                          />
                        </Button>
                        {order.status.toLowerCase() === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAddress(order)}
                            aria-label="Edit Delivery Address"
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <div className="relative group">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRequestReturn(order)}
                              aria-label={relatedReturn ? "View Return Status" : "Request Refund"}
                            >
                              <RotateCcw
                                className={`h-4 w-4 ${getReturnIconColor(relatedReturn?.status)}`}
                              />
                            </Button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                              {relatedReturn ? "View Return Status" : "Request Refund"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedOrder === order.order_id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <div className="bg-muted/50 p-4">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {order.status === "delivered"
                                    ? `Delivered On ${new Date(order.delivered_date).toLocaleDateString()}`
                                    : order.status === "shipped"
                                    ? "Estimated Delivery: Soon"
                                    : "Processing Your Order"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 gap-1"
                                      onClick={() => handleViewDetails(order)}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      <span>View Details</span>
                                    </Button>
                                  </DialogTrigger>
                                  {selectedOrder && (
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Order Details - {selectedOrder.order_id}</DialogTitle>
                                        <DialogDescription>View The Detailed Information Of Your Order Below.</DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                                            <p>{toTitleCase(selectedOrder.shipping_address.full_name)}</p>
                                            <p>{toTitleCase(selectedOrder.shipping_address.address_line_1)}</p>
                                            <p>{`${toTitleCase(selectedOrder.shipping_address.city)}, ${toTitleCase(selectedOrder.shipping_address.state)} ${selectedOrder.shipping_address.area_zip_code}`}</p>
                                            <p>{toTitleCase(selectedOrder.shipping_address.country)}</p>
                                            <p>Phone: {selectedOrder.shipping_address.mobile_number}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                                            <p>Order Date: {new Date(selectedOrder.order_date || selectedOrder.created_at).toLocaleDateString()}</p>
                                            <p>Status: <Badge variant={getStatusVariant(selectedOrder.status)}>{toTitleCase(selectedOrder.status)}</Badge></p>
                                            <p>Subtotal: {selectedOrder.currency} {formatPrice(selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</p>
                                            <p>Shipping Cost: {selectedOrder.currency} {formatPrice(selectedOrder.shipping_cost || 0)}</p>
                                            <p>Total: {selectedOrder.currency} {formatPrice(selectedOrder.total_amount)}</p>
                                            <p>Payment Method: {toTitleCase(selectedOrder.payment_method)}</p>
                                            <p>Payment Status: <Badge variant={selectedOrder.payment_status === "paid" ? "success" : "secondary"}>{toTitleCase(selectedOrder.payment_status)}</Badge></p>
                                          </div>
                                        </div>
                                        <div>
                                          <h3 className="text-lg font-semibold mb-2">Items</h3>
                                          <div className="grid gap-4">
                                            {selectedOrder.items.map((item) => (
                                              <div key={item.id} className="flex items-start gap-4 border p-4 rounded-md">
                                                <img
                                                  src={products[item.product_id]?.images?.[0]?.image || "https://via.placeholder.com/300"}
                                                  alt={products[item.product_id]?.title || `Product ${item.product_id}`}
                                                  className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                  <h4 className="font-medium">{products[item.product_id]?.title || `Product ID: ${item.product_id}`}</h4>
                                                  <p className="text-sm">Quantity: {item.quantity}</p>
                                                  <p className="text-sm">Price: {selectedOrder.currency} {formatPrice(item.price)}</p>
                                                  <p className="text-sm">Total: {selectedOrder.currency} {formatPrice(item.quantity * item.price)}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  )}
                                </Dialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 gap-1"
                                  onClick={() => handleDownloadInvoice(order)}
                                  disabled={order.status !== "delivered" && order.status !== "cancelled"}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Invoice</span>
                                </Button>
                              </div>
                            </div>
                            <div className="rounded-md border bg-background">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{products[item.product_id]?.title || `Product ID: ${item.product_id}`}</TableCell>
                                      <TableCell className="text-right">{item.quantity}</TableCell>
                                      <TableCell className="text-right">{order.currency} {formatPrice(item.price)}</TableCell>
                                      <TableCell className="text-right">{order.currency} {formatPrice(item.quantity * item.price)}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell>Shipping Cost</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right">{order.currency} {formatPrice(order.shipping_cost || 0)}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Total</strong></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right"><strong>{order.currency} {formatPrice(order.total_amount)}</strong></TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            {relatedReturn && (
                              <div className="mt-4">
                                <h3 className="text-sm font-semibold">Return Request</h3>
                                <p className="text-sm">Type: {toTitleCase(relatedReturn.request_type)}</p>
                                <p className="text-sm">Status: {toTitleCase(relatedReturn.status)}</p>
                                <p className="text-sm">Reason: {relatedReturn.reason}</p>
                                <p className="text-sm">
                                  Refund Amount: {relatedReturn.refund_amount ? `${order.currency} ${formatPrice(relatedReturn.refund_amount)}` : "N/A"}
                                </p>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Condition</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {relatedReturn.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{products[item.order_item.product_id]?.title || `Product ID: ${item.order_item.product_id}`}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{toTitleCase(item.condition)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(section, "prev")}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(section, "next")}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card className="bg-transparent shadow-md border-none">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>View And Track Your Order History</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search By Order ID Or Product Name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Delivery- All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={returnFilter} onValueChange={setReturnFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter By Return" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Return Filters - All Orders</SelectItem>
              <SelectItem value="no-return">No Return</SelectItem>
              <SelectItem value="pending">Pending Return</SelectItem>
              <SelectItem value="rejected">Rejected Return</SelectItem>
              <SelectItem value="completed">Completed Return</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderOrderTable(paginatedPaidRefundedOrders, "Paid and Refunded Orders", "paidRefunded", paidRefundedPage, paidRefundedTotalPages)}
        {renderOrderTable(paginatedPendingFailedOrders, "Pending and Failed Payment Orders", "pendingFailed", pendingFailedPage, pendingFailedTotalPages)}

        {/* Edit Address Dialog */}
        <Dialog open={!!editAddressOrder} onOpenChange={() => setEditAddressOrder(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Delivery Address - Order {editAddressOrder?.order_id}</DialogTitle>
              <DialogDescription>Update the shipping address for this order below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddressChange} className="py-4">
              <div className="h-[300px] overflow-y-auto space-y-4 pr-2">
                {renderInput("full_name", newAddress.full_name, (e) => setNewAddress({ ...newAddress, full_name: e.target.value }), "Full Name", true)}
                {renderInput("address_line_1", newAddress.address_line_1, (e) => setNewAddress({ ...newAddress, address_line_1: e.target.value }), "Address Line 1", true)}
                {renderInput("address_line_2", newAddress.address_line_2, (e) => setNewAddress({ ...newAddress, address_line_2: e.target.value }), "Address Line 2 (Optional)")}
                {renderInput("city", newAddress.city, (e) => setNewAddress({ ...newAddress, city: e.target.value }), "City", true)}
                {renderInput("state", newAddress.state, (e) => setNewAddress({ ...newAddress, state: e.target.value }), "State", true)}
                {renderInput("area_zip_code", newAddress.area_zip_code, (e) => setNewAddress({ ...newAddress, area_zip_code: e.target.value }), "Zip Code", true)}
                {renderPhoneInput()}
                {renderCountrySelect()}
              </div>
              <Button type="submit" className="mt-4 w-full">Save Address</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Return Request Dialog */}
        <Dialog open={!!selectedReturnOrder} onOpenChange={() => setSelectedReturnOrder(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Request Return - Order {selectedReturnOrder?.order_id}</DialogTitle>
              <DialogDescription>Select items to return and specify the request type.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              {errorMessage && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Return Type</label>
                <Select value={returnType} onValueChange={setReturnType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Enter reason for return"
                  required
                />
              </div>
              {/* <div>
                <h3 className="text-sm font-semibold">Order Summary</h3>
                <p className="text-sm">Subtotal: {selectedReturnOrder?.currency} {formatPrice(selectedReturnOrder?.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</p>
                <p className="text-sm">Shipping Cost: {selectedReturnOrder?.currency} {formatPrice(selectedReturnOrder?.shipping_cost || 0)}</p>
                <p className="text-sm">Total: {selectedReturnOrder?.currency} {formatPrice(selectedReturnOrder?.total_amount)}</p>
              </div> */}
              <div>
                <h3 className="text-sm font-semibold">Items to Return</h3>
                <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                  {returnItems.map((item, index) => (
                    <div key={item.order_item_id} className="flex items-center gap-2">
                      <span className="text-sm flex-1 truncate">
                        {products[selectedReturnOrder?.items.find((i) => i.id === item.order_item_id)?.product_id]?.title || `Item ${item.order_item_id}`}
                      </span>
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) =>
                          setReturnItems((prev) =>
                            prev.map((i, idx) =>
                              idx === index ? { ...i, quantity: parseInt(value) } : i
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: item.maxQuantity + 1 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={item.condition}
                        onValueChange={(value) =>
                          setReturnItems((prev) =>
                            prev.map((i, idx) =>
                              idx === index ? { ...i, condition: value } : i
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unused">Unused</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Submit Return Request</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Return Status Dialog */}
        <Dialog open={!!selectedReturnStatus} onOpenChange={() => setSelectedReturnStatus(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Return Request Status - Order {selectedReturnStatus?.order.order_id}</DialogTitle>
              <DialogDescription>Details of your return request.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>Type: {toTitleCase(selectedReturnStatus?.request_type)}</p>
              <p>Status: <Badge variant={getReturnStatusVariant(selectedReturnStatus?.status)}>{toTitleCase(selectedReturnStatus?.status)}</Badge></p>
              <p>Reason: {selectedReturnStatus?.reason}</p>
              <p>Refund Amount: {selectedReturnStatus?.refund_amount ? `${selectedReturnStatus?.order.currency} ${formatPrice(selectedReturnStatus?.refund_amount)}` : "N/A"}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedReturnStatus?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{products[item.order_item.product_id]?.title || `Product ID: ${item.order_item.product_id}`}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{toTitleCase(item.condition)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case "pending": return "warning";
    case "shipped": return "default";
    case "delivered": return "success";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
}

function getPaymentVariant(status) {
  switch (status?.toLowerCase()) {
    case "pending": return "warning";
    case "refunded": return "default";
    case "paid": return "success";
    case "failed": return "destructive";
    default: return "secondary";
  }
}

function getReturnStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case "pending": return "warning";
    case "completed": return "success";
    case "rejected": return "destructive";
    case "shipped": return "default";
    default: return "secondary";
  }
}
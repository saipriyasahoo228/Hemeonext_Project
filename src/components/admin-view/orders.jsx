import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Eye, FileText, Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { fetchOrderDetails, updateOrderDetails } from "@/api/apiOrder";
import { useCurrency } from "../../context/currency-context";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";




// Utility function to convert string to title case
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function AdminOrdersView() {
  const { currencySymbols } = useCurrency();

  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openPaymentDetailsDialog, setOpenPaymentDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openViewPopup, setOpenViewPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openShippingDialog, setOpenShippingDialog] = useState(false);
  const [shippingEditData, setShippingEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  


  // PDF Download 

  const downloadPDF = (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) {
      console.error("No orders found.");
      return;
    }
  
    const doc = new jsPDF();
  
    orders.forEach((order, index) => {
      if (index > 0) doc.addPage(); // Add a new page for each order
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14); // Set font size smaller for the title
      doc.text("Order Details", 14, 10);
  
      // Order basic details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10); // Decrease font size for the order details
      doc.text(`Order ID: ${order.order_id}`, 14, 20);
      doc.text(`Customer: ${order.customer}`, 14, 25);
      doc.text(`Total Amount: ${order.total_amount} ${order.currency}`, 14, 30);
      doc.text(`Shipping Cost: ${order.shipping_cost}`, 14, 35);
      doc.text(`Status: ${order.status}`, 14, 40);
      doc.text(`Payment Method: ${order.payment_method}`, 14, 45);
      doc.text(`Payment Status: ${order.payment_status}`, 14, 50);
      doc.text(`Order Date: ${new Date(order.order_date).toLocaleString()}`, 14, 55);
      doc.text(`Delivered Date: ${new Date(order.delivered_date).toLocaleString()}`, 14, 60);
      doc.text(`Shipped Date: ${new Date(order.shipped_date).toLocaleString()}`, 14, 65);
      doc.text(`Cancelled Date: ${new Date(order.cancelled_date).toLocaleString()}`, 14, 70);
  
      // Shipping address details
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10); // Smaller font size for the shipping address section
      doc.text("Shipping Address:", 14, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9); // Further reduce font size for address details
      const address = order.shipping_address;
      doc.text(`Name: ${address.full_name}`, 14, 85);
      doc.text(`Mobile: ${address.mobile_number}`, 14, 90);
      doc.text(`Address: ${address.address_line_1}`, 14, 95);
      if (address.address_line_2) doc.text(address.address_line_2, 14, 100);
      doc.text(`${address.city}, ${address.state}, ${address.country}`, 14, 105);
      doc.text(`Zip: ${address.area_zip_code}`, 14, 110);
  
      // Use autoTable with smaller font and reduced space between rows
      autoTable(doc, {
        startY: 115, // Adjusted start position to reduce space between sections
        head: [["#", "Product ID", "Quantity", "Price"]], // Table headers
        body: order.items.map((item, idx) => [
          idx + 1,
          item.product_id,
          item.quantity,
          item.price,
        ]), // Table rows
        styles: { fontSize: 8 }, // Smaller font size for table content
        theme: "striped", // Striped theme for table rows
      });
    });
  
    doc.save("Orders_Details.pdf"); // Save the PDF
  };
  
  const filteredOrders = orders.filter((order) =>
    order.order_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  function handleFetchOrderDetails(orderId) {
    const order = orders.find((o) => o.order_id === orderId);
    setOrderDetails(order);
    setUpdatedStatus(order.status);
    setUpdatedPaymentStatus(order.payment_status);
    setOpenDetailsDialog(true);
  }

  function handleViewStatus(order) {
    setSelectedOrder(order);
    console.log("Selected Order:", order);
    setOpenViewPopup(true);
  }

  function handleViewPaymentDetails(order) {
    setSelectedOrder(order);
    setOpenPaymentDetailsDialog(true);
  }

  async function handleUpdateStatus() {
    try {
      const currentDate = new Date().toISOString();
      const updatedData = {
        status: updatedStatus,
        payment_status: updatedPaymentStatus,
        status_history: [
          ...(orderDetails.status_history || []),
          { status: updatedStatus, date: currentDate },
        ],
      };

      if (updatedStatus === "delivered") {
        updatedData.delivered_date = currentDate;
      } else if (updatedStatus === "shipped") {
        updatedData.shipped_date = currentDate;
      } else if (updatedStatus === "cancelled") {
        updatedData.cancelled_date = currentDate;
      }

      const updatedOrder = await updateOrderDetails(orderDetails.order_id, updatedData);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderDetails.order_id ? updatedOrder : order
        )
      );
      setOrderDetails((prev) => ({ ...prev, ...updatedOrder }));
      setOpenDetailsDialog(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  }

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrderDetails();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    getOrders();
  }, []);

  return (
    <Card className="md:w-full w-96" style={{ border: "2px solid gold", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <div className="flex flex-col md:flex-row items-center w-full">
  <div className="flex-grow">
    <Input
      placeholder="Search by Order ID..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="w-60"
    />
  </div>
  <div className="mt-2 md:mt-0 md:ml-auto">
  <Button onClick={() => downloadPDF(orders)}>Download PDF</Button>
  </div>
</div>

        
      </CardHeader>
      
      

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="px-8">Order Price</TableHead>
              <TableHead className="px-16 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders
              .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
              .map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.order_date?.split("T")[0] || "N/A"}</TableCell>
                  <TableCell>{order.delivered_date?.split("T")[0] || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        order.status === "delivered"
                          ? "bg-green-500"
                          : order.status === "pending"
                          ? "bg-yellow-500"
                          : order.status === "shipped"
                          ? "bg-blue-500"
                          : order.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {toTitleCase(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        order.payment_status === "paid"
                          ? "bg-green-500"
                          : order.payment_status === "pending"
                          ? "bg-yellow-500"
                          : order.payment_status === "failed"
                          ? "bg-red-600"
                          : order.payment_status === "refunded"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {toTitleCase(order.payment_status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{currencySymbols[order.currency]}{order.total_amount}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFetchOrderDetails(order.order_id)}
                        title="View Details"
                      >
                        <FileText className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewStatus(order)}
                        title="View Status"
                      >
                        <Eye className="w-5 h-5 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewPaymentDetails(order)}
                        title="View Payment Details"
                      >
                        <Eye className="w-5 h-5 text-green-500" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShippingEditData(order);
                          setOpenShippingDialog(true);
                        }}
                        title="Edit Shipping Info"
                      >
                        <Pencil className="w-5 h-5 text-purple-500" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
  <span className="text-sm text-muted-foreground">
    Page {currentPage} of {totalPages}
  </span>
  <div className="flex items-center gap-4">
    <span className="text-sm text-muted-foreground">Rows Per Page</span>
    <Select value={ordersPerPage.toString()} onValueChange={(value) => setOrdersPerPage(parseInt(value))}>
      <SelectTrigger>
        <SelectValue placeholder="Rows per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="15">15</SelectItem>
        <SelectItem value="20">20</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="flex gap-2 items-center">
    <Button
      variant="outline"
      onClick={() => handlePageChange("prev")}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      onClick={() => handlePageChange("next")}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
</div>

      </CardContent>

      <Dialog open={openShippingDialog} onOpenChange={setOpenShippingDialog}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Shipping Info</DialogTitle>
          </DialogHeader>
          {shippingEditData && (
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="PIN Code"
                value={shippingEditData.shippingInfo?.pinCode || ""}
                onChange={(e) =>
                  setShippingEditData((prev) => ({
                    ...prev,
                    shippingInfo: {
                      ...prev.shippingInfo,
                      pinCode: e.target.value,
                    },
                  }))
                }
              />
              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Shipping Charge"
                value={shippingEditData.shippingInfo?.shippingCharge || ""}
                onChange={(e) =>
                  setShippingEditData((prev) => ({
                    ...prev,
                    shippingInfo: {
                      ...prev.shippingInfo,
                      shippingCharge: parseFloat(e.target.value),
                    },
                  }))
                }
              />
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setOrders((prev) =>
                      prev.map((order) =>
                        order.order_id === shippingEditData.order_id ? shippingEditData : order
                      )
                    );
                    setOpenShippingDialog(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openViewPopup} onOpenChange={setOpenViewPopup}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Order Status History</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.status_history?.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>{toTitleCase(status.status)}</TableCell>
                    <TableCell>{status.date?.split("T")[0]}</TableCell>
                  </TableRow>
                ))}
                {selectedOrder.shipped_date && (
                  <TableRow>
                    <TableCell>Shipped</TableCell>
                    <TableCell>{selectedOrder.shipped_date.split("T")[0]}</TableCell>
                  </TableRow>
                )}
                {selectedOrder.delivered_date && (
                  <TableRow>
                    <TableCell>Delivered</TableCell>
                    <TableCell>{selectedOrder.delivered_date.split("T")[0]}</TableCell>
                  </TableRow>
                )}
                {selectedOrder.cancelled_date && (
                  <TableRow>
                    <TableCell>Cancelled</TableCell>
                    <TableCell>{selectedOrder.cancelled_date.split("T")[0]}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openPaymentDetailsDialog} onOpenChange={setOpenPaymentDetailsDialog}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3">
              <p><strong>Payment Method:</strong> {toTitleCase(selectedOrder.payment_method)}</p>
              <p><strong>Payment Status:</strong> {toTitleCase(selectedOrder.payment_status)}</p>
              {selectedOrder.payment_details && (
                <>
                  <p><strong>Currency:</strong> {selectedOrder.payment_details.currency}</p>
                  <p><strong>Razorpay Order ID:</strong> {selectedOrder.payment_details.razorpay_order_id}</p>
                  <p><strong>Razorpay Payment ID:</strong> {selectedOrder.payment_details.razorpay_payment_id}</p>
                </>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="w-[450px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <>
              <div className="overflow-y-auto pr-2 space-y-3" style={{ maxHeight: "70vh" }}>
                <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
                <p><strong>Order Date:</strong> {orderDetails.order_date?.split("T")[0]}</p>
                <p><strong>Delivery Date:</strong> {orderDetails.delivered_date?.split("T")[0] || "N/A"}</p>
                <p><strong>Shipped Date:</strong> {orderDetails.shipped_date?.split("T")[0] || "N/A"}</p>
                <p><strong>Cancelled Date:</strong> {orderDetails.cancelled_date?.split("T")[0] || "N/A"}</p>
                <p><strong>Order Price:</strong> {currencySymbols[orderDetails.currency]}{orderDetails.total_amount}</p>
                <p><strong>Shipping Cost:</strong> {currencySymbols[orderDetails.currency]}{orderDetails.shipping_cost || "0.00"}</p>
                <p><strong>Payment Method:</strong> {toTitleCase(orderDetails.payment_method)}</p>
                <p><strong>Payment Status:</strong> {toTitleCase(orderDetails.payment_status)}</p>
                <div>
                  <h4 className="mt-4 font-semibold">Order Status</h4>
                  <Select onValueChange={setUpdatedStatus} value={updatedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h4 className="mt-4 font-semibold">Payment Status</h4>
                  <Select onValueChange={setUpdatedPaymentStatus} value={updatedPaymentStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h4 className="mt-4 font-semibold">Order Items</h4>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="border p-2 rounded-lg mt-2">
                      <p><strong>Product ID:</strong> {item.product_id}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> {currencySymbols[orderDetails.currency]}{item.price}</p>
                    </div>
                  ))}
                  <div className="border p-2 rounded-lg mt-2">
                    <p><strong>Shipping Cost:</strong> {currencySymbols[orderDetails.currency]}{orderDetails.shipping_cost || "0.00"}</p>
                  </div>
                  <div className="border p-2 rounded-lg mt-2">
                    <p><strong>Total:</strong> {currencySymbols[orderDetails.currency]}{orderDetails.total_amount}</p>
                  </div>
                </div>
                <div>
                  <h4 className="mt-4 font-semibold">Shipping Info</h4>
                  <p><strong>Name:</strong> {orderDetails.shipping_address.full_name}</p>
                  <p><strong>Address:</strong> {orderDetails.shipping_address.address_line_1}</p>
                  <p><strong>City:</strong> {orderDetails.shipping_address.city}</p>
                  <p><strong>ZIP:</strong> {orderDetails.shipping_address.area_zip_code}</p>
                  <p><strong>Phone:</strong> {orderDetails.shipping_address.mobile_number}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handleUpdateStatus}>Update</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminOrdersView;










import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "../../context/currency-context";
import {
  fetchReturnRequests,
  fetchProducts,
  submitReturnAction,
} from "../../api/returnsAdminApi";

export default function AdminReturns() {
  const { currencySymbols } = useCurrency();
  const [returnRequests, setReturnRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); 
  const [action, setAction] = useState("");
  const [replacementProductId, setReplacementProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all return requests
  const getReturnRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchReturnRequests();
      console.log(data);
      setReturnRequests(data);
    } catch (error) {
      toast({
        title: "Failed to Fetch Return Requests",
        description: error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for exchange
  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Failed to Fetch Products",
        description: error.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getReturnRequests();
    getProducts();
  }, []);

  // Open dialog for approving/rejecting
  const handleAction = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setDialogMode("action");
    setIsDialogOpen(true);
    setReplacementProductId("");
  };

  // Open dialog for viewing details
  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setDialogMode("details");
    setIsDialogOpen(true);
  };

  // Submit action (approve/reject)
  const submitAction = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      const data = { action };
      if (action === "approve" && selectedRequest.request_type === "exchange") {
        if (!replacementProductId) {
          toast({
            title: "Invalid Selection",
            description: "Please select a replacement product.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        data.replacement_product_id = replacementProductId;
      }

      const response = await submitReturnAction(selectedRequest.id, data);

      toast({
        title: `Return Request ${action === "approve" ? "Approved" : "Rejected"}`,
        description: "The request has been processed successfully.",
      });
      setReturnRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? response : req
        )
      );
      setIsDialogOpen(false);
      setSelectedRequest(null);
      setDialogMode("");
    } catch (error) {
      toast({
        title: "Failed to Process Request",
        description:
          error.response?.data?.error || error.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format request type for display
  const formatRequestType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return timestamp
      ? new Date(timestamp).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";
  };

  // Filter requests
  const pendingRequests = returnRequests.filter((req) => req.status === "pending");
  const processedRequests = returnRequests.filter((req) => req.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-100 py-8 w-96 md:w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Pending Requests Section */}
        <Card className="bg-transparent shadow-md border-none mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Pending Return Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            {!loading && pendingRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pending requests found.
              </p>
            )}
            {!loading && pendingRequests.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingRequests.map((request) => (
                      <tr
                        key={request.id}
                        onClick={() => handleRowClick(request)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.order.order_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatRequestType(request.request_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatStatus(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.refund_amount
                            ? `${
                                currencySymbols[request.order.currency]
                              } ${parseFloat(request.refund_amount).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.reason}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
                        >
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="group h-8 gap-1 bg-transparent border-2 border-black hover:bg-indigo-500"
                              onClick={() => handleAction(request, "approve")}
                              disabled={loading}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600 group-hover:text-black" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="group h-8 gap-1 bg-transparent border-2 border-black hover:bg-red-500"
                              onClick={() => handleAction(request, "reject")}
                              disabled={loading}
                            >
                              <XCircle className="h-4 w-4 text-red-500 group-hover:text-black" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processed Requests Section */}
        <Card className="bg-transparent shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Processed Return Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
            {!loading && processedRequests.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No processed requests found.
              </p>
            )}
            {!loading && processedRequests.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processedRequests.map((request) => (
                      <tr
                        key={request.id}
                        onClick={() => handleRowClick(request)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.order.order_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatRequestType(request.request_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatStatus(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.refund_amount
                            ? `${
                                currencySymbols[request.order.currency]
                              } ${parseFloat(request.refund_amount).toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog for Approve/Reject or Details */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "details"
                  ? "Return Request Details"
                  : action === "approve" &&
                    selectedRequest?.request_type === "refund"
                  ? "Approve Refund Request"
                  : action === "approve"
                  ? "Approve Exchange Request"
                  : "Reject Return Request"}
              </DialogTitle>
            </DialogHeader>
            {selectedRequest && dialogMode === "details" && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-gray-700">Request ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.id}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Order ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.order.order_id}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Type</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatRequestType(selectedRequest.request_type)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatStatus(selectedRequest.status)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Refund Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.refund_amount
                      ? `${
                          currencySymbols[selectedRequest.order.currency]
                        } ${parseFloat(selectedRequest.refund_amount).toFixed(2)}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Reason</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.reason}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Requested At</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(selectedRequest.requested_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Approved At</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(selectedRequest.approved_at)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Completed At</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatTimestamp(selectedRequest.completed_at)}
                  </p>
                </div>
                {selectedRequest.request_type === "refund" && (
                  <div>
                    <Label className="text-gray-700">Refund Transaction ID</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.refund_transaction_id || "-"}
                    </p>
                  </div>
                )}
                {selectedRequest.request_type === "exchange" && (
                  <div>
                    <Label className="text-gray-700">Replacement Product</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.replacement_product
                        ? products.find(
                            (p) =>
                              p.id === selectedRequest.replacement_product
                          )?.title || "Unknown Product"
                        : "-"}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-700">Customer ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.customer}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-700">Items</Label>
                  {selectedRequest.items && selectedRequest.items.length > 0 ? (
                    selectedRequest.items.map((item, index) => (
                      <div key={item.id} className="ml-4 mt-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Item {index + 1}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Product ID: {item.order_item.product_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Condition: {item.condition}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Price: {currencySymbols[selectedRequest.order.currency]}
                          {parseFloat(item.order_item.price).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No items</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-700">Order Details</Label>
                  <div className="ml-4 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Order Date:{" "}
                      {formatTimestamp(selectedRequest.order.order_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment Status: {selectedRequest.order.payment_status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Currency: {selectedRequest.order.currency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount: {currencySymbols[selectedRequest.order.currency]}
                      {parseFloat(selectedRequest.order.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700">Shipping Address</Label>
                  <div className="ml-4 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Full Name:{" "}
                      {selectedRequest.order.shipping_address.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mobile: {selectedRequest.order.shipping_address.mobile_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Address:{" "}
                      {selectedRequest.order.shipping_address.address_line_1}
                      {selectedRequest.order.shipping_address.address_line_2
                        ? `, ${selectedRequest.order.shipping_address.address_line_2}`
                        : ""}
                      , {selectedRequest.order.shipping_address.city},{" "}
                      {selectedRequest.order.shipping_address.state},{" "}
                      {selectedRequest.order.shipping_address.postal_code},{" "}
                      {selectedRequest.order.shipping_address.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {selectedRequest && dialogMode === "action" && (
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-gray-700">
                    Request ID: {selectedRequest.id}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Type: {formatRequestType(selectedRequest.request_type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Reason: {selectedRequest.reason}
                  </p>
                  {action === "approve" &&
                    selectedRequest.request_type === "refund" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Confirming will process the refund via Razorpay to the
                        user's account.
                      </p>
                    )}
                </div>
                {action === "approve" &&
                  selectedRequest.request_type === "exchange" && (
                    <div>
                      <Label className="text-gray-700">
                        Select Replacement Product
                      </Label>
                      <Select
                        value={replacementProductId}
                        onValueChange={setReplacementProductId}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.title} (Stock: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>
            )}
            <DialogFooter>
              {dialogMode === "details" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedRequest(null);
                    setDialogMode("");
                  }}
                  disabled={loading}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedRequest(null);
                      setDialogMode("");
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitAction}
                    className={`${
                      action === "approve"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : action === "approve" &&
                        selectedRequest?.request_type === "refund"
                      ? "Confirm Refund"
                      : action === "approve"
                      ? "Confirm Approve"
                      : "Confirm Reject"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

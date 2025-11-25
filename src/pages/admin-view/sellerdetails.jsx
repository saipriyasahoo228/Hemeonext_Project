import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { listSellerApplications, updateSellerApplication } from "@/api/sellerApi";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from "@coreui/react";
import DataTable from "react-data-table-component";

const VendorReport = () => {
  const [vendorData, setVendorData] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all seller applications
        const response = await listSellerApplications();

        // Separate approved vendors and pending requests
        const approvedVendors = response.filter((vendor) => vendor.status === "approved");
        const pendingRequests = response.filter((vendor) => vendor.status === "pending");

        const formatData = (data) =>
          data.map((vendor) => ({
            requestId: vendor.request_id,
            vendorName: vendor.vendor_name,
            businessName: vendor.business_name,
            businessType: vendor.product_type,
            contactNumber: `${vendor.country_code} ${vendor.contact_number}`,
            email: vendor.email,
            address: vendor.business_address,
            country: vendor.country,
            status: vendor.status,
          }));

        setVendorData(formatData(approvedVendors));
        setVendorRequests(formatData(pendingRequests));
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptVendor = async (vendor) => {
    try {
      await updateSellerApplication(vendor.requestId, { status: "approved" });
      // Move vendor to approved list
      setVendorData([...vendorData, vendor]);
      setVendorRequests(vendorRequests.filter((v) => v.requestId !== vendor.requestId));
    } catch (error) {
      console.error("Failed to accept vendor:", error);
      alert("Something went wrong while approving this vendor.");
    }
  };

  const handleDeclineClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }

    try {
      await updateSellerApplication(selectedVendor.requestId, {
        status: "rejected",
        message: declineReason,
      });
      setVendorRequests(vendorRequests.filter((v) => v.requestId !== selectedVendor.requestId));
      setShowModal(false);
      setDeclineReason("");
    } catch (error) {
      console.error("Failed to decline vendor:", error);
      alert("Something went wrong while declining this vendor.");
    }
  };

  const filteredData = vendorData.filter((vendor) =>
    Object.values(vendor).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vendorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "Vendor_Contact_Report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Contact Report", 14, 15);
    const tableColumn = [
      "Request ID",
      "Vendor Name",
      "Company Name",
      "Business Type",
      "Contact Number",
      "Email",
      "Address",
      "Country",
    ];
    const tableRows = vendorData.map((vendor) => [
      vendor.requestId,
      vendor.vendorName,
      vendor.businessName,
      vendor.businessType,
      vendor.contactNumber,
      vendor.email,
      vendor.address,
      vendor.country,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [40, 40, 40] },
    });
    doc.save("Vendor_Contact_Report.pdf");
  };

  const columns = [
    { name: "Request ID", selector: (row) => row.requestId, sortable: true },
    { name: "Vendor Name", selector: (row) => row.vendorName, sortable: true },
    { name: "Company Name", selector: (row) => row.businessName, sortable: true },
    { name: "Business Type", selector: (row) => row.businessType, sortable: true },
    { name: "Contact Number", selector: (row) => row.contactNumber },
    { name: "Email", selector: (row) => row.email },
    { name: "Address", selector: (row) => row.address },
    { name: "Country", selector: (row) => row.country },
  ];

  return (
    <CContainer>
      <CRow >
        <CCol>
          <CCard>
            <CCardHeader>VENDOR REQUESTS</CCardHeader>
            <CCardBody className="md:w-full w-1/3">
              {loading ? (
                <p>Loading vendor requests...</p>
              ) : vendorRequests.length === 0 ? (
                <p style={{ color: "red" }}>No new vendor requests.</p>
              ) : (
                vendorRequests.map((vendor) => (
                  <div
                    key={vendor.requestId}
                    className="d-flex flex-column mb-2 p-2 border rounded"
                    style={{
                      border: "2px solid gold",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="mb-2">
                      <p className="m-0"><strong>Request ID:</strong> {vendor.requestId}</p>
                      <p className="m-0"><strong>Vendor Name:</strong> {vendor.vendorName}</p>
                      <p className="m-0"><strong>Business Name:</strong> {vendor.businessName}</p>
                      <p className="m-0"><strong>Business Type:</strong> {vendor.businessType}</p>
                      <p className="m-0"><strong>Contact:</strong> {vendor.contactNumber}</p>
                      <p className="m-0"><strong>Email:</strong> {vendor.email}</p>
                      <p className="m-0"><strong>Address:</strong> {vendor.address}</p>
                      <p className="m-0"><strong>Country:</strong> {vendor.country}</p>
                    </div>
                    <div className="d-flex justify-content-end">
                      <CButton
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          borderRadius: "12px",
                          padding: "4px 10px",
                          fontSize: "12px",
                        }}
                        onClick={() => acceptVendor(vendor)}
                      >
                        ✔ Accept
                      </CButton>
                      <CButton
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          borderRadius: "12px",
                          padding: "4px 10px",
                          fontSize: "12px",
                        }}
                        className="ms-2"
                        onClick={() => handleDeclineClick(vendor)}
                      >
                        ✖ Decline
                      </CButton>
                    </div>
                  </div>
                ))
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>VENDOR LIST</CCardHeader>
            <CCardBody  className="md:w-full w-[35%]">
              <div className="flex gap-2 mb-3">
                <CButton color="primary" onClick={downloadExcel}>
                  📊 Download Excel
                </CButton>
                <CButton color="danger" onClick={downloadPDF}>
                  📄 Download PDF
                </CButton>
              </div>
              <CFormInput
                style={{
                  border: "2px solid gold",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
                type="text"
                placeholder="🔍 Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                striped
                responsive
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Decline Reason Modal */}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        backdrop="static"
        className="custom-modal"
      >
        <CModalHeader className="modal-header-custom">
          <span className="decline-text">Decline Vendor</span>
          <span className="close-button" onClick={() => setShowModal(false)}>
            ❌
          </span>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows="3"
            placeholder="Enter reason for decline..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="textarea-style"
          />
        </CModalBody>
        <CModalFooter className="modal-footer">
          <CButton className="submit-button" onClick={handleDeclineSubmit}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Custom CSS for Modal */}
      <style>
        {`
          .custom-modal .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -10%);
            width: 400px;
            background: white;
            padding: 15px;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          .custom-modal .modal-body {
            padding: 20px;
          }
          .textarea-style {
            border-radius: 8px;
            width: 100%;
            padding: 10px;
            resize: none;
            border: 2px solid #E6C692;
            background: transparent;
            color: var(--foreground);
            font-family: "Rubik", sans-serif;
          }
          .modal-header-custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
          }
          .decline-text {
            color: black;
            font-family: "Titillium Web", sans-serif;
          }
          .custom-modal .modal-footer {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .close-button {
            cursor: pointer;
            font-size: 20px;
            color: #dc3545;
            margin-left: auto;
          }
          .close-button:hover {
            color: red;
          }
          .submit-button {
            background-color: #E6C692 !important;
            color: black !important;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
          }
          .submit-button:hover {
            background-color: rgb(227, 145, 21) !important;
          }
        `}
      </style>
    </CContainer>
  );
};

export default VendorReport;
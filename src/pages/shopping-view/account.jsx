// import { useState, useEffect } from "react";
// import { Bell, CreditCard, Edit, LogOut, MapPin, Package, Settings, User, Loader2 } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
// import { Separator } from "../../components/ui/separator";
// import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
// import { useToast } from "../../components/ui/use-toast";
// import OrdersComponent from "../../components/shopping-view/orders-component";
// import AddressComponent from "../../components/shopping-view/address-component";
// import { getProfile, updateProfile, verifyEmailOtp, verifySmsOtp, verifyTemporaryUpdate, resendOtp, deleteAccount, changePassword } from "../../api/authApi";
// import { listAddresses, updateAddress, listOrders } from "../../api/userApi";
// import { useAuth } from "../../context/auth-context";

// export default function AccountPage() {
//   const { isAuthenticated, user: authUser, logout, loading: authLoading } = useAuth();
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState(() => {
//     const params = new URLSearchParams(window.location.search);
//     return params.get("tab") || "profile";
//   });
//   const [user, setUser] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [orderCount, setOrderCount] = useState(0);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editForm, setEditForm] = useState({ name: "", email: "", mobile_number: "" });
//   const [loading, setLoading] = useState(true);
//   const [editLoading, setEditLoading] = useState(false); // Loader for profile edit
//   const [emailOtpLoading, setEmailOtpLoading] = useState(false); // Loader for sending email OTP
//   const [mobileOtpLoading, setMobileOtpLoading] = useState(false); // Loader for sending mobile OTP
//   const [emailVerifyLoading, setEmailVerifyLoading] = useState(false); // Loader for email verification
//   const [mobileVerifyLoading, setMobileVerifyLoading] = useState(false); // Loader for mobile verification
//   const [error, setError] = useState(null);
//   const [editEmail, setEditEmail] = useState({ isEditing: false, newEmail: "", otp: "", message: "", canResend: false });
//   const [editMobile, setEditMobile] = useState({ isEditing: false, newMobile: "", otp: "", message: "", canResend: false });
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleteConfirm, setDeleteConfirm] = useState(false);
//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordLoading, setPasswordLoading] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!isAuthenticated || !authUser) {
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const profileData = await getProfile();
//         setUser(profileData.user);
//         setEditForm({
//           name: profileData.user.name,
//           email: profileData.user.email,
//           mobile_number: profileData.user.mobile_number,
//         });
//         const addressData = await listAddresses(authUser.customer_id);
//         setAddresses(addressData);
//         const ordersData = await listOrders(authUser.customer_id);
//         const paidOrRefundedOrders = ordersData.filter(order => 
//           order.payment_status === "paid" || order.payment_status === "refunded"
//         );
//         setOrderCount(paidOrRefundedOrders.length);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         toast({ 
//           title: err.message || "Failed to load user data", 
//           variant: "destructive" 
//         });
//         if (err.error === "Token refresh failed") {
//           logout();
//           window.location.href = "/auth/login";
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) {
//       fetchUserData();
//     }

//     const params = new URLSearchParams(window.location.search);
//     const tab = params.get("tab");
//     if (tab && tab !== activeTab) {
//       setActiveTab(tab);
//     }
//   }, [isAuthenticated, authUser, authLoading, logout, toast]);

//   useEffect(() => {
//     let emailTimer, mobileTimer;
//     if (editEmail.message && !editEmail.canResend) {
//       emailTimer = setTimeout(() => setEditEmail((prev) => ({ ...prev, canResend: true })), 120000);
//     }
//     if (editMobile.message && !editMobile.canResend) {
//       mobileTimer = setTimeout(() => setEditMobile((prev) => ({ ...prev, canResend: true })), 120000);
//     }
//     return () => {
//       clearTimeout(emailTimer);
//       clearTimeout(mobileTimer);
//     };
//   }, [editEmail.message, editMobile.message]);

//   if (authLoading || loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated || !authUser) {
//     window.location.href = "/auth/login";
//     return null;
//   }

//   if (!user) {
//     return <div>No user data available</div>;
//   }

//   const defaultAddress = addresses.find((addr) => addr.is_default);

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setEditLoading(true); // Start loader
//     try {
//       const updatedProfile = await updateProfile({ name: editForm.name });
//       setUser(updatedProfile.user);
//       setIsEditDialogOpen(false);
//       setError(null);
//       toast({ title: "Profile updated successfully" });
//     } catch (error) {
//       setError(error.error || "Failed to update profile");
//       toast({ title: error.error || "Failed to update profile", variant: "destructive" });
//     } finally {
//       setEditLoading(false); // Stop loader
//     }
//   };

//   const handleDefaultAddressChange = async (addressId) => {
//     try {
//       const addressToUpdate = addresses.find((addr) => addr.id === addressId);
//       const updatedData = { ...addressToUpdate, is_default: true };
//       await updateAddress(authUser.customer_id, addressId, updatedData);
//       const updatedAddresses = await listAddresses(authUser.customer_id);
//       setAddresses(updatedAddresses);
//       toast({ title: "Default address updated successfully" });
//     } catch (error) {
//       setError(error.error || "Failed to update default address");
//       toast({ title: error.error || "Failed to update default address", variant: "destructive" });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     window.location.href = "/auth/login";
//   };

//   const updateAddresses = (newAddresses) => {
//     setAddresses(newAddresses);
//   };

//   const handleEmailEdit = async () => {
//     if (!editEmail.newEmail) return;
//     setEmailOtpLoading(true); // Start loader
//     try {
//       const response = await updateProfile({ email: editEmail.newEmail });
//       setEditEmail((prev) => ({
//         ...prev,
//         message: "OTP sent to your new email. Please verify.",
//         isEditing: true,
//         canResend: false,
//       }));
//       toast({ title: "OTP sent to your new email" });
//     } catch (error) {
//       setError(error.error || "Failed to send OTP");
//       toast({ title: error.error || "Failed to send OTP", variant: "destructive" });
//     } finally {
//       setEmailOtpLoading(false); // Stop loader
//     }
//   };

//   const handleMobileEdit = async () => {
//     if (!editMobile.newMobile) return;
//     setMobileOtpLoading(true); // Start loader
//     try {
//       const response = await updateProfile({ mobile_number: editMobile.newMobile });
//       setEditMobile((prev) => ({
//         ...prev,
//         message: "OTP sent to your new mobile. Please verify.",
//         isEditing: true,
//         canResend: false,
//       }));
//       toast({ title: "OTP sent to your new mobile" });
//     } catch (error) {
//       setError(error.error || "Failed to send OTP");
//       toast({ title: error.error || "Failed to send OTP", variant: "destructive" });
//     } finally {
//       setMobileOtpLoading(false); // Stop loader
//     }
//   };

//   const handleEmailVerify = async () => {
//     setEmailVerifyLoading(true); // Start loader
//     try {
//       await verifyTemporaryUpdate('email', editEmail.otp);
//       const updatedProfile = await getProfile();
//       setUser(updatedProfile.user);
//       setEditForm((prev) => ({ ...prev, email: updatedProfile.user.email }));
//       setEditEmail({
//         isEditing: false,
//         newEmail: "",
//         otp: "",
//         message: "Email verified successfully!",
//         canResend: false,
//       });
//       toast({ title: "Email verified successfully" });
//       setTimeout(() => setEditEmail((prev) => ({ ...prev, message: "" })), 3000);
//     } catch (error) {
//       setError(error.error || "Failed to verify OTP");
//       toast({ title: error.error || "Failed to verify OTP", variant: "destructive" });
//     } finally {
//       setEmailVerifyLoading(false); // Stop loader
//     }
//   };

//   const handleMobileVerify = async () => {
//     setMobileVerifyLoading(true); // Start loader
//     try {
//       await verifyTemporaryUpdate('mobile_number', editMobile.otp);
//       const updatedProfile = await getProfile();
//       setUser(updatedProfile.user);
//       setEditForm((prev) => ({ ...prev, mobile_number: updatedProfile.user.mobile_number }));
//       setEditMobile({
//         isEditing: false,
//         newMobile: "",
//         otp: "",
//         message: "Mobile verified successfully!",
//         canResend: false,
//       });
//       toast({ title: "Mobile verified successfully" });
//       setTimeout(() => setEditMobile((prev) => ({ ...prev, message: "" })), 3000);
//     } catch (error) {
//       setError(error.error || "Failed to verify OTP");
//       toast({ title: error.error || "Failed to verify OTP", variant: "destructive" });
//     } finally {
//       setMobileVerifyLoading(false); // Stop loader
//     }
//   };

//   const handleResendEmailOTP = async () => {
//     try {
//       await resendOtp({ email: editEmail.newEmail });
//       setEditEmail((prev) => ({ ...prev, message: "OTP resent to your email.", canResend: false }));
//       toast({ title: "OTP resent to your email" });
//     } catch (error) {
//       setError(error.error || "Failed to resend OTP");
//       toast({ title: error.error || "Failed to resend OTP", variant: "destructive" });
//     }
//   };

//   const handleResendMobileOTP = async () => {
//     try {
//       await resendOtp({ mobile_number: editMobile.newMobile });
//       setEditMobile((prev) => ({ ...prev, message: "OTP resent to your mobile.", canResend: false }));
//       toast({ title: "OTP resent to your mobile" });
//     } catch (error) {
//       setError(error.error || "Failed to resend OTP");
//       toast({ title: error.error || "Failed to resend OTP", variant: "destructive" });
//     }
//   };

//   const handleDeleteAccount = async () => {
//     try {
//       await deleteAccount(deletePassword);
//       logout();
//       window.location.href = "/auth/login";
//       toast({ title: "Account deleted successfully" });
//     } catch (error) {
//       setError(error.error || "Failed to delete account");
//       toast({ title: error.error || "Failed to delete account", variant: "destructive" });
//     }
//   };

//   const handleChangePassword = async (e) => {
//     e.preventDefault();
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       toast({ title: "New passwords do not match", variant: "destructive" });
//       return;
//     }
//     setPasswordLoading(true);
//     try {
//       await changePassword({
//         current_password: passwordForm.currentPassword,
//         new_password: passwordForm.newPassword,
//       });
//       setIsPasswordDialogOpen(false);
//       setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//       setError(null);
//       toast({ title: "Password changed successfully" });
//     } catch (error) {
//       setError(error.error || "Failed to change password");
//       toast({ title: error.error || "Failed to change password", variant: "destructive" });
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   function formatDate(isoDate) {
//     const date = new Date(isoDate);
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
//   }

//   return (
//     <div className="flex min-h-screen w-full flex-col bg-muted/30">
//       <div className="relative h-[190px] w-full overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
//         <div className="absolute bottom-8 left-8 flex items-center gap-4 md:left-16">
//           <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
//             <AvatarImage src="/placeholder.svg" alt={user.name} />
//             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//           </Avatar>
//           <div className="text-black">
//             <h1 className="text-2xl font-extrabold">{user.name}</h1>
//             <p className="text-sm opacity-90">Member since {formatDate(user.registered_at)}</p>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto max-w-6xl px-4 py-8">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
//           <div className="hidden lg:block">
//             <Card className="bg-transparent shadow-md border-none">
//               <CardContent className="p-4">
//                 <nav className="flex flex-col gap-2">
//                   <Button
//                     variant={activeTab === "profile" ? "default" : "ghost"}
//                     className="justify-start gap-2"
//                     onClick={() => setActiveTab("profile")}
//                   >
//                     <User className="h-4 w-4" />
//                     Profile
//                   </Button>
//                   <Button
//                     variant={activeTab === "orders" ? "default" : "ghost"}
//                     className="justify-start gap-2"
//                     onClick={() => setActiveTab("orders")}
//                   >
//                     <Package className="h-4 w-4" />
//                     Orders
//                     <Badge className="ml-auto">{orderCount}</Badge>
//                   </Button>
//                   <Button
//                     variant={activeTab === "address" ? "default" : "ghost"}
//                     className="justify-start gap-2"
//                     onClick={() => setActiveTab("address")}
//                   >
//                     <MapPin className="h-4 w-4" />
//                     Addresses
//                   </Button>
//                   <Separator className="my-2" />
//                   <Button variant="ghost" className="justify-start gap-2 text-destructive" onClick={handleLogout}>
//                     <LogOut className="h-4 w-4" />
//                     Logout
//                   </Button>
//                 </nav>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:hidden">
//             <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="profile">Profile</TabsTrigger>
//                 <TabsTrigger value="orders">Orders ({orderCount})</TabsTrigger>
//                 <TabsTrigger value="address">Address</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>

//           <div className="space-y-6">
//             {activeTab === "profile" && (
//               <Card className="bg-transparent shadow-md border-none">
//                 <CardHeader>
//                   <CardTitle>Profile Information</CardTitle>
//                   <CardDescription>Manage your personal information and preferences</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="grid gap-6 md:grid-cols-2">
//                     <div>
//                       <h3 className="mb-2 text-sm font-medium text-muted-foreground">Personal Details</h3>
//                       <Card className="bg-background">
//                         <CardContent className="p-4">
//                           <dl className="space-y-4">
//                             <div className="flex justify-between">
//                               <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
//                               <dd className="text-sm">{user.name}</dd>
//                             </div>
//                             <div className="flex justify-between">
//                               <dt className="text-sm font-medium text-muted-foreground">Email</dt>
//                               <dd className="text-sm">{user.email}</dd>
//                             </div>
//                             <div className="flex justify-between">
//                               <dt className="text-sm font-medium text-muted-foreground">Mobile Number</dt>
//                               <dd className="text-sm">{user.mobile_number}</dd>
//                             </div>
//                           </dl>
//                           <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="mt-4 w-full">
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Edit Details
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>Edit Profile</DialogTitle>
//                                 <DialogDescription>Update your personal information below.</DialogDescription>
//                               </DialogHeader>
//                               <form onSubmit={handleEditSubmit} className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="name">Full Name</Label>
//                                   <Input
//                                     id="name"
//                                     value={editForm.name}
//                                     onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                                     required
//                                   />
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor="email">Email</Label>
//                                   <div className="flex items-center gap-2">
//                                     <Input id="email" type="email" value={editForm.email} disabled />
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => setEditEmail((prev) => ({ ...prev, isEditing: true }))}
//                                     >
//                                       Edit
//                                     </Button>
//                                   </div>
//                                   {editEmail.isEditing && (
//                                     <>
//                                       <Input
//                                         placeholder="New Email"
//                                         value={editEmail.newEmail}
//                                         onChange={(e) => setEditEmail((prev) => ({ ...prev, newEmail: e.target.value }))}
//                                       />
//                                       <Button
//                                         type="button"
//                                         onClick={handleEmailEdit}
//                                         disabled={emailOtpLoading}
//                                       >
//                                         {emailOtpLoading ? (
//                                           <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                             Sending...
//                                           </>
//                                         ) : (
//                                           "Send OTP"
//                                         )}
//                                       </Button>
//                                       {editEmail.message && (
//                                         <p className="text-sm text-green-500">{editEmail.message}</p>
//                                       )}
//                                       {editEmail.message && (
//                                         <>
//                                           <Input
//                                             placeholder="Enter OTP"
//                                             value={editEmail.otp}
//                                             onChange={(e) => setEditEmail((prev) => ({ ...prev, otp: e.target.value }))}
//                                           />
//                                           <Button
//                                             type="button"
//                                             onClick={handleEmailVerify}
//                                             disabled={emailVerifyLoading}
//                                           >
//                                             {emailVerifyLoading ? (
//                                               <>
//                                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                                 Verifying...
//                                               </>
//                                             ) : (
//                                               "Verify OTP"
//                                             )}
//                                           </Button>
//                                           {editEmail.canResend && (
//                                             <Button type="button" variant="link" onClick={handleResendEmailOTP}>
//                                               Resend OTP
//                                             </Button>
//                                           )}
//                                         </>
//                                       )}
//                                     </>
//                                   )}
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor="mobile_number">Mobile Number</Label>
//                                   <div className="flex items-center gap-2">
//                                     <Input id="mobile_number" value={editForm.mobile_number} disabled />
//                                     <Button
//                                       type="button"
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => setEditMobile((prev) => ({ ...prev, isEditing: true }))}
//                                     >
//                                       Edit
//                                     </Button>
//                                   </div>
//                                   {editMobile.isEditing && (
//                                     <>
//                                       <Input
//                                         placeholder="New Mobile Number"
//                                         value={editMobile.newMobile}
//                                         onChange={(e) => setEditMobile((prev) => ({ ...prev, newMobile: e.target.value }))}
//                                       />
//                                       <Button
//                                         type="button"
//                                         onClick={handleMobileEdit}
//                                         disabled={mobileOtpLoading}
//                                       >
//                                         {mobileOtpLoading ? (
//                                           <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                             Sending...
//                                           </>
//                                         ) : (
//                                           "Send OTP"
//                                         )}
//                                       </Button>
//                                       {editMobile.message && (
//                                         <p className="text-sm text-green-500">{editMobile.message}</p>
//                                       )}
//                                       {editMobile.message && (
//                                         <>
//                                           <Input
//                                             placeholder="Enter OTP"
//                                             value={editMobile.otp}
//                                             onChange={(e) => setEditMobile((prev) => ({ ...prev, otp: e.target.value }))}
//                                           />
//                                           <Button
//                                             type="button"
//                                             onClick={handleMobileVerify}
//                                             disabled={mobileVerifyLoading}
//                                           >
//                                             {mobileVerifyLoading ? (
//                                               <>
//                                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                                 Verifying...
//                                               </>
//                                             ) : (
//                                               "Verify OTP"
//                                             )}
//                                           </Button>
//                                           {editMobile.canResend && (
//                                             <Button type="button" variant="link" onClick={handleResendMobileOTP}>
//                                               Resend OTP
//                                             </Button>
//                                           )}
//                                         </>
//                                       )}
//                                     </>
//                                   )}
//                                 </div>
//                                 <Button type="submit" className="w-full" disabled={editLoading}>
//                                   {editLoading ? (
//                                     <>
//                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                       Saving...
//                                     </>
//                                   ) : (
//                                     "Save Name"
//                                   )}
//                                 </Button>
//                               </form>
//                             </DialogContent>
//                           </Dialog>
//                           <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
//                             <DialogTrigger asChild>
//                               <Button variant="outline" size="sm" className="mt-4 w-full">
//                                 <Settings className="mr-2 h-4 w-4" />
//                                 Change Password
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle>Change Password</DialogTitle>
//                                 <DialogDescription>Update your account password.</DialogDescription>
//                               </DialogHeader>
//                               <form onSubmit={handleChangePassword} className="space-y-4">
//                                 <div className="space-y-2">
//                                   <Label htmlFor="current-password">Current Password</Label>
//                                   <Input
//                                     id="current-password"
//                                     type="password"
//                                     value={passwordForm.currentPassword}
//                                     onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                                     required
//                                   />
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor="new-password">New Password</Label>
//                                   <Input
//                                     id="new-password"
//                                     type="password"
//                                     value={passwordForm.newPassword}
//                                     onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                                     required
//                                   />
//                                 </div>
//                                 <div className="space-y-2">
//                                   <Label htmlFor="confirm-password">Confirm New Password</Label>
//                                   <Input
//                                     id="confirm-password"
//                                     type="password"
//                                     value={passwordForm.confirmPassword}
//                                     onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                                     required
//                                   />
//                                 </div>
//                                 <Button type="submit" disabled={passwordLoading} className="w-full">
//                                   {passwordLoading ? (
//                                     <>
//                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                       Updating...
//                                     </>
//                                   ) : (
//                                     "Update Password"
//                                   )}
//                                 </Button>
//                               </form>
//                             </DialogContent>
//                           </Dialog>
//                         </CardContent>
//                       </Card>
//                     </div>
//                     <div>
//                       <h3 className="mb-2 text-sm font-medium text-muted-foreground">Default Address</h3>
//                       <Card className="bg-background">
//                         <CardContent className="p-4">
//                           {defaultAddress ? (
//                             <p className="text-sm">
//                               {defaultAddress.address_line_1}, {defaultAddress.address_line_2 && `${defaultAddress.address_line_2}, `}
//                               {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.area_zip_code}, {defaultAddress.country}
//                             </p>
//                           ) : (
//                             <p className="text-sm text-muted-foreground">No default address set</p>
//                           )}
//                           <Select onValueChange={handleDefaultAddressChange} defaultValue={defaultAddress?.id}>
//                             <SelectTrigger className="mt-4 w-full">
//                               <SelectValue placeholder="Choose default address" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {addresses.map((addr) => (
//                                 <SelectItem key={addr.id} value={addr.id}>
//                                   {addr.address_line_1}, {addr.city} ({addr.address_type})
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </div>
//                   <Separator className="my-4" />
//                   <div>
//                     <h3 className="mb-2 text-sm font-medium text-destructive">Danger Zone</h3>
//                     <Card className="border-destructive bg-red-50">
//                       <CardContent className="p-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-destructive">Delete Account</p>
//                             <p className="text-sm text-muted-foreground">
//                               Permanently remove your account and all associated data.
//                             </p>
//                           </div>
//                           <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//                             <DialogTrigger asChild>
//                               <Button variant="destructive" size="sm">Delete Account</Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-[425px]">
//                               <DialogHeader>
//                                 <DialogTitle className="text-destructive">Delete Your Account</DialogTitle>
//                                 <DialogDescription>
//                                   This action is irreversible. Please review the consequences:
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="space-y-4">
//                                 <ul className="list-disc pl-5 text-sm text-muted-foreground">
//                                   <li>All your orders, addresses, and profile data will be deleted.</li>
//                                   <li>You will lose access to your account permanently.</li>
//                                   <li>No refunds will be processed for past purchases.</li>
//                                 </ul>
//                                 <div className="space-y-2">
//                                   <Label htmlFor="delete-password">Enter your password to proceed</Label>
//                                   <Input
//                                     id="delete-password"
//                                     type="password"
//                                     value={deletePassword}
//                                     onChange={(e) => setDeletePassword(e.target.value)}
//                                     placeholder="Password"
//                                   />
//                                 </div>
//                                 {deletePassword && (
//                                   <div className="flex items-center space-x-2">
//                                     <input
//                                       type="checkbox"
//                                       id="confirm-delete"
//                                       checked={deleteConfirm}
//                                       onChange={(e) => setDeleteConfirm(e.target.checked)}
//                                     />
//                                     <Label htmlFor="confirm-delete">I understand the consequences</Label>
//                                   </div>
//                                 )}
//                                 {error && <p className="text-sm text-destructive">{error}</p>}
//                               </div>
//                               <Button
//                                 variant="destructive"
//                                 disabled={!deletePassword || !deleteConfirm}
//                                 onClick={handleDeleteAccount}
//                               >
//                                 Confirm Deletion
//                               </Button>
//                             </DialogContent>
//                           </Dialog>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "orders" && <OrdersComponent userId={authUser.customer_id} />}
//             {activeTab === "address" && (
//               <AddressComponent
//                 userId={authUser.customer_id}
//                 addresses={addresses}
//                 setAddresses={updateAddresses}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








import { useState, useEffect } from "react";
import { Bell, CreditCard, Edit, LogOut, MapPin, Package, Settings, User, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import OrdersComponent from "../../components/shopping-view/orders-component";
import AddressComponent from "../../components/shopping-view/address-component";
import { getProfile, updateProfile, verifyEmailOtp, verifySmsOtp, verifyTemporaryUpdate, resendOtp, deleteAccount, changePassword } from "../../api/authApi";
import { listAddresses, updateAddress, listOrders } from "../../api/userApi";
import { useAuth } from "../../context/auth-context";

export default function AccountPage() {
  const { isAuthenticated, user: authUser, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "profile";
  });
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", mobile_number: "" });
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [mobileVerifyLoading, setMobileVerifyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editEmail, setEditEmail] = useState({ isEditing: false, newEmail: "", otp: "", message: "", canResend: false });
  const [editMobile, setEditMobile] = useState({ isEditing: false, newMobile: "", otp: "", message: "", canResend: false });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !authUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profileData = await getProfile();
        setUser(profileData.user);
        setEditForm({
          name: profileData.user.name,
          email: profileData.user.email,
          mobile_number: profileData.user.mobile_number,
        });
        const addressData = await listAddresses(authUser.customer_id);
        setAddresses(addressData);
        const ordersData = await listOrders(authUser.customer_id);
        const paidOrRefundedOrders = ordersData.filter(order => 
          order.payment_status === "paid" || order.payment_status === "refunded"
        );
        setOrderCount(paidOrRefundedOrders.length);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast({ 
          title: err.message || "Failed to load user data", 
          variant: "destructive" 
        });
        if (err.error === "Token refresh failed") {
          logout();
          window.location.href = "/auth/login";
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserData();
    }

    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [isAuthenticated, authUser, authLoading, logout, toast]);

  useEffect(() => {
    let emailTimer, mobileTimer;
    if (editEmail.message && !editEmail.canResend) {
      emailTimer = setTimeout(() => setEditEmail((prev) => ({ ...prev, canResend: true })), 120000);
    }
    if (editMobile.message && !editMobile.canResend) {
      mobileTimer = setTimeout(() => setEditMobile((prev) => ({ ...prev, canResend: true })), 120000);
    }
    return () => {
      clearTimeout(emailTimer);
      clearTimeout(mobileTimer);
    };
  }, [editEmail.message, editMobile.message]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-green-700 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    window.location.href = "/auth/login";
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-800 text-lg">No user data available</p>
      </div>
    );
  }

  const defaultAddress = addresses.find((addr) => addr.is_default);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updatedProfile = await updateProfile({ name: editForm.name });
      setUser(updatedProfile.user);
      setIsEditDialogOpen(false);
      setError(null);
      toast({ 
        title: "Profile updated successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to update profile");
      toast({ 
        title: error.error || "Failed to update profile", 
        variant: "destructive" 
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDefaultAddressChange = async (addressId) => {
    try {
      const addressToUpdate = addresses.find((addr) => addr.id === addressId);
      const updatedData = { ...addressToUpdate, is_default: true };
      await updateAddress(authUser.customer_id, addressId, updatedData);
      const updatedAddresses = await listAddresses(authUser.customer_id);
      setAddresses(updatedAddresses);
      toast({ 
        title: "Default address updated successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to update default address");
      toast({ 
        title: error.error || "Failed to update default address", 
        variant: "destructive" 
      });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const updateAddresses = (newAddresses) => {
    setAddresses(newAddresses);
  };

  const handleEmailEdit = async () => {
    if (!editEmail.newEmail) return;
    setEmailOtpLoading(true);
    try {
      const response = await updateProfile({ email: editEmail.newEmail });
      setEditEmail((prev) => ({
        ...prev,
        message: "OTP sent to your new email. Please verify.",
        isEditing: true,
        canResend: false,
      }));
      toast({ 
        title: "OTP sent to your new email",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to send OTP");
      toast({ 
        title: error.error || "Failed to send OTP", 
        variant: "destructive" 
      });
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleMobileEdit = async () => {
    if (!editMobile.newMobile) return;
    setMobileOtpLoading(true);
    try {
      const response = await updateProfile({ mobile_number: editMobile.newMobile });
      setEditMobile((prev) => ({
        ...prev,
        message: "OTP sent to your new mobile. Please verify.",
        isEditing: true,
        canResend: false,
      }));
      toast({ 
        title: "OTP sent to your new mobile",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to send OTP");
      toast({ 
        title: error.error || "Failed to send OTP", 
        variant: "destructive" 
      });
    } finally {
      setMobileOtpLoading(false);
    }
  };

  const handleEmailVerify = async () => {
    setEmailVerifyLoading(true);
    try {
      await verifyTemporaryUpdate('email', editEmail.otp);
      const updatedProfile = await getProfile();
      setUser(updatedProfile.user);
      setEditForm((prev) => ({ ...prev, email: updatedProfile.user.email }));
      setEditEmail({
        isEditing: false,
        newEmail: "",
        otp: "",
        message: "Email verified successfully!",
        canResend: false,
      });
      toast({ 
        title: "Email verified successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
      setTimeout(() => setEditEmail((prev) => ({ ...prev, message: "" })), 3000);
    } catch (error) {
      setError(error.error || "Failed to verify OTP");
      toast({ 
        title: error.error || "Failed to verify OTP", 
        variant: "destructive" 
      });
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  const handleMobileVerify = async () => {
    setMobileVerifyLoading(true);
    try {
      await verifyTemporaryUpdate('mobile_number', editMobile.otp);
      const updatedProfile = await getProfile();
      setUser(updatedProfile.user);
      setEditForm((prev) => ({ ...prev, mobile_number: updatedProfile.user.mobile_number }));
      setEditMobile({
        isEditing: false,
        newMobile: "",
        otp: "",
        message: "Mobile verified successfully!",
        canResend: false,
      });
      toast({ 
        title: "Mobile verified successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
      setTimeout(() => setEditMobile((prev) => ({ ...prev, message: "" })), 3000);
    } catch (error) {
      setError(error.error || "Failed to verify OTP");
      toast({ 
        title: error.error || "Failed to verify OTP", 
        variant: "destructive" 
      });
    } finally {
      setMobileVerifyLoading(false);
    }
  };

  const handleResendEmailOTP = async () => {
    try {
      await resendOtp({ email: editEmail.newEmail });
      setEditEmail((prev) => ({ ...prev, message: "OTP resent to your email.", canResend: false }));
      toast({ 
        title: "OTP resent to your email",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to resend OTP");
      toast({ 
        title: error.error || "Failed to resend OTP", 
        variant: "destructive" 
      });
    }
  };

  const handleResendMobileOTP = async () => {
    try {
      await resendOtp({ mobile_number: editMobile.newMobile });
      setEditMobile((prev) => ({ ...prev, message: "OTP resent to your mobile.", canResend: false }));
      toast({ 
        title: "OTP resent to your mobile",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to resend OTP");
      toast({ 
        title: error.error || "Failed to resend OTP", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(deletePassword);
      logout();
      window.location.href = "/auth/login";
      toast({ 
        title: "Account deleted successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to delete account");
      toast({ 
        title: error.error || "Failed to delete account", 
        variant: "destructive" 
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ 
        title: "New passwords do not match", 
        variant: "destructive" 
      });
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      setIsPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setError(null);
      toast({ 
        title: "Password changed successfully",
        className: "bg-green-100 text-green-800 border-green-200"
      });
    } catch (error) {
      setError(error.error || "Failed to change password");
      toast({ 
        title: error.error || "Failed to change password", 
        variant: "destructive" 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-green-50">
      {/* Header Section */}
      <div className="relative h-[190px] w-full overflow-hidden bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 flex items-center gap-4 md:left-16">
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback className="bg-green-500 text-white text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-white">
            <h1 className="text-2xl font-extrabold">{user.name}</h1>
            <p className="text-sm opacity-90">Member since {formatDate(user.registered_at)}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block">
            <Card className="bg-white shadow-lg border-green-200">
              <CardContent className="p-4">
                <nav className="flex flex-col gap-2">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className={`justify-start gap-2 ${
                      activeTab === "profile" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "text-green-800 hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className={`justify-start gap-2 ${
                      activeTab === "orders" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "text-green-800 hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="h-4 w-4" />
                    Orders
                    <Badge className="ml-auto bg-orange-500 text-white">{orderCount}</Badge>
                  </Button>
                  <Button
                    variant={activeTab === "address" ? "default" : "ghost"}
                    className={`justify-start gap-2 ${
                      activeTab === "address" 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "text-green-800 hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("address")}
                  >
                    <MapPin className="h-4 w-4" />
                    Addresses
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-2 text-orange-600 hover:bg-orange-50 hover:text-orange-700" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-green-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="profile" 
                  className={`rounded-lg ${
                    activeTab === "profile" 
                      ? "bg-green-600 text-white" 
                      : "text-green-800"
                  }`}
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className={`rounded-lg ${
                    activeTab === "orders" 
                      ? "bg-green-600 text-white" 
                      : "text-green-800"
                  }`}
                >
                  Orders ({orderCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className={`rounded-lg ${
                    activeTab === "address" 
                      ? "bg-green-600 text-white" 
                      : "text-green-800"
                  }`}
                >
                  Address
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <Card className="bg-white shadow-lg border-green-200">
                <CardHeader className="bg-green-50 border-b border-green-200">
                  <CardTitle className="text-green-800">Profile Information</CardTitle>
                  <CardDescription className="text-green-600">Manage your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Details */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-green-800">Personal Details</h3>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <dl className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-green-100">
                              <dt className="text-sm font-medium text-green-700">Full Name</dt>
                              <dd className="text-sm text-green-800 font-semibold">{user.name}</dd>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-green-100">
                              <dt className="text-sm font-medium text-green-700">Email</dt>
                              <dd className="text-sm text-green-800 font-semibold">{user.email}</dd>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <dt className="text-sm font-medium text-green-700">Mobile Number</dt>
                              <dd className="text-sm text-green-800 font-semibold">{user.mobile_number}</dd>
                            </div>
                          </dl>
                          
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white border-green-200">
                              <DialogHeader>
                                <DialogTitle className="text-green-800">Edit Profile</DialogTitle>
                                <DialogDescription className="text-green-600">
                                  Update your personal information below.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name" className="text-green-800">Full Name</Label>
                                  <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                    className="border-green-300 focus:border-green-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email" className="text-green-800">Email</Label>
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="email" 
                                      type="email" 
                                      value={editForm.email} 
                                      disabled 
                                      className="border-green-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditEmail((prev) => ({ ...prev, isEditing: true }))}
                                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                  {editEmail.isEditing && (
                                    <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                      <Input
                                        placeholder="New Email"
                                        value={editEmail.newEmail}
                                        onChange={(e) => setEditEmail((prev) => ({ ...prev, newEmail: e.target.value }))}
                                        className="border-green-300"
                                      />
                                      <Button
                                        type="button"
                                        onClick={handleEmailEdit}
                                        disabled={emailOtpLoading}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                      >
                                        {emailOtpLoading ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                          </>
                                        ) : (
                                          "Send OTP"
                                        )}
                                      </Button>
                                      {editEmail.message && (
                                        <p className="text-sm text-green-600">{editEmail.message}</p>
                                      )}
                                      {editEmail.message && (
                                        <>
                                          <Input
                                            placeholder="Enter OTP"
                                            value={editEmail.otp}
                                            onChange={(e) => setEditEmail((prev) => ({ ...prev, otp: e.target.value }))}
                                            className="border-green-300"
                                          />
                                          <Button
                                            type="button"
                                            onClick={handleEmailVerify}
                                            disabled={emailVerifyLoading}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                          >
                                            {emailVerifyLoading ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying...
                                              </>
                                            ) : (
                                              "Verify OTP"
                                            )}
                                          </Button>
                                          {editEmail.canResend && (
                                            <Button 
                                              type="button" 
                                              variant="link" 
                                              onClick={handleResendEmailOTP}
                                              className="text-orange-500 hover:text-orange-600"
                                            >
                                              Resend OTP
                                            </Button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="mobile_number" className="text-green-800">Mobile Number</Label>
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      id="mobile_number" 
                                      value={editForm.mobile_number} 
                                      disabled 
                                      className="border-green-300"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditMobile((prev) => ({ ...prev, isEditing: true }))}
                                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                  {editMobile.isEditing && (
                                    <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                      <Input
                                        placeholder="New Mobile Number"
                                        value={editMobile.newMobile}
                                        onChange={(e) => setEditMobile((prev) => ({ ...prev, newMobile: e.target.value }))}
                                        className="border-green-300"
                                      />
                                      <Button
                                        type="button"
                                        onClick={handleMobileEdit}
                                        disabled={mobileOtpLoading}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                      >
                                        {mobileOtpLoading ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                          </>
                                        ) : (
                                          "Send OTP"
                                        )}
                                      </Button>
                                      {editMobile.message && (
                                        <p className="text-sm text-green-600">{editMobile.message}</p>
                                      )}
                                      {editMobile.message && (
                                        <>
                                          <Input
                                            placeholder="Enter OTP"
                                            value={editMobile.otp}
                                            onChange={(e) => setEditMobile((prev) => ({ ...prev, otp: e.target.value }))}
                                            className="border-green-300"
                                          />
                                          <Button
                                            type="button"
                                            onClick={handleMobileVerify}
                                            disabled={mobileVerifyLoading}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                          >
                                            {mobileVerifyLoading ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying...
                                              </>
                                            ) : (
                                              "Verify OTP"
                                            )}
                                          </Button>
                                          {editMobile.canResend && (
                                            <Button 
                                              type="button" 
                                              variant="link" 
                                              onClick={handleResendMobileOTP}
                                              className="text-orange-500 hover:text-orange-600"
                                            >
                                              Resend OTP
                                            </Button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  type="submit" 
                                  className="w-full bg-green-600 hover:bg-green-700" 
                                  disabled={editLoading}
                                >
                                  {editLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save Name"
                                  )}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="mt-4 w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                                <Shield className="mr-2 h-4 w-4" />
                                Change Password
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white border-green-200">
                              <DialogHeader>
                                <DialogTitle className="text-green-800">Change Password</DialogTitle>
                                <DialogDescription className="text-green-600">
                                  Update your account password.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="current-password" className="text-green-800">Current Password</Label>
                                  <Input
                                    id="current-password"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    required
                                    className="border-green-300 focus:border-green-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="new-password" className="text-green-800">New Password</Label>
                                  <Input
                                    id="new-password"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    required
                                    className="border-green-300 focus:border-green-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="confirm-password" className="text-green-800">Confirm New Password</Label>
                                  <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                    className="border-green-300 focus:border-green-500"
                                  />
                                </div>
                                <Button 
                                  type="submit" 
                                  disabled={passwordLoading} 
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  {passwordLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    "Update Password"
                                  )}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Default Address */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-green-800">Default Address</h3>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          {defaultAddress ? (
                            <div className="space-y-2">
                              <p className="text-sm text-green-800 font-medium">
                                {defaultAddress.address_line_1}
                              </p>
                              {defaultAddress.address_line_2 && (
                                <p className="text-sm text-green-700">
                                  {defaultAddress.address_line_2}
                                </p>
                              )}
                              <p className="text-sm text-green-700">
                                {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.area_zip_code}
                              </p>
                              <p className="text-sm text-green-700">{defaultAddress.country}</p>
                              <Badge className="bg-orange-500 text-white mt-2">
                                {defaultAddress.address_type}
                              </Badge>
                            </div>
                          ) : (
                            <p className="text-sm text-green-600">No default address set</p>
                          )}
                          <Select onValueChange={handleDefaultAddressChange} defaultValue={defaultAddress?.id}>
                            <SelectTrigger className="mt-4 w-full border-green-300">
                              <SelectValue placeholder="Choose default address" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-green-200">
                              {addresses.map((addr) => (
                                <SelectItem key={addr.id} value={addr.id} className="text-green-800">
                                  {addr.address_line_1}, {addr.city} ({addr.address_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <Separator className="my-6 border-green-200" />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-orange-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </h3>
                    <Card className="border-orange-300 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-800">Delete Account</p>
                            <p className="text-sm text-orange-600">
                              Permanently remove your account and all associated data.
                            </p>
                          </div>
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                                Delete Account
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-white border-orange-200">
                              <DialogHeader>
                                <DialogTitle className="text-red-600">Delete Your Account</DialogTitle>
                                <DialogDescription className="text-orange-600">
                                  This action is irreversible. Please review the consequences:
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <ul className="list-disc pl-5 text-sm text-orange-700 space-y-1">
                                  <li>All your orders, addresses, and profile data will be deleted.</li>
                                  <li>You will lose access to your account permanently.</li>
                                  <li>No refunds will be processed for past purchases.</li>
                                </ul>
                                <div className="space-y-2">
                                  <Label htmlFor="delete-password" className="text-orange-800">Enter your password to proceed</Label>
                                  <Input
                                    id="delete-password"
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Password"
                                    className="border-orange-300"
                                  />
                                </div>
                                {deletePassword && (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="confirm-delete"
                                      checked={deleteConfirm}
                                      onChange={(e) => setDeleteConfirm(e.target.checked)}
                                      className="text-orange-500 border-orange-300"
                                    />
                                    <Label htmlFor="confirm-delete" className="text-orange-700">
                                      I understand the consequences
                                    </Label>
                                  </div>
                                )}
                                {error && <p className="text-sm text-red-600">{error}</p>}
                              </div>
                              <Button
                                variant="destructive"
                                disabled={!deletePassword || !deleteConfirm}
                                onClick={handleDeleteAccount}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirm Deletion
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && <OrdersComponent userId={authUser.customer_id} />}
            {activeTab === "address" && (
              <AddressComponent
                userId={authUser.customer_id}
                addresses={addresses}
                setAddresses={updateAddresses}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
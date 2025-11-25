import { useState, useEffect } from "react";
import { Edit, MapPin, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAddress, listAddresses, updateAddress, deleteAddress } from "@/api/userApi";
import { useToast } from "@/components/ui/use-toast";
import { useCountryCode } from "../../hooks/useCountryCode";

export default function AddressComponent({ userId, addresses, setAddresses }) {
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_type: "Home",
    full_name: "",
    mobile_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    area_zip_code: "",
    country: "India",
    is_default: false,
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const { countries } = useCountryCode();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressData = await listAddresses(userId);
        setAddresses(addressData);
        const defaultAddr = addressData.find((addr) => addr.is_default);
        if (defaultAddr) {
          setDefaultAddressId(defaultAddr.id);
        }
      } catch (error) {
        toast({ title: "Failed to Load Addresses", description: error.error || "Unknown error", variant: "destructive" });
      }
    };
    if (userId && addresses.length === 0) {
      fetchAddresses(); // Only fetch if addresses are not yet populated
    } else {
      const defaultAddr = addresses.find((addr) => addr.is_default);
      if (defaultAddr) {
        setDefaultAddressId(defaultAddr.id);
      }
    }
  }, [userId, addresses, setAddresses]);

  const getPhonePrefix = (country) => {
    const countryData = countries.find(c => c.name === country);
    return countryData ? `+${countryData.phone}` : "+91"; // Default to +91 if country not found
  };

  const handleSetDefault = async (addressId) => {
    try {
      const addressToUpdate = addresses.find((addr) => addr.id === addressId);
      await updateAddress(userId, addressId, { ...addressToUpdate, is_default: true });
      const updatedAddresses = await listAddresses(userId);
      setAddresses(updatedAddresses);
      setDefaultAddressId(addressId);
      toast({ title: "Default Address Updated" });
    } catch (error) {
      toast({ title: "Failed to Update Default Address", description: error.error || "Unknown error", variant: "destructive" });
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(userId, addressId);
        const updatedAddresses = await listAddresses(userId);
        setAddresses(updatedAddresses);
        const remainingDefault = updatedAddresses.find((addr) => addr.is_default);
        setDefaultAddressId(remainingDefault ? remainingDefault.id : updatedAddresses[0]?.id || null);
        toast({ title: "Address Deleted", variant: "destructive" });
      } catch (error) {
        toast({ title: "Failed to Delete Address", description: error.error || "Unknown error", variant: "destructive" });
      }
    }
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = ["full_name", "mobile_number", "address_line_1", "city", "state", "area_zip_code", "country"];
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${toTitleCase(field.replace(/_/g, " "))} is required`;
      }
    });
    if(formData.mobile_number.length > 16){
      newErrors.mobile_number = "Mobile number cannot exceeds 15 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async () => {
    const fullPhone = `${getPhonePrefix(newAddress.country)}${newAddress.mobile_number}`;
    const addressToAdd = { ...newAddress, mobile_number: fullPhone, customer_id: userId, address_type: newAddress.address_type.trim() || "Home" };
    if (validateForm(addressToAdd)) {
      try {
        console.log("Address to add:", addressToAdd);
        await createAddress(addressToAdd);
        const updatedAddresses = await listAddresses(userId);
        setAddresses(updatedAddresses);
        const addedDefault = updatedAddresses.find((addr) => addr.is_default);
        if (addedDefault) {
          setDefaultAddressId(addedDefault.id);
        }
        setIsAddDialogOpen(false);
        setNewAddress({
          address_type: "Home",
          full_name: "",
          mobile_number: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          area_zip_code: "",
          country: "India",
          is_default: false,
        });
        setErrors({});
        toast({ title: "Address Added Successfully" });
      } catch (error) {
        toast({ title: "Failed to Add Address", description: error.error || "Unknown error", variant: "destructive" });
      }
    } else {
      toast({ title: "Please Fill All Required Fields", variant: "destructive" });
    }
  };

  const handleEditAddress = async () => {
    const fullPhone = `${getPhonePrefix(editingAddress.country)}${editingAddress.mobile_number}`;
    const addressToUpdate = { ...editingAddress, mobile_number: fullPhone,address_type: newAddress.address_type.trim() || "Home" };
    if (validateForm(addressToUpdate)) {
      try {
        await updateAddress(userId, editingAddress.id, addressToUpdate);
        const updatedAddresses = await listAddresses(userId);
        setAddresses(updatedAddresses);
        if (editingAddress.is_default) {
          setDefaultAddressId(editingAddress.id);
        }
        setIsEditDialogOpen(false);
        setEditingAddress(null);
        setErrors({});
        toast({ title: "Address Updated Successfully" });
      } catch (error) {
        toast({ title: "Failed to Update Address", description: error.error || "Unknown error", variant: "destructive" });
      }
    } else {
      toast({ title: "Please Fill All Required Fields", variant: "destructive" });
    }
  };

  const openEditDialog = (address) => {
    setEditingAddress({
      ...address,
      mobile_number: address.mobile_number.replace(getPhonePrefix(address.country), ""),
    });
    setIsEditDialogOpen(true);
  };

  const renderInput = (field, value, onChange, placeholder, required = false) => (
    <div>
      <Label htmlFor={field} className="text-gray-700 dark:text-gray-300">
        {toTitleCase(field.replace(/_/g, " "))}{required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={field}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-1 ${errors[field] ? "border-red-500" : ""}`}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  const renderPhoneInput = (address, setAddress) => (
    <div>
      <Label htmlFor="mobile_number" className="text-gray-700 dark:text-gray-300">
        Mobile Number<span className="text-red-500">*</span>
      </Label>
      <div className="mt-1 flex">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
          {getPhonePrefix(address.country)}
        </span>
        <Input
          id="mobile_number"
          placeholder="Mobile Number"
          value={address.mobile_number}
          onChange={(e) => setAddress({ ...address, mobile_number: e.target.value })}
          className={`rounded-l-none ${errors.mobile_number ? "border-red-500" : ""}`}
          maxLength={13}
        />
      </div>
      {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
    </div>
  );

  const renderCountrySelect = (address, setAddress) => (
    <div>
      <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
        Country<span className="text-red-500">*</span>
      </Label>
      <Select
        value={address.country}
        onValueChange={(value) =>
          setAddress({
            ...address,
            country: value,
            mobile_number: "",
          })
        }
      >
        <SelectTrigger className={`mt-1 ${errors.country ? "border-red-500" : ""}`}>
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent className="max-h-40">
          {countries.map(country => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
    </div>
  );

  if (addresses.length === 0) {
    return (
      <Card className="bg-transparent shadow-md border-none">
        <CardHeader>
          <CardTitle>My Addresses</CardTitle>
          <CardDescription>Manage your addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No addresses found.</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-4 h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Address</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-2">
                {renderInput("address_type", newAddress.address_type, (e) => setNewAddress({ ...newAddress, address_type: e.target.value }), "Type (e.g., Home, Work)")}
                {renderInput("full_name", newAddress.full_name, (e) => setNewAddress({ ...newAddress, full_name: e.target.value }), "Full Name", true)}
                {renderPhoneInput(newAddress, setNewAddress)}
                {renderCountrySelect(newAddress, setNewAddress)}
                {renderInput("address_line_1", newAddress.address_line_1, (e) => setNewAddress({ ...newAddress, address_line_1: e.target.value }), "Address Line 1", true)}
                {renderInput("address_line_2", newAddress.address_line_2, (e) => setNewAddress({ ...newAddress, address_line_2: e.target.value }), "Address Line 2 (Optional)")}
                {renderInput("city", newAddress.city, (e) => setNewAddress({ ...newAddress, city: e.target.value }), "City", true)}
                {renderInput("state", newAddress.state, (e) => setNewAddress({ ...newAddress, state: e.target.value }), "State", true)}
                {renderInput("area_zip_code", newAddress.area_zip_code, (e) => setNewAddress({ ...newAddress, area_zip_code: e.target.value }), "Zip Code", true)}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  />
                  <Label htmlFor="is_default">Set as Default</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAddress}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent shadow-md border-none">
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
        <CardDescription>Manage your addresses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Shipping Addresses</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Address</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-2">
                {renderInput("address_type", newAddress.address_type, (e) => setNewAddress({ ...newAddress, address_type: e.target.value }), "Type (e.g., Home, Work)")}
                {renderInput("full_name", newAddress.full_name, (e) => setNewAddress({ ...newAddress, full_name: e.target.value }), "Full Name", true)}
                {renderPhoneInput(newAddress, setNewAddress)}
                {renderCountrySelect(newAddress, setNewAddress)}
                {renderInput("address_line_1", newAddress.address_line_1, (e) => setNewAddress({ ...newAddress, address_line_1: e.target.value }), "Address Line 1", true)}
                {renderInput("address_line_2", newAddress.address_line_2, (e) => setNewAddress({ ...newAddress, address_line_2: e.target.value }), "Address Line 2 (Optional)")}
                {renderInput("city", newAddress.city, (e) => setNewAddress({ ...newAddress, city: e.target.value }), "City", true)}
                {renderInput("state", newAddress.state, (e) => setNewAddress({ ...newAddress, state: e.target.value }), "State", true)}
                {renderInput("area_zip_code", newAddress.area_zip_code, (e) => setNewAddress({ ...newAddress, area_zip_code: e.target.value }), "Zip Code", true)}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  />
                  <Label htmlFor="is_default">Set as Default</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAddress}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <RadioGroup value={defaultAddressId} className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id}>
              <RadioGroupItem value={address.id} id={address.id} className="peer sr-only" />
              <Label
                htmlFor={address.id}
                className="flex flex-col rounded-lg border bg-background p-4 shadow-sm hover:bg-background hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{address.address_type}</span>
                    {address.is_default && (
                      <Badge variant="outline" className="w-fit">
                        Default
                      </Badge>
                    )}
                  </div>
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>{address.full_name}</p>
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.area_zip_code}</p>
                  <p>{address.country}</p>
                  <p>{address.mobile_number}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Dialog open={isEditDialogOpen && editingAddress?.id === address.id} onOpenChange={(open) => !open && setEditingAddress(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 w-full gap-1" onClick={() => openEditDialog(address)}>
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      {editingAddress && (
                        <div className="grid gap-2 py-2">
                          {renderInput("address_type", editingAddress.address_type, (e) => setEditingAddress({ ...editingAddress, address_type: e.target.value }), "Type (e.g., Home, Work)")}
                          {renderInput("full_name", editingAddress.full_name, (e) => setEditingAddress({ ...editingAddress, full_name: e.target.value }), "Full Name", true)}
                          {renderPhoneInput(editingAddress, setEditingAddress)}
                          {renderCountrySelect(editingAddress, setEditingAddress)}
                          {renderInput("address_line_1", editingAddress.address_line_1, (e) => setEditingAddress({ ...editingAddress, address_line_1: e.target.value }), "Address Line 1", true)}
                          {renderInput("address_line_2", editingAddress.address_line_2, (e) => setEditingAddress({ ...editingAddress, address_line_2: e.target.value }), "Address Line 2 (Optional)")}
                          {renderInput("city", editingAddress.city, (e) => setEditingAddress({ ...editingAddress, city: e.target.value }), "City", true)}
                          {renderInput("state", editingAddress.state, (e) => setEditingAddress({ ...editingAddress, state: e.target.value }), "State", true)}
                          {renderInput("area_zip_code", editingAddress.area_zip_code, (e) => setEditingAddress({ ...editingAddress, area_zip_code: e.target.value }), "Zip Code", true)}
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={handleEditAddress}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-full gap-1"
                    onClick={() => handleDelete(address.id)}
                    disabled={addresses.length === 1}
                  >
                    <Trash className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
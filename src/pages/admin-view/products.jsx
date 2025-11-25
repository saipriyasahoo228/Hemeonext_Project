

import React, { useState , useEffect} from "react";
import { Input } from "@/components/ui/input"; // Assuming these are custom UI components
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // For modal-like sheet
import {
  fetchCategories,
  fetchSubCategories,
  fetchBrands,
  addProduct,
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "@/api/productApi";

// Initial form data structure
const initialFormData = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  actual_price: "",
  sale_price: "",
  stock: "",
  images: [],
  specifications: [{ key: "", value: "" }]
};

function ProductForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to manage sheet visibility
  const [submittedProduct, setSubmittedProduct] = useState(null); // Store submitted product details
  const [categories, setCategories] = useState([]); // Store categories fetched from API
  const [subcategories, setSubcategories] = useState([]); // Store subcategories fetched from
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);


 

  // Handle input changes
  const handleChange = (e, name) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new specification fields
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  // Handle specification key-value change
  const handleSpecificationChange = (e, index, name) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[index][name] = e.target.value;
    setFormData({ ...formData, specifications: newSpecifications });
  };

  // Remove specification
  const removeSpecification = (index) => {
    const newSpecifications = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecifications });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
  
    const toBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });
    };
  
    const base64Images = await Promise.all(files.map((file) => toBase64(file)));
  
    setFormData((prevData) => ({
      ...prevData,
      images: base64Images, // now images is array of base64 strings
      primaryImageIndex: 0, // default to first image
    }));
  };
  

  const handlePrimaryImageChange = (index) => {
    setFormData((prevData) => ({ ...prevData, primaryImageIndex: index }));
  };
  


  // Fetch categories and subcategories , brands 

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedSubcategories, fetchedBrands] = await Promise.all([
          fetchCategories(),
          fetchSubCategories(),
          fetchBrands()
        ]);
        setCategories(fetchedCategories);
        setSubcategories(fetchedSubcategories);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error loading categories or subcategories", error);
      }
    };
  
    loadData();
  }, []);



  useEffect(() => {
    if (formData.category) {
      const filtered = subcategories.filter(
        (sub) => sub.category === Number(formData.category)
      );
      setFilteredSubcategories(filtered);
    }
  }, [formData.category, subcategories]);
  

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId); // Your API function
      const updatedProducts = await fetchProducts(); // Refresh product list
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };
  
  
  

  const handleCategoryChange = (value) => {
    handleChange({ target: { value } }, "category");
  
    const filtered = subcategories.filter(
      (sub) => sub.category === parseInt(value)
    );
    setFilteredSubcategories(filtered);
    
    // Reset selected subcategory
    setFormData((prev) => ({ ...prev, subcategory: "" }));
  };

  //Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
  
    loadProducts();
  }, []);
  
  const handleEditClick = (product) => {
    // Convert image URLs to base64 if needed — or store as URLs to handle differently
    const images = product.images.map((img) => ({
      base64: img.image, // if already base64 or backend returns URLs
      is_primary: img.is_primary,
    }));
  
    const primaryIndex = images.findIndex((img) => img.is_primary);
  
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category?.id || product.category, // handle both ID or object
      subcategory: product.subcategory?.id || product.subcategory,
      brand: product.brand?.id || product.brand,
      actual_price: product.actual_price,
      discount_percentage: product.discount_percentage,
      stock: product.stock,
      specifications: product.specifications,
      images,
      primaryImageIndex: primaryIndex !== -1 ? primaryIndex : 0,
    });
  
    setEditingProduct(product.id);
    setIsSheetOpen(true); // if using a sheet/modal
  };
  

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = formData.images.filter((_, i) => i !== indexToRemove);
  
    let newPrimaryIndex = formData.primaryImageIndex;
    if (indexToRemove === formData.primaryImageIndex) {
      newPrimaryIndex = 0;
    } else if (indexToRemove < formData.primaryImageIndex) {
      newPrimaryIndex = formData.primaryImageIndex - 1;
    }
  
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      primaryImageIndex: newPrimaryIndex,
    }));
  };
  

  // Handle Submit
      
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      title,
      description,
      category,
      subcategory,
      brand,
      actual_price,
      discount_percentage,
      stock,
      images,
      specifications,
      primaryImageIndex,
    } = formData;
  
    // ✅ Validate required text fields
    const requiredFields = [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "category", label: "Category" },
      { key: "subcategory", label: "Subcategory" },
      { key: "brand", label: "Brand" },
      { key: "actual_price", label: "Actual Price" },
      { key: "discount_percentage", label: "Discount Percentage" },
      { key: "stock", label: "Stock" },
    
    ];
  
    for (const field of requiredFields) {
      const value = String(formData[field.key] || "").trim();
      if (!value) {
        alert(`❌ ${field.label} is required.`);
        return;
      }
    }
  
    // ✅ Validate numeric fields
    if (actual_price === "" || isNaN(actual_price) || Number(actual_price) < 0) {
      alert("❌ Actual price must be a valid non-negative number.");
      return;
    }
  
    
  
    if (stock === "" || isNaN(stock) || Number(stock) < 0) {
      alert("❌ Stock must be a valid non-negative number.");
      return;
    }
  
    // ✅ Validate images
    if (!Array.isArray(images) || images.length === 0) {
      alert("❌ At least one image is required.");
      return;
    }
  
    if (primaryImageIndex === null || primaryImageIndex < 0 || primaryImageIndex >= images.length) {
      alert("❌ Please select a valid primary image.");
      return;
    }
  
    // ✅ Validate specifications
    if (!Array.isArray(specifications) || specifications.length === 0) {
      alert("❌ At least one specification is required.");
      return;
    }
  
    try {
      const formattedImages = images.map((image, index) => ({
        image: typeof image === "string" ? image : image.base64,
        is_primary: index === primaryImageIndex,
      }));
  
      const productPayload = {
        title: String(title).trim(),
        description: String(description).trim(),
        category: String(category).trim(),
        subcategory: String(subcategory).trim(),
        brand: String(brand).trim(),
        actual_price: Number(actual_price),
        discount_percentage: Number(discount_percentage),
        stock: Number(stock),
        images: formattedImages,
        specifications,
      };
  
      let product;
  
      if (editingProduct) {
        product = await updateProduct(editingProduct, productPayload);
        alert("✅ Product updated successfully!");
      } else {
        product = await addProduct(productPayload);
        alert("✅ Product added successfully!");
      }
  
      setSubmittedProduct(product);
      setFormData(initialFormData);
      setIsSheetOpen(false);
      setEditingProduct(null);
  
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("❌ Failed to submit product", error);
      alert(`❌ Failed to ${editingProduct ? "update" : "add"} product.`);
    }
  };
  

  return (
    <div>
      {/* Add Product Button */}
      <Button onClick={() => setIsSheetOpen(true)} className="m-4">Add Product</Button>

      {/* Product Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={() => setIsSheetOpen(false)} side="right">
        <SheetContent className="p-6 overflow-auto md:w-[900px] w-full">
          <SheetHeader>
            <SheetTitle className="text-golden font-bold text-2xl">Add New Product</SheetTitle>
          </SheetHeader>

          {/* Product Title */}
          <div className="mb-5">
            <Label className="text-golden">Product Title*</Label>
            <Input
              className="bg-white border border-golden p-2"
              value={formData.title}
              onChange={(e) => handleChange(e, "title")}
              placeholder="Enter product title*"
              
            />
            
          </div>

          {/* Product Description */}
          <div className="mb-4">
            <Label className="text-golden">Product Description*</Label>
            <Textarea
              className="bg-white border border-golden p-2"
              value={formData.description}
              onChange={(e) => handleChange(e, "description")}
              placeholder="Enter product description*"
            />
          </div>

     


{/* Category */}
<div className="mb-4">
  <Select
    onValueChange={handleCategoryChange}
    value={formData.category ? String(formData.category) : ""}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Category*" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((cat) => (
        <SelectItem key={cat.id} value={String(cat.id)}>
          {cat.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

{/* Subcategory */}
<div className="mb-4">
  <Select
    onValueChange={(value) => handleChange({ target: { value } }, "subcategory")}
    value={formData.subcategory ? String(formData.subcategory) : ""}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Subcategory*" />
    </SelectTrigger>
    <SelectContent>
      {filteredSubcategories.map((sub) => (
        <SelectItem key={sub.id} value={String(sub.id)}>
          {sub.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

{/* Brand */}
<div className="mb-4">
  <Label className="text-golden">Brand*</Label>
  <Select
    onValueChange={(value) => handleChange({ target: { value } }, "brand")}
    value={formData.brand ? String(formData.brand) : ""}
  >
    <SelectTrigger className="bg-white border border-golden p-2">
      <SelectValue placeholder="Select Brand" />
    </SelectTrigger>
    <SelectContent>
      {brands.map((brand) => (
        <SelectItem key={brand.id} value={String(brand.id)}>
          {brand.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          {/* Price */}
          <div className="mb-4 flex gap-4">
            <div className="w-full">
              <Label className="text-golden">Actual Price*</Label>
              <Input
                className="bg-white border border-golden p-2"
                type="number"
                value={formData.actual_price}
                onChange={(e) => handleChange(e, "actual_price")}
                placeholder="Enter actual price*"
              />
            </div>
            <div className="w-full">
              <Label className="text-golden">Discount*</Label>
              <Input
                className="bg-white border border-golden p-2"
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => handleChange(e, "discount_percentage")}
                placeholder="Enter discount price*"
              />
            </div>
            <div className="w-full">
    <Label className="text-golden">Total Price</Label>
    <Input
      className="bg-white border border-golden p-2"
      type="number"
      value={
        formData.actual_price && formData.discount_percentage
          ? (
              formData.actual_price -
              (formData.actual_price * formData.discount_percentage) / 100
            ).toFixed(2)
          : ""
      }
      readOnly
      placeholder="Total after discount"
    />
  </div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <Label className="text-golden">Stock Quantity*</Label>
            <Input
              className="bg-white border border-golden p-2"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange(e, "stock")}
              placeholder="Enter stock quantity*"
            />
          </div>

          {/* Specifications */}
          <div className="mb-4">
            <h3 className="text-golden font-semibold mb-2">Specifications</h3>
            {formData.specifications.map((spec, index) => (
              <div className="flex gap-4 mb-2" key={index}>
                <Input
                  className="bg-white border border-golden p-2 w-1/2"
                  value={spec.key}
                  onChange={(e) => handleSpecificationChange(e, index, "key")}
                  placeholder="Enter key (e.g., Battery Life)"
                />
                <Input
                  className="bg-white border border-golden p-2 w-1/2"
                  value={spec.value}
                  onChange={(e) => handleSpecificationChange(e, index, "value")}
                  placeholder="Enter value (e.g., 24 hours)"
                />
                <Button
                  className="bg-red-600 text-white"
                  onClick={() => removeSpecification(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button className="text-golden" onClick={addSpecification}>Add Specification</Button>
          </div>

          {/* Product Images */}
         
<div className="mb-4">
  <Label className="text-golden">Product Images*</Label>
  <Input type="file" accept="image/*" multiple onChange={handleImageUpload} />
</div>
{formData.images.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-semibold text-golden">Select Primary Image*</h3>
    <div className="flex gap-2 flex-wrap">
      {formData.images.map((image, index) => {
        const imageSrc = typeof image === "string" ? image : image.base64;

        return (
          <div
            key={index}
            className={`relative flex flex-col items-center p-1 rounded-md border ${
              formData.primaryImageIndex === index
                ? "ring-2 ring-golden border-transparent"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="primary-image"
              checked={formData.primaryImageIndex === index}
              onChange={() => handlePrimaryImageChange(index)}
            />
            <img
              src={imageSrc}
              alt={`Product ${index}`}
              className="w-24 h-24 object-cover rounded-md mt-1"
            />

            {/* Optional Remove Button */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 hover:bg-red-700"
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}




          {/* Save Button */}
          <div className="mt-4">
            <Button onClick={handleSubmit} className="w-full bg-golden text-white">Save Product</Button>
          </div>
        </SheetContent>
      </Sheet>


          {/* Display Product Card after submission */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const primaryImage = product.images.find((img) => img.is_primary);
        const otherImages = product.images.filter((img) => !img.is_primary);

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg border border-yellow-400 p-4 hover:shadow-xl transition"
          >
            {/* Primary Image */}
            {primaryImage && (
              <img
                src={primaryImage.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-3 border border-yellow-300"
              />
            )}

            {/* Title & Price */}
            <h2 className="text-lg font-semibold text-yellow-600 mb-1">{product.title}</h2>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

            <div className="mb-2">
              <span className="text-yellow-700 font-bold mr-2">${product.sale_price}</span>
              <span className="line-through text-gray-500">${product.actual_price}</span>
            </div>

            {/* Category Info */}
            <div className="text-xs text-gray-500 mb-2">
              <p><strong>Category:</strong> {product.category.name}</p>
              <p><strong>Subcategory:</strong> {product.subcategory.name}</p>
              <p><strong>Brand:</strong> {product.brand.name}</p>
            </div>

            {/* Specifications */}
            {product.specifications?.length > 0 && (
              <div className="text-xs text-gray-700 mb-2">
                {product.specifications.map((spec, idx) => (
                  <div key={idx}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </div>
                ))}
              </div>
            )}

            {/* Other Images */}
            {otherImages.length > 0 && (
              <div className="flex space-x-2 mt-2">
                {otherImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt="Alt"
                    className="w-12 h-12 object-cover rounded-md border border-yellow-300"
                  />
                ))}
              </div>
            )}
            <div className="flex justify-center gap-4 mt-4">
  {/* <button className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition">
    Update
  </button> */}
  <button
  className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition"
  onClick={() => handleEditClick(product)}
>
  Update
</button>

  <button
  onClick={() => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      handleDelete(product.id);
    }
  }}
  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
>
  Delete
</button>
</div>
          </div>
        );
      })}
      
    </div>
    
    </div>
  );
};

      
    
          
  
export default ProductForm;
      
      
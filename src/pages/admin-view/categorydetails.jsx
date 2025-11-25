import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Edit, Loader2 } from "lucide-react";
import { fetchCategories, fetchSubCategories, fetchBrands, addCategory, addSubCategory, addBrand, updateCategory, updateSubCategory, updateBrand, deleteCategory, deleteSubCategory, deleteBrand } from "../../api/productApi";

function CategoryDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // "category", "subcategory", "brand"
  const [editId, setEditId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deletion

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catData, subCatData, brandData] = await Promise.all([
          fetchCategories(),
          fetchSubCategories(),
          fetchBrands(),
        ]);
        setCategories(catData);
        setSubCategories(subCatData);
        setBrands(brandData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!categoryData.name) return;

    try {
      setIsSubmitting(true);
      if (dialogType === "category") {
        if (editId) {
          await updateCategory(editId, { name: categoryData.name });
          setCategories(categories.map((cat) => (cat.id === editId ? { ...cat, name: categoryData.name } : cat)));
        } else {
          const newCategory = await addCategory({ name: categoryData.name });
          setCategories([...categories, newCategory]);
        }
      } else if (dialogType === "subcategory") {
        if (!categoryData.category) return;
        if (editId) {
          await updateSubCategory(editId, { name: categoryData.name, category: categoryData.category });
          setSubCategories(subCategories.map((sub) => (sub.id === editId ? { ...sub, name: categoryData.name, category: categoryData.category } : sub)));
        } else {
          const newSubCategory = await addSubCategory({ name: categoryData.name, category: categoryData.category });
          setSubCategories([...subCategories, newSubCategory]);
        }
      } else if (dialogType === "brand") {
        if (editId) {
          await updateBrand(editId, { name: categoryData.name });
          setBrands(brands.map((brand) => (brand.id === editId ? { ...brand, name: categoryData.name } : brand)));
        } else {
          const newBrand = await addBrand({ name: categoryData.name });
          setBrands([...brands, newBrand]);
        }
      }
      setCategoryData({ name: "", category: "" });
      setIsOpen(false);
      setEditId(null);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Dialog
  const handleEditClick = (type, item) => {
    setDialogType(type);
    setEditId(item.id);
    setCategoryData(
      type === "subcategory"
        ? { name: item.name, category: item.category }
        : { name: item.name, category: "" }
    );
    setIsOpen(true);
  };

  // Open Delete Confirmation Dialog
  const handleDeleteClick = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setConfirmDelete(true);
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      if (deleteType === "category") {
        await deleteCategory(deleteId);
        setCategories(categories.filter((cat) => cat.id !== deleteId));
      } else if (deleteType === "subcategory") {
        await deleteSubCategory(deleteId);
        setSubCategories(subCategories.filter((sub) => sub.id !== deleteId));
      } else if (deleteType === "brand") {
        await deleteBrand(deleteId);
        setBrands(brands.filter((brand) => brand.id !== deleteId));
      }
      setConfirmDelete(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Add Dialog
  const openAddDialog = (type) => {
    setDialogType(type);
    setCategoryData({ name: "", category: "" });
    setEditId(null);
    setIsOpen(true);
  };

  // Loading state for initial data fetch
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
        <span className="ml-2 text-gray-800">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100">
      {/* Overlay for deletion */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#FFD700]" />
            <p className="text-center text-gray-800">Deleting...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Category Management</h1>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
        <Button
          onClick={() => openAddDialog("category")}
          className="flex items-center border border-[#FFD700] text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-[#FFD700] hover:text-white transition-colors w-full sm:w-auto"
          disabled={isSubmitting || isDeleting}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
        <Button
          onClick={() => openAddDialog("subcategory")}
          className="flex items-center border border-[#FFD700] text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-[#FFD700] hover:text-white transition-colors w-full sm:w-auto"
          disabled={isSubmitting || isDeleting}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Subcategory
        </Button>
        <Button
          onClick={() => openAddDialog("brand")}
          className="flex items-center border border-[#FFD700] text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-[#FFD700] hover:text-white transition-colors w-full sm:w-auto"
          disabled={isSubmitting || isDeleting}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md border border-[#FFD700]">
          <DialogHeader>
            <DialogTitle className="text-black text-xl font-bold">
              {editId ? `Edit ${dialogType}` : `Add ${dialogType}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder={dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}
              className="border border-[#FFD700] rounded-md p-2 w-full"
              value={categoryData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {dialogType === "subcategory" && (
              <select
                name="category"
                value={categoryData.category}
                onChange={handleChange}
                className="border border-[#FFD700] rounded-md p-2 w-full bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="border border-gray-400 text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="border border-[#FFD700] text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-[#FFD700] hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {editId ? "Updating..." : "Submitting..."}
                </>
              ) : (
                editId ? "Update" : "Submit"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories and Subcategories */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Categories & Subcategories</h2>
        {categories.length === 0 && (
          <p className="text-gray-500 text-center">No categories available.</p>
        )}
        <div className="grid gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow-md p-4 border border-[#FFD700] hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick("category", cat)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label={`Edit ${cat.name}`}
                    disabled={isSubmitting || isDeleting}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick("category", cat.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete ${cat.name}`}
                    disabled={isSubmitting || isDeleting}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pl-4 border-l-2 border-[#FFD700]">
                {subCategories.filter((sub) => sub.category === cat.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">No subcategories available.</p>
                ) : (
                  subCategories
                    .filter((sub) => sub.category === cat.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-gray-700">{sub.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick("subcategory", sub)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Edit ${sub.name}`}
                            disabled={isSubmitting || isDeleting}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick("subcategory", sub.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete ${sub.name}`}
                            disabled={isSubmitting || isDeleting}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Brands</h2>
        {brands.length === 0 && (
          <p className="text-gray-500 text-center">No brands available.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-md p-4 border border-[#FFD700] hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{brand.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick("brand", brand)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label={`Edit ${brand.name}`}
                    disabled={isSubmitting || isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick("brand", brand.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete ${brand.name}`}
                    disabled={isSubmitting || isDeleting}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md border border-[#FFD700]">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-xl font-bold">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">Are you sure you want to delete this {deleteType}?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => setConfirmDelete(false)}
              className="border border-gray-400 text-black px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-gray-200 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="border border-red-500 text-red-500 px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md bg-transparent hover:bg-red-500 hover:text-white transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoryDetails;
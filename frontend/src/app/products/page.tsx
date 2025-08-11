// frontend/src/app/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { Product, ProductCategory } from "@/types";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingButton from "@/components/LoadingButton";

interface ProductFormData {
  name: string;
  description: string;
  categoryId: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    categoryId: 0,
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/product-categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      categoryId: categories.length > 0 ? categories[0].id : 0,
      stock: 0,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      stock: product.stock,
    });
    setSelectedFile(null);
    setPreviewUrl(
      product.imageUrl
        ? `${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`
        : ""
    );
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("categoryId", formData.categoryId.toString());
      formDataToSend.append("stock", formData.stock.toString());

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully! ✨");
      } else {
        await api.post("/products", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product created successfully! 🎉");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'data' in error.response && error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data && 
        typeof error.response.data.message === 'string'
        ? error.response.data.message 
        : "Operation failed";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteDialog = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await api.delete(`/products/${deletingProduct.id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'data' in error.response && error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data && 
        typeof error.response.data.message === 'string'
        ? error.response.data.message 
        : "Failed to delete product";
      toast.error(errorMessage);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock > 10) return "badge-success";
    if (stock > 0) return "badge-warning";
    return "badge-danger";
  };

  const getStockText = (stock: number) => {
    if (stock > 10) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-900">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6 animate-shimmer"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-700 rounded-xl animate-shimmer"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Product Management
          </h1>
          <p className="text-gray-400">
            Manage your inventory and product information
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card-dark-hover rounded-xl overflow-hidden group"
          >
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 w-full relative">
              {product.imageUrl ? (
                <img
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
                  alt={product.name}
                />
              ) : (
                <div className="h-48 w-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                  <PhotoIcon className="h-16 w-16 text-gray-500" />
                </div>
              )}

              {/* Action Buttons Overlay */}
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-gray-900/80 text-gray-300 hover:text-purple-400 rounded-lg backdrop-blur-sm transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteDialog(product)}
                  className="p-2 bg-gray-900/80 text-gray-300 hover:text-red-400 rounded-lg backdrop-blur-sm transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStockColor(
                    product.stock
                  )}`}
                >
                  {product.stock} left
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-purple-400 font-medium">
                  {product.category?.name}
                </p>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {product.description || "No description available"}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStockColor(
                    product.stock
                  )}`}
                >
                  {getStockText(product.stock)}
                </span>
                <span className="text-lg font-bold text-white">
                  {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="card-dark rounded-xl p-12 max-w-md mx-auto">
            <CubeIcon className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-300 text-xl mb-2">No products found</p>
            <p className="text-gray-500 mb-6">
              Add your first product to start managing inventory
            </p>
            <button onClick={openCreateModal} className="btn-primary">
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Create Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-dark w-full"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: parseInt(e.target.value),
                  })
                }
                className="select-dark w-full"
              >
                <option value={0}>Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="textarea-dark w-full"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Stock
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              className="input-dark w-full"
              placeholder="Enter initial stock quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-xl hover:border-purple-500 transition-colors">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="flex text-sm text-gray-400">
                  <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none transition-colors">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <LoadingButton type="submit" loading={submitting} variant="primary">
              {editingProduct ? "Update Product" : "Create Product"}
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

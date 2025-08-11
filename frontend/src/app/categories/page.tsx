// frontend/src/app/categories/page.tsx
"use client";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { ProductCategory } from "@/types";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingButton from "@/components/LoadingButton";

interface CategoryFormData {
  name: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<ProductCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/product-categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        await api.patch(`/product-categories/${editingCategory.id}`, formData);
        toast.success("Category updated successfully! ✨");
      } else {
        await api.post("/product-categories", formData);
        toast.success("Category created successfully! 🎉");
      }
      setIsModalOpen(false);
      fetchCategories();
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

  const openDeleteDialog = (category: ProductCategory) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await api.delete(`/product-categories/${deletingCategory.id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'data' in error.response && error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data && 
        typeof error.response.data.message === 'string'
        ? error.response.data.message 
        : "Failed to delete category";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-700 rounded mb-4 sm:mb-6 animate-shimmer"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 sm:h-40 bg-gray-700 rounded-xl animate-shimmer"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Product Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Organize your products into meaningful categories
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="card-dark-hover rounded-xl p-4 sm:p-6 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex-shrink-0">
                  <TagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                  {category.name}
                </h3>
              </div>
              <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(category)}
                  className="tap-target p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteDialog(category)}
                  className="tap-target p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 sm:mb-6 min-h-[3rem] line-clamp-3 text-sm sm:text-base">
              {category.description || "No description available"}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="badge-purple px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                  {category.products?.length || 0} products
                </span>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="card-dark rounded-xl p-8 sm:p-12 max-w-md mx-auto">
            <TagIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-300 text-lg sm:text-xl mb-2">
              No categories found
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Create your first category to organize your products
            </p>
            <button onClick={openCreateModal} className="btn-primary w-full">
              Create Category
            </button>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Create Category"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-dark w-full"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="textarea-dark w-full"
              placeholder="Enter category description"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={submitting}
              variant="primary"
              className="w-full sm:w-auto"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${
          deletingCategory?.name
        }"? ${
          deletingCategory?.products?.length || 0 > 0
            ? "This will also affect associated products."
            : ""
        } This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

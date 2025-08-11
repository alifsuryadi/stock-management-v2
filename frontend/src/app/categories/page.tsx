// frontend/src/app/categories/page.tsx
"use client";
import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon, TagIcon, CubeIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { ProductCategory } from "@/types";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import CategoryForm from "@/components/CategoryForm";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/product-categories");
      setCategories(response.data);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    setSubmitting(true);
    try {
      const response = await api.post("/product-categories", data);
      setCategories(prev => [...prev, response.data]);
      toast.success("Category created successfully");
      setIsModalOpen(false);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: { name: string; description: string }) => {
    if (!editingCategory) return;
    
    setSubmitting(true);
    try {
      const response = await api.patch(`/product-categories/${editingCategory.id}`, data);
      setCategories(prev => prev.map(category => 
        category.id === editingCategory.id ? response.data : category
      ));
      toast.success("Category updated successfully");
      setIsModalOpen(false);
      setEditingCategory(undefined);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: ProductCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This will affect all products in this category.`)) {
      return;
    }

    try {
      await api.delete(`/product-categories/${category.id}`);
      setCategories(prev => prev.filter(c => c.id !== category.id));
      toast.success("Category deleted successfully");
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete category";
      toast.error(message);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Organize your products by categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <TagIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No categories found</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first product category.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md transition-all duration-200 animate-fade-in"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <TagIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10">
                  {category.description || "No description provided"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CubeIcon className="h-4 w-4 mr-1" />
                    <span>{category.products?.length || 0} products</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    ID: {category.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? "Edit Category" : "Create New Category"}
        size="md"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={closeModal}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}
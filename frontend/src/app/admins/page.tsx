// frontend/src/app/admins/page.tsx
"use client";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { Admin } from "@/types";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import AdminForm from "@/components/AdminForm";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admin");
      setAdmins(response.data);
    } catch {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate?: string;
    gender: "male" | "female";
  }) => {
    // Validate required password for new admin
    if (!data.password) {
      toast.error("Password is required for new admin");
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await api.post("/admin/register", data);
      setAdmins((prev) => [...prev, response.data]);
      toast.success("Admin created successfully");
      setIsModalOpen(false);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to create admin";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate?: string;
    gender: "male" | "female";
  }) => {
    if (!editingAdmin) return;

    setSubmitting(true);
    try {
      const response = await api.patch(`/admin/${editingAdmin.id}`, data);
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === editingAdmin.id ? response.data : admin
        )
      );
      toast.success("Admin updated successfully");
      setIsModalOpen(false);
      setEditingAdmin(undefined);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update admin";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    if (
      !confirm(
        `Are you sure you want to delete ${admin.firstName} ${admin.lastName}?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/${admin.id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      toast.success("Admin deleted successfully");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to delete admin";
      toast.error(message);
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(undefined);
  };

  const handleSubmitAdmin = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate?: string;
    gender: "male" | "female";
  }) => {
    if (editingAdmin) {
      await handleUpdateAdmin(data);
    } else {
      await handleCreateAdmin(data);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"
              ></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage system administrators
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Admin
        </button>
      </div>

      {admins.length === 0 ? (
        <div className="text-center py-16">
          <UserIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No admins found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get started by creating your first admin.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Admin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md transition-all duration-200 animate-fade-in"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {admin.firstName[0]?.toUpperCase()}
                        {admin.lastName[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {admin.firstName} {admin.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Gender
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.gender === "male"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                          : "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300"
                      }`}
                    >
                      {admin.gender}
                    </span>
                  </div>
                  {admin.birthDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Birth Date
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(admin.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex space-x-2">
                  <button
                    onClick={() => openEditModal(admin)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingAdmin ? "Edit Admin" : "Create New Admin"}
        size="lg"
      >
        <AdminForm
          admin={editingAdmin}
          onSubmit={handleSubmitAdmin}
          onCancel={closeModal}
          loading={submitting}
        />
      </Modal>
    </div>
  );
}

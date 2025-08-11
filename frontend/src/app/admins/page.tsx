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
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingButton from "@/components/LoadingButton";

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: "male" | "female";
  password?: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: "male",
    password: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admin");
      setAdmins(response.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      gender: "male",
      password: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      birthDate: admin.birthDate,
      gender: admin.gender,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAdmin) {
        const { password, ...updateData } = formData;
        await api.patch(`/admin/${editingAdmin.id}`, updateData);
        toast.success("Admin updated successfully! ✨");
      } else {
        if (!formData.password) {
          toast.error("Password is required for new admin");
          return;
        }
        await api.post("/admin/register", formData);
        toast.success("Admin created successfully! 🎉");
      }
      setIsModalOpen(false);
      fetchAdmins();
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

  const openDeleteDialog = (admin: Admin) => {
    setDeletingAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAdmin) return;

    try {
      await api.delete(`/admin/${deletingAdmin.id}`);
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error && 
        error.response && typeof error.response === 'object' && 
        'data' in error.response && error.response.data && 
        typeof error.response.data === 'object' && 
        'message' in error.response.data && 
        typeof error.response.data.message === 'string'
        ? error.response.data.message 
        : "Failed to delete admin";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-700 rounded mb-4 sm:mb-6 animate-shimmer"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 sm:h-20 bg-gray-700 rounded-xl animate-shimmer"
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
            Admin Management
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Manage system administrators and their permissions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Admin Cards - Mobile First */}
      <div className="space-y-4">
        {admins.map((admin) => (
          <div key={admin.id} className="card-dark-hover rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Admin Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {admin.firstName[0]}
                      {admin.lastName[0]}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-semibold text-white truncate">
                    {admin.firstName} {admin.lastName}
                  </div>
                  <div className="text-sm text-gray-300 truncate">
                    {admin.email}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
                    <span>
                      Born: {new Date(admin.birthDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      Joined: {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.gender === "male" ? "badge-info" : "badge-purple"
                  }`}
                >
                  {admin.gender}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(admin)}
                    className="tap-target p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(admin)}
                    className="tap-target p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {admins.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="card-dark rounded-xl p-8 sm:p-12 max-w-md mx-auto">
            <UserIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-300 text-lg sm:text-xl mb-2">
              No admins found
            </p>
            <p className="text-gray-500 text-sm sm:text-base mb-6">
              Create your first admin to get started
            </p>
            <button onClick={openCreateModal} className="btn-primary w-full">
              Add Admin
            </button>
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdmin ? "Edit Admin" : "Create Admin"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="input-dark w-full"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="input-dark w-full"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input-dark w-full"
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Birth Date *
              </label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="input-dark w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Gender *
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                className="select-dark w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {!editingAdmin && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password *
              </label>
              <input
                type="password"
                required={!editingAdmin}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-dark w-full"
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>
          )}

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
              {editingAdmin ? "Update Admin" : "Create Admin"}
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${deletingAdmin?.firstName} ${deletingAdmin?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

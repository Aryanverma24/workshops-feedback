import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiCheck, FiX, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";

type Workshop = {
  id: string;
  workshopName: string;
  collegeName: string;
  instructions: string;
  formActive: boolean;
};

const colorScheme = {
  primary: '#4F46E5',
  secondary: '#6366F1',
  success: '#10B981',
  error: '#EF4444',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  hover: '#F3F4F6',
};

export default function WorkshopListEditor() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Workshop>>({});
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    fetchWorkshops()
  },[]
)
      const fetchWorkshops = async () => {
      const snapshot = await getDocs(collection(db, "workshops"));
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        setLoading(false);
        return {
          id: doc.id,
          workshopName: data.workshopName ?? "",
          collegeName: data.collegeName ?? "",
          instructions: data.instructions ?? "",
          formActive: data.formActive ?? false,
        } as Workshop;
      });
      setWorkshops(list);
    };


  const handleEditClick = (id: string) => {
    setEditMode(id);
    const current = workshops.find((w) => w.id === id);
    setEditData(current || {});
  };

  const handleUpdate = async (id: string) => {
    try {
      const docRef = doc(db, "workshops", id);
      await updateDoc(docRef, editData);
      alert("Workshop updated!");
      setEditMode(null);
    fetchWorkshops()
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update workshop.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
    });
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-[#E5E7EB] to-white"
      >
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mb-4"
        >
          <FiLoader className="w-full h-full text-[#4F46E5]" />
        </motion.div>
        <p className="text-[#4F46E5] font-semibold text-lg">Loading workshops...</p>
      </motion.div>
    );
    }


  return (
    <div className="bg-gradient-to-br pb-2 rounded-xl from-[#E5E7EB] to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-between max-w-5xl mx-auto px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.5 }}
            className="w-12 h-12 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-lg"
          >
            <FiEdit2 className="w-6 h-6 text-white" />
          </motion.div>
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl font-bold text-[#1F2937]"
          >
            Manage Workshops
          </motion.h2>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-6"
      >
        <AnimatePresence>
          {workshops.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              {editMode === w.id ? (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 space-y-4"
                >
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Workshop Name
                    </label>
                    <input
                      name="workshopName"
                      value={editData.workshopName || ""}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-[#F8FAFC] transition-all duration-200"
                      placeholder="Enter workshop name"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      College Name
                    </label>
                    <input
                      name="collegeName"
                      value={editData.collegeName || ""}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-[#F8FAFC] transition-all duration-200"
                      placeholder="Enter college name"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-[#1F2937]">
                      Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={editData.instructions || ""}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] bg-[#F8FAFC] transition-all duration-200 h-40 resize-none"
                      placeholder="Enter instructions"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="formActive"
                        checked={!!editData.formActive}
                        onChange={handleChange}
                        className="w-6 h-6 text-[#10B981] border-[#E5E7EB] rounded focus:ring-[#10B981]"
                      />
                      <label className="ml-4 text-sm font-medium text-[#1F2937]">
                        Form Active
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-6 justify-end">
                    <button
                      onClick={() => setEditMode(null)}
                      className="px-8 py-3 text-sm font-medium text-[#6B7280] bg-[#F8FAFC] rounded-xl hover:bg-[#F3F4F6] transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(w.id)}
                      className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-xl hover:from-[#6366F1] hover:to-[#7C3AED] transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 space-y-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[#1F2937]">{w.workshopName}</h3>
                    <p className="mt-1 text-lg text-[#6B7280]">{w.collegeName}</p>
                  </div>
                  <p className="text-[#6B7280] leading-relaxed">{w.instructions}</p>
                  <div className="flex items-center gap-6">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        w.formActive
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "bg-[#EF4444]/10 text-[#EF4444]"
                      } flex items-center gap-2`}
                    >
                      {w.formActive ? (
                        <>
                          <FiEye className="w-4 h-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiEyeOff className="w-4 h-4" />
                          Inactive
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => handleEditClick(w.id)}
                      className="text-[#4F46E5] hover:text-[#6366F1] transition-colors duration-200 flex items-center gap-2"
                    >
                      <FiEdit2 className="w-5 h-5" />
                      Edit Workshop
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

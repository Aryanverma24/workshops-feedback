import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiCheck, FiLink } from "react-icons/fi";
import { uploadToCloudinary } from "../lib/Cloudinary";
import { useNavigate } from "react-router-dom";

interface CreateWorkshopsProps {
  onFormCreated?: (id: string) => void;
}

const CreateWorkshops: React.FC<CreateWorkshopsProps> = ({ onFormCreated }) => {
  const [collegeName, setCollegeName] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [formActive, setFormActive] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateUrl, setTemplateUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate()

  const courseOptions = [
    "React JS for Beginners",
    "Frontend Development with Tailwind CSS",
    "Introduction to Python",
    "Git and GitHub",
    "Career Guidance & Interview Preparation",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const uploadTemplate = async () => {
    if (!templateFile) {
      alert("Please select a certificate template file first.");
      return;
    }
    setLoading(true);
    try {
      const url = await uploadToCloudinary(templateFile);
      setTemplateUrl(url);
      alert("Template uploaded successfully!");
    } catch (error) {
      alert("Upload failed: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async () => {
    if (!collegeName || !workshopName || !dateTime || !instructions) {
      alert("Please fill in all required fields");
      return;
    }
    if (!templateUrl) {
      alert("Please upload certificate template first.");
      return;
    }

    setLoading(true);
    try {
      const id = uuidv4();
      setFormId(id);

      await setDoc(doc(db, "workshops", id), {
        collegeName,
        workshopName,
        dateTime,
        instructions,
        formActive,
        templateUrl,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        workshopId: id,
      });

      if (onFormCreated) {
        onFormCreated(id);
      }
      alert('Workshop is successfully created')
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      navigate('/')
    } catch (error) {
      alert("Failed to create form: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center mb-8">
            <FiUpload className="text-blue-500 text-4xl mr-4" />
            <h1 className="text-3xl font-bold">Create New Workshop</h1>
          </div>

          <div className="space-y-6">
            {/* College Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter college name"
                />
              </div>
            </div>

            {/* Workshop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workshop Name
              </label>
              <div className="relative">
                <select
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">-- Select Your Course --</option>
                  {courseOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <div className="relative">
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-32 resize-none"
                  placeholder="Enter instructions"
                />
              </div>
            </div>

            {/* Form Activation */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formActive}
                onChange={() => setFormActive(!formActive)}
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Activate Form
              </label>
            </div>

            {/* Template Upload */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Certificate Template (PDF)
                </label>
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center text-green-600"
                    >
                      <FiCheck className="mr-1" />
                      File selected
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="template-upload"
                />
                <label
                  htmlFor="template-upload"
                  className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <FiUpload className="mr-2" />
                  {templateFile ? "Change File" : "Upload PDF Template"}
                </label>
                {templateFile && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCheck className="mr-2 text-green-500" />
                    {templateFile.name}
                  </div>
                )}
                <button
                  onClick={uploadTemplate}
                  disabled={loading || !templateFile}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Uploading..." : "Upload Template"}
                </button>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateForm}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
            >
              {loading ? "Creating form..." : "Create Workshop"}
            </button>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
                >
                  <div className="flex items-center">
                    <FiCheck className="text-green-500 mr-2" />
                    <span>Workshop created successfully!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shareable Link */}
            {formId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Shareable Link</h3>
                  <FiLink className="text-blue-500" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <a
                    href={`${window.location.origin}/form/${formId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all hover:text-blue-700 transition-colors"
                  >
                    {`${window.location.origin}/form/${formId}`}
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateWorkshops;
  
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiDownload, FiEye } from "react-icons/fi";

export default function WorkshopSubmissionsView() {
  type Workshop = { id: string; workshopName?: string; collegeName?: string; [key: string]: any };
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  type Student = {
    name?: string;
    email?: string;
    phone?: string;
    course?: string;
    submittedAt?: any;
    certificateUrl?: string;
    [key: string]: any;
  };
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all workshops
  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const snapshot = await getDocs(collection(db, "workshops"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id, // Use doc.id for filtering
          ...doc.data(),
        }));
        setWorkshops(list);
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
      }
    };
    loadWorkshops();
  }, []);

  // Load students when a workshop is selected
  useEffect(() => {
    if (!selectedWorkshop) return;

    const fetchStudents = async () => {
      setLoading(true);
      console.log(selectedWorkshop)
    
      try {
        const q = query(
          collection(db, "submissions"),
          where("formId", "==", selectedWorkshop) // Must match stored workshopId
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => doc.data());
        setStudents(list);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedWorkshop]);

  if(students)
  console.log(students[0])

  return (
    <motion.div
      className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 text-gray-900"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        📋 Workshop Submissions
      </motion.h2>

      {/* Workshop selector */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <label className="block mb-3 text-sm font-medium text-gray-700">
          Select Workshop:
        </label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out"
            onChange={(e) => setSelectedWorkshop(e.target.value)}
            value={selectedWorkshop}
          >
            <option value="" className="text-gray-500">-- Select Workshop --</option>
            {workshops.map((workshop) => (
              <option 
                key={workshop.id} 
                value={workshop.id}
                className="text-gray-900"
              >
                {workshop.workshopName} – {workshop.collegeName}
              </option>
            ))}
          </select>
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className="flex items-center justify-center p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <motion.p 
                className="mt-4 text-indigo-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading submissions...
              </motion.p>
            </div>
          </motion.div>
        ) : students.length > 0 ? (
          <motion.div
            className="overflow-x-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="bg-indigo-50 rounded-t-xl p-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Student Submissions</h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-50 transition-colors duration-200 ease-in-out"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,"
                        + students.map(s =>
                          Object.values(s).join("")
                        ).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "submissions.csv");
                      document.body.appendChild(link);
                      link.click();
                    }}
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Export CSV
                  </motion.button>
                </div>
              </div>
              <table className="w-full table-auto border-collapse">
                <thead className="bg-indigo-50 text-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Submitted At</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {students.map((s, i) => (
                    <motion.tr
                      key={i}
                      className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{s.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <span className="text-sm text-gray-900 font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {s.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {s.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {s.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {s.submittedAt?.toDate
                          ? s.submittedAt.toDate().toLocaleString()
                          : <span className="text-gray-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.certificateUrl ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-50 transition-colors duration-200 ease-in-out"
                            onClick={() => window.open(s.certificateUrl, '_blank')}
                          >
                            <FiEye className="w-4 h-4 mr-1.5" />
                            <span>View Certificate</span>
                          </motion.button>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Issued
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : selectedWorkshop ? (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FiChevronDown className="mx-auto h-12 w-12 text-gray-400" />
            </motion.div>
            <p className="mt-4 text-gray-500 text-lg font-medium">No submissions yet</p>
            <p className="text-gray-400">Students will appear here once they enroll.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

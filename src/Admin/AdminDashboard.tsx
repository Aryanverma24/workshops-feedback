import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

import Feedbacks from './Feedbacks';
import WorkshopFormCreator from './CreateWorkshops';
import WorkshopSubmissionsView from './WorkshopSubmissionsView';
import WorkshopListEditor from './WorkshopListEditor';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('feedbacks');
  const [showStats, setShowStats] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalWorkshops, setTotalWorkshops] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  useEffect(() => {
    fetchTotalStudents();
    fetchTotalWorkshops();
    fetchTotalFeedbacks();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Users"));
      const students = snapshot.docs
        .map((doc: any) => doc.data())
        .filter((user: any) => user.role === 'student');
      setTotalStudents(students.length);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTotalWorkshops = async () => {
    try {
      const snapshot = await getDocs(collection(db, "workshops"));
      const workshops = snapshot.docs
        .map((doc: any) => doc.data())
        .filter((workshop: any) => workshop.formActive === true);
      setTotalWorkshops(workshops.length);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  const fetchTotalFeedbacks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "submissions"));
      const feedbacks = snapshot.docs
        .map((doc: any) => doc.data());
      setTotalFeedbacks(feedbacks.length);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const renderTab = () => {

    switch (activeTab) {
      case 'feedbacks':
        return <Feedbacks />;
      case 'create':
        return <WorkshopFormCreator />;
      case 'students':
        return <WorkshopSubmissionsView />;
      case 'workshops':
        return <WorkshopListEditor />;
      default:
        return null;
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    setShowStats(true);
  }, [activeTab]);

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900"
          >
            🛠️ Admin Dashboard
          </motion.h1>
          <div className="flex flex-col items-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  await signOut(auth);
                  window.location.href = "/";
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white hover:from-[#DC2626] hover:to-[#EF4444] transition-all duration-300 flex items-center gap-3"
            >
              <FiLogOut className="w-6 h-6" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'feedbacks' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Feedbacks
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'create' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Create Workshop
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'students' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('workshops')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'workshops' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Workshops
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors"
            >
              Toggle Stats
            </button>
          </div>
        </div>

        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Workshops</p>
                  <p className="text-3xl font-bold text-blue-600">{totalWorkshops}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Students</p>
                  <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Feedbacks Received</p>
                  <p className="text-3xl font-bold text-red-600">{totalFeedbacks}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {renderTab()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

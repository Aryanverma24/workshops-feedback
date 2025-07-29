import { useEffect, useState } from "react";
import { collection, getDocs,doc, query, where, orderBy, limit, getDoc } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiMessageSquare, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface Workshop {
  id: string;
  name : String;
  feedback:String;
  learningGoal : String;
  collegeName: string;
  course: string;
  dateTime: string;
  formActive: boolean;
  certificateUrl: string;
  createdBy: string;
}

export default function StudentHomePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totalWorkshops, setTotalWorkshops  ] = useState(0);
  const [userFeedbacks, setUserFeedbacks] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>('');

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "workshops"), where("formActive", "==", true));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workshop[];
        setWorkshops(data);
        setTotalWorkshops(data.length);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
    };
    fetchWorkshops();
    setLoading(false);
  },[]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        const res = userDoc.data();
        if (res?.email) {
          setUserEmail(res.email);
        }
      } else {
        console.log("No user is logged in");
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const fetchUserFeedbacks = async () => {
      if (!userEmail) {
        console.warn("userEmail is not set, skipping feedback fetch");
        return;
      }
  
      setLoading(true);
      try {
        console.log("Querying submissions for email:", userEmail);
  
        const q = query(collection(db, "submissions"), where("email", "==", userEmail));
        const snapshot = await getDocs(q);
  
        console.log("Submission docs snapshot:", snapshot.docs);
  
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setUserFeedbacks(data);
        console.log("Parsed feedbacks:", data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserFeedbacks();
  }, [userEmail]);
  
  console.log(userFeedbacks);

  const handleFormRedirect = (workshopId: string) => {
    navigate(`/form/${workshopId}`);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
  <h1 className="text-4xl font-bold text-blue-800">
    🎓 Student Dashboard
  </h1>

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


        {/* Workshops Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-2">
              <FiCheckCircle className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Total Workshops</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-800">{totalWorkshops}</h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-2">
              <FiCheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Active Workshops</span>
            </div>
            <h3 className="text-2xl font-bold text-green-800">
              {workshops.filter(w => w.formActive).length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-2">
              <FiCheckCircle className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Upcoming Workshops</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-800">
              {workshops.filter(w => new Date(w.dateTime) > new Date()).length}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center mb-2">
              <FiCheckCircle className="w-6 h-6 text-purple-500 mr-2" />
              <span className="text-sm text-gray-600">Past Workshops</span>
            </div>
            <h3 className="text-2xl font-bold text-purple-800">
              {workshops.filter(w => !w.formActive).length}
            </h3>
          </motion.div>
        </div>



        Recent Feedbacks
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🗨️ Your Recent Feedbacks
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4">
            {loading ? (
              <div className="flex justify-center items-center gap-2 text-gray-600">
                <FiLoader className="animate-spin" />
                <span>Loading feedbacks...</span>
              </div>
            ) : userFeedbacks.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                <FiMessageSquare className="text-4xl mx-auto mb-2 text-gray-300" />
                <p className="text-gray-600">No feedbacks submitted yet.</p>
                <p className="text-sm mt-1 text-gray-500">Complete workshops to see your feedbacks here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-lg">{feedback?.course}</h3>
                        <span className="text-sm text-gray-500">
                          {feedback.submittedAt?.seconds
                            ? new Date(feedback.submittedAt.seconds * 1000).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                      {feedback.email && (
                        <div className="mt-2">
                          <h4 className="font-medium mb-1">Reviewer:</h4>
                          <p className="text-gray-700">{feedback.email}</p>
                        </div>
                      )}
                      {feedback.certificateUrl && (
                        <Link to={feedback.certificateUrl}>
                        <button className="bg-blue-600 mb-5 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                          View Certificate
                        </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workshop List */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          📋 Active Workshops
        </h2>

        {loading ? (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <FiLoader className="animate-spin" />
            <span>Loading workshops...</span>
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <FiAlertCircle className="text-4xl mx-auto mb-2" />
            <p>No active workshops found at the moment.</p>
            <p className="text-sm mt-1">Please check back later or contact your instructor.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition duration-300 ease-in-out flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <h3 className="text-xl font-semibold text-indigo-700 mb-1">
                    {workshop.course}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>College:</strong> {workshop.collegeName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date & Time:</strong>{" "}
                    {new Date(workshop.dateTime).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                    {workshop.learningGoal}
                  </p>
                </div>

                <button
                  onClick={() => handleFormRedirect(workshop.id)}
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded transition-all duration-200"
                >
                  Fill Feedback Form
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

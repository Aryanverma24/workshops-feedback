import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { getDocs, orderBy, query, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiUser, FiMail, FiClock } from 'react-icons/fi';

const Feedbacks = () => {
  interface Feedback {
  id: string;
  name?: string;
  email: string;
  feedback: string;
  submittedAt?: { toDate: () => Date };
}

const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "submissions"),
          orderBy("submittedAt", "desc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const feedbackList = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Feedback))
            .filter((item): item is Feedback => item.feedback !== undefined);
          setFeedbacks(feedbackList);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError(true);
      }
    };
    fetchFeedbacks();
  }, []);

  const loadingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const feedbackVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (loading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={loadingVariants}
        className="flex flex-col items-center justify-center min-h-[300px] p-8"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mb-4 border-4 border-blue-500 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center"
        >
          Fetching feedbacks... This may take a moment.
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[300px] p-8"
      >
        <FiMessageSquare className="text-red-500 text-4xl mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 text-center">
          We couldn't fetch the feedbacks. Please try refreshing the page.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiMessageSquare className="mr-2 text-blue-500" />
            Student Feedbacks
          </h2>
          <p className="text-gray-600 mt-2">
            View and manage student feedbacks from recent workshops
          </p>
        </motion.div>

        {feedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 text-center"
          >
            <FiMessageSquare className="text-gray-300 text-4xl mb-4" />
            <p className="text-gray-600">
              No feedbacks have been submitted yet. Once students submit their
              feedback, they will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {feedbacks.map((fb, _index) => (
                <motion.div
                  key={fb.id}
                  variants={feedbackVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {fb.name || "Anonymous"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <FiMail className="text-gray-400" />
                          <span>{fb.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiClock className="text-gray-400" />
                        <span>
                          {fb.submittedAt?.toDate?.().toLocaleDateString() || "No date"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageSquare className="text-blue-500" />
                        <span className="font-semibold text-gray-900">Feedback:</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {fb.feedback}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
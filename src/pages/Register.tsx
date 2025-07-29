import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiBookOpen } from "react-icons/fi";
import { FaUserGraduate, FaUserTie, FaSchool } from "react-icons/fa";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("admin");
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [college, setCollege] = useState("");
    const [program, setProgram] = useState("");
    const [year, setYear] = useState("");
    const [phone, setPhone] = useState("");
    const programOptions = ["B.Tech", "BCA", "BBA", "MBA", "MCA", "Diploma"];
    const yearOptions = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        }

        if (role === "student" && (!name || !college || !program || !year || !phone)) {
            setError("Please fill all student fields");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            if (role === "student") {
                await setDoc(doc(db, "Users", user.uid), {
                    uid: user.uid,
                    name,
                    college,
                    program,
                    year,
                    phone,
                    email,
                    role: "student",
                    createdAt: new Date(),
                });
                navigate("/studentHomePage");
            } else {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                    createdAt: new Date().toString(),
                    role: "admin",
                });
                navigate("/admin/dashboard");
            }
        } catch (error: any) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
            setEmail('');
            setPassword('');
            setError('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
            >
                <motion.form
                    onSubmit={handleRegister}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Role Toggle */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-2 mb-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRole("admin")}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                role === "admin"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            <FaUserTie className="inline-block mr-2" />
                            Admin
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRole("student")}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                role === "student"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            <FaUserGraduate className="inline-block mr-2" />
                            Student
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {role === "admin" ? "Admin Register" : "Student Register"}
                        </h2>
                        <p className="text-gray-500">Create your account</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-4"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Student Fields */}
                    {role === "student" && (
                        <>
                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <FiUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <FaSchool className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="College Name"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    required
                                    className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <FiBookOpen className="absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={program}
                                    onChange={(e) => setProgram(e.target.value)}
                                    required
                                    className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Program</option>
                                    {programOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <FiBookOpen className="absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                    className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Year</option>
                                    {yearOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative"
                            >
                                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </motion.div>
                        </>
                    )}

                    <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                    >
                        <FiMail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                    >
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </motion.div>
{role === "admin" ? (
    <motion.button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {loading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering Admin...
            </>
        ) : (
            "Register as Admin"
        )}
    </motion.button>
) : (
    <motion.button
        type="button"
        onClick={handleRegister}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {loading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering Student...
            </>
        ) : (
            "Register as Student"
        )}
    </motion.button>
)}

                </motion.form>
            </motion.div>
        </div>
    );
};

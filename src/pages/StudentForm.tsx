import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { db, auth } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const courseOptions = [
  "React JS for Beginners",
  "Frontend Development with Tailwind CSS",
  "Introduction to Python",
  "Git and GitHub",
  "Career Guidance & Interview Preparation",
];

export default function StudentForm() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState<any>(null);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    course: "",
    learningGoal: "",
    feedback: "",
    phone: "",
    email: "",
  });

  const validateFields = () => {
    const newErrors = {
      name: !name.trim() ? "Name is required." : "",
      course: !course ? "Please select a course." : "",
      learningGoal: !learningGoal.trim() ? "Learning goal is required." : "",
      feedback: !feedback.trim() ? "Feedback is required." : "",
      phone: !/^\d{10}$/.test(phone) ? "Enter a valid 10-digit phone number." : "",
      email: !/^[\w.-]+@[\w.-]+\.\w+$/.test(email) ? "Enter a valid email address." : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => val === "");
  };

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!formId) return;
      const ref = doc(db, "workshops", formId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setWorkshop(snap.data());
      } else {
        alert("Invalid or expired form link.");
      }
    };

    const fetchStudentName = () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
        }
      });
    };

    fetchWorkshop();
    fetchStudentName();
  }, [formId]);

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      const response = await axios.post("https://workshops-feedback.vercel.app/api/send-otp", {
        phone: "+91" + phone,
      });
      setConfirmationResult(response.data);
      alert("OTP sent successfully! Please check your phone.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post("https://workshops-feedback.vercel.app/api/verify-otp", {
        phone: "+91" + phone,
        otp: otp,
      });
      if (!response.data) {
        alert("Invalid OTP. Please try again.");
        return;
      }
      setOtp("");
      setPhoneVerified(true);
      alert("Phone verified successfully.");
    } catch (error) {
      alert("Failed to verify phone. Please try again.");
    }
  };

  const sendEmailOtp = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      const res = await axios.post("https://workshops-feedback.vercel.app/api/send-email-otp", {
        email,
      });
      setEmailOtp(res.data.otp);
      alert(`Email OTP sent to ${email}. Please check your inbox.`);
      setEmailVerified(false);
    } catch (error) {
      console.log(error);
      alert("Failed to send email OTP. Please try again.");
    }
  };

  const verifiedEmailOtp = async () => {
    if (!emailOtp) {
      alert("Please enter the email OTP.");
      return;
    }
    try {
      const res = await axios.post("https://workshops-feedback.vercel.app/api/verify-email-otp", {
        email,
        otp: emailOtp,
      });
      if (!res.data) {
        alert("Invalid Email OTP. Please try again.");
        return;
      }
      setEmailOtp("");
      setEmailVerified(true);
      alert("Email verified successfully.");
    } catch (error) {
      console.log(error);
      alert("Failed to verify email OTP. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateFields();
    if (!isValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (!emailVerified || !phoneVerified) {
      alert("Please verify both phone and email.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "submissions"), {
        formId,
        name,
        course,
        learningGoal,
        feedback,
        email,
        phone,
        submittedAt: serverTimestamp(),
      });

      alert("Feedback submitted successfully!");
      navigate("/thank-you", {
        state: {
          name,
          workshopName: workshop.workshopName,
          collegeName: workshop.collegeName,
          dateTime: new Date(workshop.dateTime).toLocaleString(),
          email,
          phone,
          formId,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!workshop) return <p className="p-4 text-center">Loading workshop details...</p>;
  if(confirmationResult) return <> <p> This is confirmation Result</p></>
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-gray-200"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700">{workshop.workshopName}</h1>
          <p className="text-gray-500">{workshop.collegeName}</p>
          <p className="text-sm text-gray-400 mt-1">{new Date(workshop.dateTime).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className={`mt-1 block w-full px-4 py-3 border rounded-xl shadow-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-green-400 outline-none`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-green-400 outline-none"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courseOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Learning Goal */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Learning Goal</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="What do you want to learn?"
              required
            />
          </div>

          {/* Feedback */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Your Feedback</label>
            <textarea
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you thought..."
              required
            />
          </div>

          {/* Phone Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              disabled={phoneVerified}
            />
            {!phoneVerified && (
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Send OTP
                </button>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border px-3 py-2 rounded-md"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="text-sm text-green-600 font-semibold hover:underline"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          {/* Email Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={emailVerified}
            />
            {!emailVerified && (
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={sendEmailOtp}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Send Email OTP
                </button>
                <input
                  type="text"
                  placeholder="Enter Email OTP"
                  className="w-full border px-3 py-2 rounded-md"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={verifiedEmailOtp}
                  className="text-sm text-green-600 font-semibold hover:underline"
                >
                  Verify Email OTP
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>

        <div id="recaptcha-container" />
      </form>
    </div>
  );
}

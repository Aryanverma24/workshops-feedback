import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCertificate, FaUsers, FaUserTie, FaUserGraduate } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-black/70 flex flex-col items-center justify-center" 
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'multiply'
          }}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-yellow-300 text-center px-4"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Workshop Feedback System
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex gap-4 justify-center mb-4">
              <FaGraduationCap className="text-yellow-300 text-2xl" />
              <FaCertificate className="text-blue-300 text-2xl" />
              <FaUsers className="text-blue-300 text-2xl" />
            </div>
            Enhance your learning experience with our comprehensive workshop feedback system
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-700 text-yellow-300 px-8 py-3 rounded-lg font-semibold transition-all hover:bg-blue-800 flex items-center gap-2"
              >
                <FaUserTie className="text-lg" />
                Go to Login
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-700 text-yellow-300 px-8 py-3 rounded-lg font-semibold transition-all hover:bg-green-800 flex items-center gap-2"
              >
                <FaUserGraduate className="text-lg" />
                Register User
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div> 
  )};

export default Home;

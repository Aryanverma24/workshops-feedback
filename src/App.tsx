import { useEffect, useState } from "react"
import { Routes , Route, BrowserRouter} from "react-router-dom"
import Home from "./pages/Home"
import Register from "./pages/Register"
import StudentForm from "./pages/StudentForm"
import CreateWorkshops from "./Admin/CreateWorkshops"
import StudentHomePage from "./pages/StudentHomePage"
import Certificate from "./pages/Certificate"
import {auth, db} from "./lib/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"
import AdminDashboard from "./Admin/AdminDashboard"
import Login from "./pages/Login"


function App() {

  const [userRole, setUserRole] = useState('Student');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const unscribe = onAuthStateChanged(auth, (currUser) =>{
      if(currUser?.uid){
        setUserId(currUser.uid);
        console.log("User is logged in:", currUser.email);
      }
      else{
        setUserId('');
        console.log("No user is logged in");
      }
    })
    return () => unscribe();
  },[])

  useEffect(() => {
    const fetchRole = async()=>{
      if(userId){
        const userDoc = await getDoc(doc(db,"Users",userId));
      if(userDoc.exists()){
        setUserRole(userDoc.data().role);
      }
      else{
        console.log("User does not exist");
      }
      }
    }
    fetchRole();
  },[userId])

  console.log(userRole);
  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/studentHomePage" element={<StudentHomePage />} />
      <Route path="/admin/create-workshop" element={(userRole==="admin" )? <CreateWorkshops />: <Home />} />
      <Route path="/form/:formId" element={<StudentForm />} />
      <Route path="/thank-you" element={<Certificate />} />

      <Route path="/admin/dashboard" element={(userRole === "admin") ? <AdminDashboard /> : <Home /> } />
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

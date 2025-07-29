import { useLocation, useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";
import axios from "axios";
import { db } from "../lib/firebase";
import { doc, getDoc , collection , serverTimestamp, addDoc, query, where, getDocs, setDoc,  } from "firebase/firestore";

export default function Certificate() {

  const location = useLocation();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    if (!location.state) {
        alert("No certificate data found. Redirecting to home.");
        navigate("/");
        return null;
    }

  const { name, workshopName , collegeName, dateTime , email , phone , formId } = location.state || {};

  const [certificateUrl, setCertificateUrl] = useState('');


  
const sendEmailCertificate= async()=>{
    try{
        const response = await axios.post('https://workshops-feedback.vercel.app/send-certificate-to-email',{
            email: email,
            certificateUrl: certificateUrl,
            workshopName : workshopName,
            name:name
        })
        if(response.status === 200){
            alert(`Certificate sent to email ${email} successfully`)
        }
        else{
            alert("Failed to send certificate to email.");
    }
}
    catch(error){
        console.error('Error sending to email: ', email, " ", error);
        alert("Failed to send certificate to email.");
    }
}
 
    useEffect(() => {
        if (!name || !workshopName || !collegeName || !dateTime || !email || !phone) {
        alert("Invalid certificate data. Redirecting to home.");
        navigate("/");
        return;
        }

        // Simulate fetching certificate URL
        const fetchCertificate = async () => {
        try {
            // Replace with actual API call to fetch certificate URL
            const url = await axios.post(`http://localhost:5000/generate-certificate`, {             
                    name : name,
                    workshopName : workshopName,                       
                    provider: collegeName ,
                    date: dateTime,       
            });

            const baseurl = url.data.url;
            setCertificateUrl(url.data.url);
            console.log("Certificate URL:", url);
            
            const certificateDoc = await getDoc(doc(db, "certificates", baseurl));

            if (certificateDoc.exists()) {  
                console.log("Certificate already exists in Firestore");
                return;
            }   
            console.log("Certificate does not exist, saving to Firestore");
            // Save certificate data to Firestore
            await addDoc(collection(db,"certificates"),{
                name:name,
                workShopName : workshopName,
                provider: collegeName,
                date: dateTime,
                email: email,   
                phone: phone,
                certificateUrl: baseurl,
                createdAt: serverTimestamp(),
            })
        } catch (error) {
            console.error("Error fetching certificate:", error);
        }
        };
    
        fetchCertificate();
        setLoading(false);
    }
, [ name, workshopName, collegeName, dateTime, email, phone, navigate ]);

console.log(certificateUrl)
 const handleDownload = async () => {
  try {
    const response = await axios.get(certificateUrl, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'image/png' });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `certificate-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download certificate.");
  }
};

const addUrlToSubmission = async () => {
  if (!certificateUrl) return;

  try {
    const q = query(
      collection(db, "submissions"),
      where("email", "==", email),// Make sure this matches exactly with Firestore field
    );

    console.log(q)
    
    const snapshot = await getDocs(q);
    console.log(snapshot)

    if (snapshot.empty) {
      console.warn("❌ No matching submission found.");
      return;
    }

    // Assuming only one submission per user per workshop
    const docRef = snapshot.docs[0].ref;

    await setDoc(docRef, { certificateUrl }, { merge: true });

    console.log("✅ Certificate URL successfully added to submission.");
  } catch (error) {
    console.error("🔥 Error updating submission:", error);
  }
};


useEffect(() => {
  if (certificateUrl) {
    sendEmailCertificate();
    addUrlToSubmission();
  }
}, [certificateUrl]);



  return (
    <>

    {!certificateUrl && 
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-700">Generating your certificate...</h2>
            <p className="text-gray-500 mt-2">This might take a few seconds. Grab a chai ☕️ and relax!</p>
        </div>
     }

    {certificateUrl && (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-700 mb-4">🎉 Congratulations, {name}!</h1>
      <p className="mb-2 text-gray-600">You successfully completed <strong>{workshopName}</strong></p>
      <img
        src={certificateUrl}
        alt="Certificate"
        className="w-full max-w-3xl border shadow-lg rounded"
        />
      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
        Download Certificate
      </button>
    </div>
    ) 
        }
          </>
  );
}

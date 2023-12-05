import { useEffect, useState } from "react";
import Footer from "../../components/widget/Footer";
import Nav from "../../components/widget/Nav";
import Sidebar from "../../components/widget/Sidebar";
import { getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Protected({ Component }) {
  const [isUser, setIsUser] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let userInfo = getCurrentUser()

    if (!userInfo) {
      navigate('/')
    }

    setIsUser(true)
  }, [])

  return (
    <>
      {
        isUser &&
        <div className="min-h-screen bg-blue-gray-50/50">
          <Sidebar />

          <div className="p-4 xl:ml-80">
            <Nav />

            <Component />

            <div className="text-blue-gray-600">
              <Footer />
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Protected;
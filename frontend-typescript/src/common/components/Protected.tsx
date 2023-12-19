import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../../services/authService"
import Sidebar from "../../components/widget/Sidebar"
import Nav from "../../components/widget/Nav"
import Footer from "../../components/widget/Footer"

type ProtectedProps = {
  Component: React.ComponentType
}

const Protected = ({ Component }: ProtectedProps) => {
  const [isUser, setIsUser] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    let userInfo = getCurrentUser()

    if (Object.keys(userInfo).length == 0) {
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
  )
}

export default Protected

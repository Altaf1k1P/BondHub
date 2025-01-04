import Navbar from "./component/Header/Navbar.jsx"
import { Outlet } from "react-router-dom"
function App() {
 

  return (
    <>
    <header className="fixed-top">
       <Navbar />
    </header>
    <main className="position-absolute top-50 start-50 translate-middle">
       <Outlet />
    </main>
     
     
     </>
  )
}

export default App

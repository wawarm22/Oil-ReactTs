import { BrowserRouter } from "react-router-dom"
import WebRoute from "../routes/Route"
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "../hook/context/UserContext";


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <WebRoute />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App

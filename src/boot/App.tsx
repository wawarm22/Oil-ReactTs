import { BrowserRouter } from "react-router-dom"
import WebRoute from "../routes/Route"
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "../hook/context/UserContext";
import 'react-toastify/dist/ReactToastify.css';
import CustomToastContainer from "../app/component/CustomToastContainer";
import { SocketListener, SocketProvider } from "../hook/socket";


function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <SocketListener />
        <BrowserRouter>
          <CustomToastContainer />
          <WebRoute />
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  )
}

export default App

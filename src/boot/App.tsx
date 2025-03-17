import { BrowserRouter } from "react-router-dom"
import WebRoute from "../routes/Route"
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <BrowserRouter>
      <WebRoute />
    </BrowserRouter>
  )
}

export default App

import { Routes, Route } from "react-router-dom";
import "./App.css";
import Chat from "./Chat";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<PrivateRoute><Chat /></PrivateRoute> } />
      </Routes>
    </div>
  );
}

export default App;

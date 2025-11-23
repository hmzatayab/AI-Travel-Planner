import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "./components/ui/sonner";
import { UserRedirectWrapper } from "./components/private/UserProtectWrapper";

function App() {
  return (
    <Router>
      <MainLayout />
      <Toaster />
    </Router>
  );
}

function MainLayout() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserRedirectWrapper><Login /></UserRedirectWrapper>} />
        <Route path="/register" element={<UserRedirectWrapper><Register /></UserRedirectWrapper>} />
      </Routes>
    </>
  );
}

export default App;

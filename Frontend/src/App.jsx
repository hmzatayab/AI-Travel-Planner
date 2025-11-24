import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "./components/ui/sonner";
import { UserProtectWrapper, UserRedirectWrapper } from "./components/private/UserProtectWrapper";
import Profile from "./pages/Profile";
import Itinerarie from "./pages/Itinerarie";
import Pricing from "./pages/Pricing";

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
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<UserProtectWrapper><Profile /></UserProtectWrapper>} />
        <Route path="/itinerarie" element={<UserProtectWrapper><Itinerarie /></UserProtectWrapper>} />
        <Route path="/login" element={<UserRedirectWrapper><Login /></UserRedirectWrapper>} />
        <Route path="/register" element={<UserRedirectWrapper><Register /></UserRedirectWrapper>} />
      </Routes>
    </>
  );
}

export default App;

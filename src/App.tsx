import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Layout from "./Layout";
import About from "./pages/About/About";
import APP from "./pages/app/APP";
import Docs from "./pages/DOCS/Docs";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<Home />}
          />
          <Route
            path="about"
            element={<About />}
          />
          <Route
            path="docs"
            element={<Docs />}
          />
        
        </Route>
          <Route
            path="/app"
            element={<APP />}
          />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App

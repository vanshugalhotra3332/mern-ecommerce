import "./App.css";
import Header from "./components/layout/Header/Header.js";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/layout/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Footer />
      </Router>
    </div>
  );
}

export default App;

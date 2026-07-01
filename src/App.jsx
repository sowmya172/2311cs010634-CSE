import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PriorityInbox from "./pages/PriorityInbox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/priority" element={<PriorityInbox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
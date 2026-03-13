import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NodeDetail from "./components/NodeDetail";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/nodo/:id" element={<NodeDetail />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
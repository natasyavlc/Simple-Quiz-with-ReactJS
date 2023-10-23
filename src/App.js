import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Survey from './pages/Survey';
import EndSurvey from './pages/EndSurvey';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Survey />}>
        {/* <Route index element={<Home />} /> */}
        <Route path="/endsurvey" element={<EndSurvey />} />
        {/* <Route path="contact" element={<Contact />} /> */}
        {/* <Route path="*" element={<NoPage />} /> */}
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;

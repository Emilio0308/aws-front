import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Loading from "./components/Loading";
import { Suspense, lazy } from "react";
import { startservices } from "./utils/backend";
const TrackMedia = lazy(() => import("./pages/TrackMedia"));

function App() {
  // startservices()
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/track-media-dashboard"
          element={
            <Suspense fallback={<Loading />}>
              <TrackMedia />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;

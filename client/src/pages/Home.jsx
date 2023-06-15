import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import HomeGame from "../components/Game/Game.jsx";
import LevelSelection from "../components/Game/LevelSelection.jsx";

function Home() {
  return (
      <div className="main-bg my-auto">
          <div className="m-auto max-w-7xl">
              <Navbar />
              <LevelSelection />
          </div>
      </div>
  );
}

export default Home;

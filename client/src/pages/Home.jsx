import "../styles/Home.css";
import Navbar from "../components/Home/Navbar.jsx";
import HomeGame from "../components/Home/HomeGame.jsx";
import LevelSelection from "../components/Home/LevelSelection.jsx";

function Home() {
  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
            <LevelSelection />
        </div>
      </div>
    </>
  );
}

export default Home;

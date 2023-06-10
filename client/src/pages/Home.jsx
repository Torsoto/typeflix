import "../styles/Home.css";
import Navbar from "../components/Home/Navbar.jsx";
import HomeGame from "../components/Home/HomeGame.jsx";

function Home() {
  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <HomeGame />
        </div>
      </div>
    </>
  );
}

export default Home;

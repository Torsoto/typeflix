import "../styles/Home.css";
import Navbar from "../components/Home/Navbar.jsx";
import HomeHero from "../components/Home/HomeHero.jsx";

function Home() {
  return (
    <>
      <div className="main-bg">
        <div className="h-[90%] m-auto max-w-7xl">
          <Navbar />
          <HomeHero />
        </div>
      </div>
    </>
  );
}

export default Home;

import "../styles/Home.css";
import Navbar from "../components/UI/Navbar.jsx";
import LevelSelection from "../components/Game/LevelSelection.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import {useContext} from "react";

function Home() {
    const { gradientColor } = useContext(AuthContext);

    const style = {
        backgroundColor: 'black',
        backgroundImage: `url("/src/assets/bg-texture.png"), linear-gradient(170deg, ${gradientColor} 0%, #000000 100%)`,
        backgroundRepeat: 'repeat, no-repeat',
        backgroundBlendMode: 'normal',
        backgroundSize: 'auto, cover',
        height: '100vh',
        width: '100vw',
        transformOrigin: 'top left',
    };


    return (
      <div className="my-auto" style={style}>
          <div className="m-auto max-w-7xl">
              <Navbar />
              <LevelSelection />
          </div>
      </div>
  );
}

export default Home;

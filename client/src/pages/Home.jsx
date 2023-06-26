import "../styles/Home.css";
import "../styles/App.css";
import Navbar from "../components/UI/Navbar.jsx";
import LevelSelection from "../components/Game/LevelSelection.jsx";
import AuthContext from "../components/context/AuthContext.jsx";
import { useContext } from "react";

function Home() {
    const { gradientColor } = useContext(AuthContext);

    const style = {
        backgroundColor: `${gradientColor}`,
        backgroundBlendMode: 'normal',
        backgroundSize: 'auto, cover',
        minHeight: '100vh',
        width: '100vw',
        transformOrigin: 'top left',
    };


    return (
        <div className="my-auto" style={style}>
            <Navbar />
            <div className="m-auto max-w-7xl">
                <LevelSelection />
            </div>
        </div>
    );
}

export default Home;

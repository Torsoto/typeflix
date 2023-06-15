import logo from "../../assets/wide-logo.svg";

const LogoNav = () => {
  return (
    <nav className="flex items-center justify-between p-6 bg-transparent">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>
    </nav>
  );
};

export default LogoNav;

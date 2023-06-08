import { AiOutlineFieldTime } from "react-icons/ai";
import gangster1 from "../../assets/ganster-lv1.png";

const HomeHero = () => {
  return (
    <div className="h-[85%] mx-auto grid place-items-center text-white ">
      <div className="text-2xl text-center">
        <p>Level 1</p>
      </div>
      <div>
        <img
          src={gangster1}
          alt="pixel image of low level thug"
          className="w-[200px] stance mr-8"
        />
      </div>
      <div>
        <div className="max-w-[1200px]  overflow-hidden flex items-center text-2xl m-auto opacity-70">
          <p className="p-4 leading-loose text-justify line-clamp-3">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit esse molestie consequat, vel illum dolore eu feugiat
            nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi. Lorem ipsum dolor sit amet,
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          {" "}
          <AiOutlineFieldTime size={35} className="ml-4" />
          <p className="text-xl">54 WPM</p>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;

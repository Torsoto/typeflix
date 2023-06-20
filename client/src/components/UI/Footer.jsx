import React, { useContext } from 'react'
import { MdOutlineSchool } from "react-icons/md"
import { FaGithubSquare, FaLinkedin, FaReact } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import AuthContext from "../context/AuthContext";

export const Footer = () => {
    const { gradientColor } = useContext(AuthContext);

    const style = {
        backgroundColor: `${gradientColor}`
    };

    return (
        <div style={style} className="flex flex-col items-center justify-center w-full px-4 pt-2 pb-4 mx-auto text-white">
            <div className="flex items-center justify-center gap-6 mt-2 ">
                <a
                    href="https://github.com/Torsoto/typeflix"
                    target={"_blank"}
                    rel="noreferrer"
                    alt="Github icon"
                >
                    <FaGithubSquare
                        size={30}
                        className="transition-all duration-300 ease-in-out hover:scale-125"
                        title="Github"
                    />
                </a>
            </div>
            <div className="pt-1 ">
                <p className="flex gap-2 text-gray-500 place-content-center">
                    {"Erstellt mit"}
                    <FaReact
                        size={24}
                        className="text-gray-500 "
                        title="React"
                    />{" "}
                    |
                    <SiTailwindcss
                        className="text-gray-500 "
                        size={24}
                        title="Tailwind CSS"
                    />
                </p>

                <p className="flex gap-2 tracking-tight text-center text-gray-500 ">
                    © 2023 Torsoto, d3vote, Yunusk40 and YusufYrkl
                </p>
            </div>
        </div>
    );
};

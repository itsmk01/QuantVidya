import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";

const BackButton = ({ to = "/", label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="text-richblack-5 mt-2 flex flex-row gap-2 place-self-start justify-center items-center cursor-pointer hover:text-blue-100 transition-all duration-200"
    >
      <FaArrowCircleLeft size={20} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;

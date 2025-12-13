import React from "react";
import IconBtn from "./IconButton";

const ConfirmationModal = ({ modalData }) => {
  
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white/10 backdrop-blur-sm">
      <div className="max-w-[500px] flex flex-col gap-4 rounded-md bg-richblack-900 border border-richblack-100 p-6 shadow-lg">
        <p className="text-2xl font-inter font-bold text-richblack-5">
            {modalData?.text1}
        </p>
        <div className="font-semibold leading-6 mb-2 text-richblack-200">
            {modalData?.text2}
        </div>
        <div className="flex gap-4">
          <IconBtn
            text={modalData?.btn1text}
            onclick={modalData?.btn1handler}
            customClasses={""}
            variant={modalData?.variant}
          >
            {modalData?.btn1Icon}
          </IconBtn>
          <button
            className="bg-richblack-200 text-richblack-900 flex items-center cursor-pointer gap-x-2 
                                rounded-md py-2 px-5 font-semibold hover:bg-richblack-300 hover:scale-105 transition-all duration-300"
            onClick={modalData?.btn2handler}
          >
            {modalData?.btn2text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

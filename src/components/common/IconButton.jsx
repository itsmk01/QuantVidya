export default function IconBtn({
    text,
    onclick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
    variant = "yellow" // Changed: default to yellow, let parent control variant
  }) {
    
    // Define color schemes based on variant
     
    const getColorClasses = () => {
      if (variant === "delete" || variant === "red") {
        return outline 
          ? "border border-red-500 bg-transparent text-red-500 hover:bg-red-50" 
          : "bg-red-500 text-white hover:bg-red-600";
      }
      // Default yellow variant
      return outline 
        ? "border border-yellow-50 bg-transparent text-yellow-50 hover:text-richblack-900 hover:bg-yellow-100" 
        : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100";
    };
    
    return (
      <button
        disabled={disabled}
        onClick={onclick}
        className={`flex items-center cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold 
        hover:scale-105 transition-all duration-300 ${getColorClasses()} ${customClasses}`}
        type={type}
      >
        {children ? (
          <>
            {children}
            <span>{text}</span>
          </>
        ) : (
          text
        )}
      </button>
    )
  }
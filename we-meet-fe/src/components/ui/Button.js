export function Button({
  children,
  variant = "default",
  disabled,
  onClick,
  className = "",
}) {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    outline: "border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}

export default function Input({
  type,
  label,
  value,
  onChange,
  placeholder,
  showVisibilityToggle,
  togglePasswordVisibility,
  error,
  className,
  readOnly
}) {
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="input-wrapper">
        {label && <label className="input-label">{label}</label>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${className}`}
          readOnly={readOnly}
        />
        {showVisibilityToggle && (
          <span
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          >
            <i
              className={
                type === "password" ? "fas fa-eye" : "fas fa-eye-slash"
              }
            ></i>
          </span>
        )}
      </div>
    </div>
  );
}

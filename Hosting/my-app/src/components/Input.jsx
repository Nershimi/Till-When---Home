import Button from "./Button";

export default function Input({
  type,
  label,
  value,
  onChange,
  placeholder,
  showVisibilityToggle,
  togglePasswordVisibility,
  error,
}) {
  return (
    <div>
      {error && <p>{error}</p>}
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {showVisibilityToggle && (
        <Button type="button" onClick={togglePasswordVisibility}>
          Show/Hide
        </Button>
      )}
    </div>
  );
}

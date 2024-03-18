export default function Button({ type, onClick, children, className }) {
  return (
    <button type={type} onClick={onClick} className={`button ${className}`}>
      {children}
    </button>
  );
}

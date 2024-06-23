import { useRef, useEffect } from "react";
import Button from "./Button.jsx";

export default function Dialog({ children, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  return (
    <dialog ref={dialogRef}>
      <p>{children}</p>
      <form method="dialog">
        <Button onClick={onClose}>Ok</Button>
      </form>
    </dialog>
  );
}

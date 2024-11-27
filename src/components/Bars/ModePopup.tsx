import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/navigation";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, PreMode } from "@/types/types";
import style from "@/styles/Bars/ModePopup.module.css";

const ModePopup: React.FC<{
  onClose: () => void;
  anchorElement: HTMLElement | null;
}> = ({ onClose, anchorElement }) => {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const setPreMode = useGeneralStore((state) => state.setPreMode);

  const handleSelect = (mode: string) => {
    setClientMode(ClientMode.connection);
    setPreMode(mode === ClientMode.user ? PreMode.user : PreMode.supplier);
    onClose();
    router.push("/login");
  };

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorElement &&
        !anchorElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, anchorElement]);

  // Early return if the anchor element is missing
  if (!anchorElement) return null;

  // Calculate the position of the popup relative to the anchor element
  const { bottom, left, width } = anchorElement.getBoundingClientRect();

  const popupStyle: React.CSSProperties = {
    position: "absolute",
    top: `${bottom + window.scrollY}px`,
    left: `${left + window.scrollX}px`,
    minWidth: `${width}px`,
    zIndex: 9999, // Ensure popup appears above all elements
  };

  // Use React Portal to render the popup at the root level
  return ReactDOM.createPortal(
    <div className={style.popup} style={popupStyle} ref={popupRef}>
      <button onClick={() => handleSelect(ClientMode.user)}>לקוח</button>
      <button onClick={() => handleSelect(ClientMode.supplier)}>ספק</button>
    </div>,
    document.body // Mount the popup directly onto the body element
  );
};

export default ModePopup;

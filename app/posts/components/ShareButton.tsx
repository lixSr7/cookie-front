"use client";
import React from "react";
import { Share2 as ShareIcon } from "@geist-ui/icons";

/**
 * Componente para manejar el botón de compartir.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onClick - Función que se ejecuta al compartir.
 * @returns {JSX.Element} - Elemento del botón de compartir.
 */
function ShareButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <ShareIcon
      className="w-6 h-6 cursor-pointer opacity-60"
      onClick={onClick}
    />
  );
}

export default ShareButton;

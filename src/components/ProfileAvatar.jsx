import React from "react";

const API_URL = "https://xplorra-production.up.railway.app";

export default function ProfileAvatar({
  user,
  size = 38,
  onClick,
}) {
  const imageUrl =
    user?.foto && user.foto.trim() !== ""
      ? `${API_URL}/uploads/${user.foto}`
      : null;

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        background: "#d96a4f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span
          className="material-symbols-outlined"
          style={{
            color: "#fff",
            fontSize: size * 0.55,
          }}
        >
          person
        </span>
      )}
    </div>
  );
}
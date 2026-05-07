import React from "react";
import HeaderButtons from "./HeaderButtons";

export default {
    title: "Addon/HeaderButtons",
};

export const Default = () => (
    <HeaderButtons
        onLogout={() => console.log("logout")}
        onZoomIn={() => console.log("zoom in")}
        onZoomOut={() => console.log("zoom out")}
        onZoomReset={() => console.log("zoom reset")}
    />
);

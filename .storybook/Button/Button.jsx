import React from "react";
import PropTypes from "prop-types";

import "./style.css";

export default function Button({ active, children }) {
    return <button className={active ? "active" : ""}>{children}</button>;
}

Button.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
};

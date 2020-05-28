import React from "react";

const style = {
    fontFamily: "Helvetica Neue",
    fontWeight: 500,
    width: 200,
    height: 40,
    background: "#fdbd39",
    color: "2f3a4f",
    border: "none",
    borderRadius: 2,
    fontSize: 13,
};

const pressedStyle = {
    ...style,
    background: "#f69833",
};

export default {
    title: "Button",
};

 export const Button = () => <button style={style}>Normal</button>;
 export const ButtonPressed = () => <button style={pressedStyle}>Pressed</button>;

 Button.story = {
     parameters: {
         zeplinLink: "zpl://components?pid=5ecff3a2d8a8ab2a61937a66&coid=5ecff3be40a1ee4c8cb2aadb",
     },
 };

 ButtonPressed.story = {
     parameters: {
         zeplinLink: "zpl://components?coids=5ecff3be0f8b6a951c7ca618&pid=5ecff3a2d8a8ab2a61937a66",
     },
 };

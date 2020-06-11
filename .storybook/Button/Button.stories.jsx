import React from "react";
import Button from "./Button";

export default {
    title: "@Example|Button",
};

 export const ButtonNormal = () => <Button>Normal</Button>;
 export const ButtonPressed = () => <Button active>Pressed</Button>;
 export const ButtonMultiple = () => (
     <>
        <ButtonNormal/>
        <br/><br/>
        <ButtonPressed/>
     </>
 );

 ButtonNormal.story = {
     parameters: {
         zeplinLink: "zpl://components?pid=5ecff3a2d8a8ab2a61937a66&coid=5ecff3be40a1ee4c8cb2aadb",
     },
 };

 ButtonPressed.story = {
    parameters: {
        zeplinLink: "zpl://components?coids=5ecff3be0f8b6a951c7ca618&pid=5ecff3a2d8a8ab2a61937a66",
    },
};

 ButtonMultiple.story = {
     parameters: {
         zeplinLink: [
             {
                 name: "Default",
                 link: "zpl://components?pid=5ecff3a2d8a8ab2a61937a66&coid=5ecff3be40a1ee4c8cb2aadb"
             },
             {
                name: "Pressed",
                link: "zpl://components?coids=5ecff3be0f8b6a951c7ca618&pid=5ecff3a2d8a8ab2a61937a66"
            }
         ],
     },
 };

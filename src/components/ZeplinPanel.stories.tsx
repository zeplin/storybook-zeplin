import React from "react";
import ZeplinPanel from "./ZeplinPanel";

export default {
    title: 'Addon|ZeplinPanel',
    component: ZeplinPanel
}

const zeplinLink = process.env.STORYBOOK_ZEPLIN_LINK;
 
export const Default = () => <ZeplinPanel zeplinLink={zeplinLink}/>
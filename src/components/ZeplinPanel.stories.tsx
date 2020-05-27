import React from "react";
import ZeplinPanel from "./ZeplinPanel";

export default {
    title: 'Addon|ZeplinPanel',
    component: ZeplinPanel
}

const singleLink = process.env.STORYBOOK_ZEPLIN_LINK;

const multipleLinks = [
    { name: 'Mobile', link: process.env.STORYBOOK_ZEPLIN_LINK },
    { name: 'Desktop', link: process.env.STORYBOOK_ZEPLIN_LINK },
 ];
 
export const WithSingleLink = () => <ZeplinPanel zeplinLink={singleLink}/>
export const WithMultipleLinks = () => <ZeplinPanel zeplinLink={multipleLinks}/>
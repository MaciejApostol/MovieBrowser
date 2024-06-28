import React from "react";
import Layout from "./src/components/Layout";

const wrapWithLayout = ({element, props}) => {
    return <Layout {...props}>{element}</Layout>;
};

export default wrapWithLayout;

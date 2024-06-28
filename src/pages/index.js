import "../components/bootstrap/bootstrap.css";
import "../components/bootstrap/custom.css";
import {navigate} from "gatsby";
import {initialState} from "../state/initialState";

const IndexPage = () => {
    navigate(`${initialState.navLinks[0].pathname[0]}1/`);
};

export default IndexPage;

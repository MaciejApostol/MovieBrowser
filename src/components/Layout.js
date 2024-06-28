import React, {createContext, useState} from "react";
import {connect} from "react-redux";
import {Link} from "gatsby";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Figure from "react-bootstrap/Figure";
import Image from "react-bootstrap/Image";

import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import {findInState} from "../state/initialState";
import {StaticImage} from "gatsby-plugin-image";
import Badge from "react-bootstrap/Badge";
import {Stack} from "react-bootstrap";

export const NavBarContext = createContext({
    navBarData: "", setNavBarData: () => {
    }
});

const LayoutPresentation = (props) => {
    const {navLinks, favorites, toWatch, children, path, movies}=props
    const [navBarData, setNavBarData] = useState({brand: "", activeKey: ""});
    console.log(movies);
    const convertLength = (length) => {
        if (length > 99) {
            return "99+";
        }
        if (length === 0) {
            return "";
        }
        return length
    };
    const favoritesLen = convertLength(favorites.length);
    const toWatchLen = convertLength(toWatch.length);
    const active = findInState(navLinks, {key: "pathname", value: path});

    let brand = "404";
    let activeKey = "";

    if (active) {
        const title = active.title;
        brand = title;
        activeKey = title;
    } else if (navBarData.brand !== "") {
        brand = navBarData.brand;
        activeKey = navBarData.activeKey;
    }

    return (
        <>
            <div className="bg-primary bg-gradient" data-bs-theme="dark">
                <Row>
                    <Col>
                        <Navbar>
                            <Container>
                                <Navbar.Brand className="d-flex align-items-center">
                                    <Row className={"gx-2 align-items-center"}>
                                        <Col>
                                            <StaticImage src={"./../images/logo.svg"} width={40} height={40}
                                                         placeholder="blurred" alt={"logo"}/>
                                        </Col>
                                        <Col>
                                            {brand}
                                        </Col>
                                    </Row>
                                </Navbar.Brand>
                            </Container>
                        </Navbar>
                    </Col>
                </Row>
                <Container className="pb-2">
                    <Row>
                        <Col>
                            <Nav variant="pills" activeKey={activeKey}>
                                {navLinks.map(({pathname, title}, index) => {
                                    pathname = pathname[0];
                                    let badge = "";
                                    if (index === 1) {
                                        badge = favoritesLen;
                                    }
                                    if (index === 2) {
                                        badge = toWatchLen;
                                    }
                                    return (
                                        <Nav.Item key={`item-${index}`} className={"position-relative"}>
                                            <span className="position-absolute badge badge-position rounded-pill
                                            bg-primary-subtle">
                                              {badge}
                                            </span>
                                            <Nav.Link key={`link-${index}`} eventKey={title} as={Link} to={pathname}>
                                                {title}
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </Col>
                        <Col className="justify-content-end">
                            <Nav className="justify-content-end">
                                <Form>
                                    <Row>
                                        <Col xs="auto">
                                            <Form.Control type="text" placeholder="Search" className=" mr-sm-2"
                                                          data-bs-theme="light"/>
                                        </Col>
                                        <Col xs="auto">
                                            <Button type="submit" className="btn btn-light">Submit</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                <NavBarContext.Provider value={{navBarData, setNavBarData}}>
                    {children}
                </NavBarContext.Provider>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        navLinks: state.links.navLinks,
        favorites: state.favorites,
        toWatch: state.toWatch,
        movies:state.movies
    };
};

export const Head = ({data}) =>
    <title>
        {data.allTmdbMovies.nodes[0].pageTitle}
    </title>;

const LayoutContainer = connect(mapStateToProps)
(LayoutPresentation);
const Layout = ({path, children}) => <LayoutContainer path={path} children={children} pageTitle={"test"}/>;
export default Layout;

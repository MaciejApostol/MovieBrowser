import React from "react";
import Pagination from "react-bootstrap/Pagination";
import {Link} from "gatsby";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PaginationComponent = (props) => {
    const {pathname, activePage, max} = props;
    const offset = max <= 3 ? 1 : 2;
    const length = 2 * offset + 1;
    const arrayLength = max > length ? length : max;

    const makeArray = (length, mapFn) => Array.from({length}, mapFn);
    let pagination;
    let leftEllipse = "";
    let rightEllipse = "";

    if (max > length) {
        const ellipse = max - length > 1 && <Pagination.Ellipsis/>;
        const makeEllipse = (page) =>
            <>
                <Pagination.Item to={`${pathname + page}`} as={Link}>
                    {page}
                </Pagination.Item>
            </>;
        leftEllipse = <>{makeEllipse(1)}{ellipse}</>;
        rightEllipse = <>{ellipse}{makeEllipse(max)}</>;
    }

    if (activePage < length) {
        leftEllipse = "";
        pagination = makeArray(arrayLength, (_, idx) => idx + 1);
    } else if (activePage >= max - offset - 1) {
        rightEllipse = "";
        const difference = max > length ? max - length : 0;
        pagination = makeArray(arrayLength, (_, idx) => difference + idx + 1);
    } else {
        pagination = makeArray(arrayLength, (_, idx) => activePage - offset + idx);
    }

    return (
        <Container className={"my-4"}>
            <Row className={" justify-content-center"}>
                <Col className={"px-0"} md={"auto"}>
                    <Pagination>
                        <Pagination.First as={Link} to={`${pathname}1`}/>
                        <Pagination.Prev as={Link} to={`${pathname}${activePage > 1 ? activePage - 1 : 1}`}/>
                    </Pagination>
                </Col>
                <Col className={"pagination-col px-0"} style={{flexBasis: `${max <= 3 && 0}`}}>
                    <Pagination className={"justify-content-center"}>
                        {leftEllipse}
                        {pagination.map((element, index) => {
                            return (
                                <Pagination.Item key={`${element}-${index}`} active={element === activePage} as={Link}
                                                 to={`${pathname}${element}`}>
                                    {element}
                                </Pagination.Item>
                            );
                        })}
                        {rightEllipse}
                    </Pagination>
                </Col>
                <Col className={"px-0"} md="auto">
                    <Pagination>
                        <Pagination.Next as={Link} to={`${pathname}${activePage < max ? activePage + 1 : max}`}/>
                        <Pagination.Last as={Link} to={`${pathname}${max}`}/>
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default PaginationComponent;
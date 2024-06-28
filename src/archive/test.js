import React, {useContext, useState} from "react";
import {createContext} from "react";

const products = [
    {title: "Cabbage", id: 1},
    {title: "Garlic", id: 2},
    {title: "Apple", id: 3},
];

export const LevelContext = createContext({
    newTitle: "", setNewTitle: () => {
    }
});

const List = ({children}) => {
    const [newTitle, setNewTitle] = useState("");
    const value = {newTitle, setNewTitle};
    console.log(newTitle);
    return (
        <div className="List">
            <LevelContext.Provider value={{newTitle, setNewTitle}}>
                {children}
            </LevelContext.Provider>
            <hr/>
        </div>
    );
};

const Row = () => {
    const {_, setNewTitle} = useContext(LevelContext);
    setNewTitle("pl")
    return (
        <></>
    );
};

const Test = () =>
    <List>
        <Row/>
    </List>;

export default Test;


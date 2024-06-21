import React, {useState, useEffect} from 'react'
import { Tabs, Tab } from 'react-bootstrap';
const TabExample = ({props}) => {
  
    const [selectedTab, setSelectedTab] = useState(0);

    const handleSelect = (e) => {
        //set state
        setSelectedTab(e);
        //update url
        props.history.replace({
            hash: `${e}`
        });
    }

    return (
        //set active key, if no url hash set default to home
        <Tabs 
            activeKey={selectedTab ? selectedTab : 'home'}
            onSelect={(e) => handleSelect(e)}
        >
            <Tab eventKey="home" title="home">
            ....
            </Tab>
            <Tab eventKey="about" title="about">
            ....
            </Tab>
        </Tabs>
    );
}

export default TabExample

import React from 'react';
import {Sidebar, Menu, Button, Divider, Icon} from 'semantic-ui-react';
class ColorPanel extends React.Component {
    render() {
        return (
            <Sidebar 
                as={Menu}
                inverted vertical visible
                width="very thin"
            >
                <Divider />
                <Button size="small" color="blue" ><Icon name="add" /></Button>
                
            </Sidebar>
        ) 
    } 
}

export default ColorPanel;

    import React, { Component } from 'react';
    import { Tab, AppBar, Tabs } from '@material-ui/core';
    import { TabContext, TabPanel } from '@material-ui/lab';

    import App from './App';
    import Sold from './Sold';

    class TabList extends Component {
      state = {
        value: "1"
      }
      handleChange = (event, value) => {this.setState({value: value})}
      render() {
        return (
          <TabContext value={this.state.value}>
          <AppBar position="static">
            <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
              <Tab label="Stock" value="1" />
              <Tab label="Sold items" value="2" />
            </Tabs>
          </AppBar>
          <TabPanel value="1"><App /></TabPanel>
          <TabPanel value="2"><Sold /></TabPanel>
          </TabContext>
        );
      }
    }

    export default TabList;

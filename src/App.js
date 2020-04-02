
    import React, { Component } from 'react';
    import ReactTable from 'react-table-6'
    import 'react-table-6/react-table.css'
    import Axios from 'axios';

    class App extends Component {
      state = {
        cards : [],
        loading: false
      }
      columns = [{
        id: 'name',
        accessor: d => `${d.foil?"foil ":""}${d.name} (${d.card_set}) ${d.playset? "playset":""}`,
        Header: 'Name'
      }, {
        id: 'price',
        accessor: d => d.price/100,
        Header: 'Price'
      }, {
        id: 'trend_price',
        accessor: d => d.trend_price/100,
        Header: 'Trend'
      }, {
        id: 'trend_diff',
        accessor: d => (d.price - d.trend_price)/100,
        Header: 'Trend difference'
      }
    ];
      update = (e) => {
        e.preventDefault();
        Axios.get('http://mcm-api.loa.fi/update')
          .then((res) => {
            this.setState({
              cards: res.data
            })
          })
      }

      render() {
        return (
          <div id="main">
          <button onClick={this.update}>  fetch new</button>
          <ReactTable
            data={this.state.cards}
            loading={this.state.loading}
            manual
            onFetchData={(state,instance) => {
              this.setState({loading: true})
              const s = state.sorted && state.sorted.length>0? state.sorted[0] : {id:'name',desc:false}
              Axios.get('http://mcm-api.loa.fi/stock', {
                params: {
                  page: state.page,
                  pageSize: state.pageSize,
                  sort: s.id,
                  order: s.desc? "DESC" : "ASC",
                  filtered: state.filtered
                }
              })
                .then((res) => {
                  this.setState({
                    cards: res.data,
                    loading: false
                  })
                })
            }}
            columns={this.columns}/>
          </div>
        );
      }
    }

    export default App;

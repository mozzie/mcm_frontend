
    import React, { Component } from 'react';
    import ReactTable from 'react-table-6'
    import 'react-table-6/react-table.css'
    import Axios from 'axios';

    class App extends Component {
      state = {
        cards : [],
        loading: false,
        limit: 5000
      }
      columns = [{
        id: 'name',
        accessor: d => `${d.foil?"foil ":""}${d.name} (${d.card_set}) ${d.playset? "playset":""}`,
        Header: 'Name'
      }, {
        id: 'price',
        accessor: d => (d.price/100).toFixed(2),
        Header: 'Price'
      }, {
        id: 'trend_price',
        accessor: d => (d.trend_price/100).toFixed(2),
        Header: 'Trend'
      }, {
        id: 'trend_diff',
        accessor: d => ((d.price - d.trend_price)/100).toFixed(2),
        Header: 'Trend difference'
      }, {
        id: 'mcm_comment',
        accessor: d => d.mcm_comment,
        Header: 'comment'
      }
    ];
    update = (e) => {
      e.preventDefault();
      Axios.get('http://mcm-api.loa.fi/update')
        .then((res) => {
          this.setState({
            cards: res.data.data,
            limit: res.data.limit
          })
        })
    }
    trends = (e) => {
      e.preventDefault();
      Axios.get('http://mcm-api.loa.fi/trends')
        .then((res) => {
          this.setState({
            cards: res.data.data,
            limit: res.data.limit || this.state.limit
          })
        })
    }

      render() {
        return (
          <div id="main">
          <div id="limit">MCM-queries left: {this.state.limit}</div>
          <button onClick={this.update}>fetch new</button>
          <button onClick={this.trends}>update trends</button>
          <ReactTable
            showPagination={false}
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
                .catch((error) => {
                  this.setState({
                    cards: [],
                    loading: false
                  })
                  console.log(error.response)
                })
            }}
            columns={this.columns}/>
          </div>
        );
      }
    }

    export default App;

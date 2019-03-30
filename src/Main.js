import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  setCampaignData,
  updateCampaignData,
  deleteCampaignData,
} from './redux/reducers/campaign/action';
import selectTableHOC from 'react-table/lib/hoc/selectTable';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';

const SelectTreeTable = selectTableHOC(ReactTable);

class App extends Component {
  state = { selected: [], modal: false, cellInfo: null };

  componentDidMount = () => {
    const { dispatch } = this.props;
    const now = moment().format('ddd, MMM Do YYYY, h:mm a');
    const data = require('./data.json');
    dispatch(setCampaignData(data.map(item => ({ ...item, updatedAt: now }))));
  };

  renderEditable = cellInfo => {
    const { data, dispatch } = this.props;

    return (
      <div
        style={{ backgroundColor: '#fafafa' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const name = e.target.innerHTML;
          this.toggle({ ...cellInfo, name });
        }}
        dangerouslySetInnerHTML={{
          __html: !this.state.cellInfo ? this.props.data[cellInfo.index][cellInfo.column.id] : null,
        }}
      />
    );
  };

  handleToggle = data => {
    const { selected } = this.state;
    const _id = data.replace('select-', '');
    const exists = selected.find(item => item._id === _id);
    if (exists) return this.setState({ selected: selected.filter(item => item._id !== _id) });
    this.setState({ selected: [{ _id }].concat(selected) });
  };

  deleteSelected = () => {
    const { selected } = this.state;
    const { dispatch } = this.props;
    dispatch(deleteCampaignData(selected));
    this.toggle();
  };

  toggle = cellInfo => this.setState(prevState => ({ modal: !prevState.modal, cellInfo }));

  update = () => {
    const { dispatch, data } = this.props;
    const { cellInfo } = this.state;
    const updatedAt = moment().format('ddd, MMM Do YYYY, h:mm a');
    const { index, name } = cellInfo;

    dispatch(updateCampaignData({ index, newRecord: { ...data[index], name, updatedAt } }));
    this.toggle();
  };

  handleUpdateCancel = () => {
    const { cellInfo } = this.state;
    const { dispatch, data } = this.props;
    const { index } = cellInfo;

    console.log('TCL: handleUpdateCancel -> { index, newRecord: { ...data[index] } }', {
      index,
      newRecord: { ...data[index] },
    });
    dispatch(updateCampaignData({ index, newRecord: { ...data[index] } }));
    this.toggle();
  };

  render() {
    const { data } = this.props;
    const { selected, modal, cellInfo } = this.state;
    console.log('TCL: render -> cellInfo', cellInfo);
    const columns = [
      {
        Header: 'Campaign Name',
        accessor: 'name', // String-based value accessors!
        Cell: this.renderEditable,
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['name'] }),
        filterAll: true,
      },
      {
        Header: 'Type',
        accessor: 'type',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['type'] }),
        filterAll: true,
      },
      {
        Header: 'Last Saved',
        accessor: 'updatedAt',
        filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['updatedAt'] }),
        filterAll: true,
      },
    ];

    return (
      <React.Fragment>
        <SelectTreeTable
          data={data}
          columns={columns}
          className="-striped -highlight"
          filterable
          defaultPageSize={10}
          toggleSelection={this.handleToggle}
          isSelected={data => selected.find(({ _id }) => _id === data)}
          SelectAllInputComponent={() => <button onClick={this.toggle}>X</button>}
        />

        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Do you wnat to delete selected items?</ModalHeader>

          <ModalFooter>
            {!cellInfo && (
              <Button color="danger" onClick={this.deleteSelected}>
                Delete
              </Button>
            )}
            {cellInfo && (
              <Button color="primary" onClick={this.update}>
                Update
              </Button>
            )}{' '}
            <Button color="secondary" onClick={!cellInfo ? this.toggle : this.handleUpdateCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  ({ campaign }) => ({ data: campaign.data }),
  dispatch => ({ dispatch })
)(App);

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import apiprefix from './apiprefix';
import 'date-fns';
import { Typography } from '@material-ui/core';
import queryStrings from 'query-string';
import TextField from '@material-ui/core/TextField';

const FilterSelectField = props => {
  const { listOfFilterOptions, filterOption, updateFilterOption } = props;

  const handleChange = event => {
    updateFilterOption(event.target.value);
  };

  // displays the menu item with the same value as the current filterOption.
  return (
    <>
      <Select value={filterOption} onChange={handleChange}>
        {listOfFilterOptions.map(e => {
          <MenuItem value={e}>{e}</MenuItem>;
        })}
      </Select>
    </>
  );
};

// Does not return anything.
// Updates the current list of transaction to display.
const getEntriesForPage = (page, numEntriesPerPage, listOfTransactions) => {
  if (page === -1) {
    return listOfTransactions;
  }

  const startIndex = page * numEntriesPerPage;
  let endIndex = startIndex + numEntriesPerPage;

  if (startIndex > listOfTransactions.length) {
    return null; // Change to the last page instead. And Update URL.
  }

  if (endIndex > listOfTransactions.length) {
    endIndex = listOfTransactions.length;
  }

  return listOfTransactions.slice(startIndex, endIndex);
};

const TransactionTableHeader = props => {
  const { tableHeaders } = props;

  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell>{tableHeaders.parkingId}</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
    </>
  );
};

const TransactionsTableBody = props => {
  const { page, numEntriesPerPage, listOfTransactions } = props;
  const rows = getEntriesForPage(page, numEntriesPerPage, listOfTransactions);

  return (
    <>
      <TableBody>
        {rows.map(row => {
          <TableRow>
            <TableCell>{row.parkingId}</TableCell>
            <TableCell />
          </TableRow>;
        })}
      </TableBody>
    </>
  );
};

const TransactionTable = props => {
  const {
    listOfTransactions,
    page,
    updatePage,
    numEntriesPerPage,
    updateNumEntriesPerPage,
    tableHeaders
  } = props;

  const listOfFilterOptions = ['Parking ID', 'Buyer ID', 'Seller ID'];
  const [filterOption, updateFilterOption] = useState('');
  const [textFieldValue, updateTextFieldValue] = useState('');
  const [displayList, updateDisplayList] = useState(listOfTransactions);

  const handleChangePage = (event, newPage) => {
    updatePage(newPage);
  };

  const handleChangeNumEntriesPerPage = event => {
    updateNumEntriesPerPage(parseInt(event.target.value, 10));
    updatePage(0);
  };

  const handleTextFieldChange = event => {
    updateTextFieldValue(event.target.value);
  };

  const handleClickFilter = event => {
    const temp = listOfTransactions.filter(
      e => e[filterOption] === textFieldValue
    );
    updateDisplayList(temp);
  };

  //Not sure what it does.

  /*
SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
  */

  // Add in filtering option?
  // Filter by a specific parking id, buyer or seller.
  return (
    <>
      <div>
        <FilterSelectField
          listOfFilterOptions={listOfFilterOptions}
          filterOption={filterOption}
          updateFilterOption={updateFilterOption}
        />
        <TextField
          label={`Enter a ${filterOption}`}
          value={textFieldValue}
          onChange={handleTextFieldChange}
        />
        <Button onClick={handleClickFilter}>Filter!</Button>
      </div>
      <Table stickyHeader>
        <TransactionTableHeader tableHeaders={tableHeaders} />
        <TransactionsTableBody
          listOfTransactions={displayList}
          page={page}
          numEntriesPerPage={numEntriesPerPage}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          colSpan={3}
          count={displayList.length}
          rowsPerPage={numEntriesPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeNumEntriesPerPage}
        />
      </Table>
    </>
  );
};

const handleNewTransaction = (listOfTransactions, updateListOfTransactions, newTransaction) => {
  updateListOfTransactions(listOfTransactions.unshift(data));
};

const TransactionHistory = (props) => {
  const { socket } = props;

  const [listOfTransactions, updateListOfTransactions] = useState(
    getTransactionHistory()
  );
  const [page, updatePage] = useState(0);
  const [numEntriesPerPage, updateNumEntriesPerPage] = useState(10);

  // Table header.
  const tableHeaders = {
    parkingId: 'Parking ID',
    sellerId: 'Seller ID',
    buyerId: 'Buyer ID'
  };

  const url = `${apiprefix}/transaction_history`;

  const getTransactionHistory = async () => {
    const response = await makeAPICall('GET', url);
    const respbody = await response.json();

    if (response.status === 200) {
      const queryParams = queryStrings.parse(window.location.search);

      if (
        queryParams.page !== undefined &&
        isNaN(queryParams.page) !== false &&
        Number(queryParams.page) !== page
      ) {
        updatePage(Number(queryParams.page));
      }

      if (
        queryParams.numEntries !== undefined &&
        isNaN(queryParams.numEntries) !== false &&
        Number(queryParams.numEntries) !== numEntriesPerPage
      ) {
        updateNumEntriesPerPage(Number(queryParams.numEntries));
      }

      return respbody.listOfTransactions;
    }

    return null;
  };

  useEffect(() => {
    socket.on('transaction_history', (data) => handleNewTransaction(listOfTransactions, updateListOfTransactions, data));
  });

  return (
    <Typography>
      <TransactionTable
        listOfTransactions={listOfTransactions}
        page={page}
        updatePage={updatePage}
        numEntriesPerPage={numEntriesPerPage}
        updateNumEntriesPerPage={updateNumEntriesPerPage}
        tableHeaders={tableHeaders}
      />
    </Typography>
  );
};

export default TransactionHistory;

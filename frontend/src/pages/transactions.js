/**
 * The transaction page shows the blockchain, either partially or in
 * full depending on the user filtering options.
 */

import React, { useState, useEffect } from 'react';
import { makeAPICall } from '../api';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import apiprefix from './apiprefix';
import history from '../history';
import 'date-fns';
import { Typography, Select } from '@material-ui/core';
import queryStrings from 'query-string';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import {
  withStyles,
  withTheme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  tabLink: {
    color: theme.palette.secondary.main
  },
  circProgress: {
    marginTop: '200px'
  }
});

// Handles the filtering options.
const FilterSelectField = ({ classes, ...props }) => {
  const { listOfFilterOptions, filterOption, updateFilterOption } = props;

  const handleChange = event => {
    updateFilterOption(event.target.value);
  };

  // displays the menu item with the same value as the current filterOption.
  return (
    <>
      <Select value={filterOption} onChange={handleChange}>
        {listOfFilterOptions.map(e => (
          <MenuItem value={e}>{e}</MenuItem>
        ))}
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

/**
 * Returns the components used for the header of the table.
 * 
 * @param {Object} props 
 */
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

/**
 * Returns the components used in the body of the table.
 * 
 * @param {Object} param0 
 */
const TransactionsTableBody = ({
  page,
  numEntriesPerPage,
  listOfTransactions}) => {
  const rows = getEntriesForPage(page, numEntriesPerPage, listOfTransactions);

  return (
    <>
      <TableBody>
        {rows.map(row => (
          <TableRow>
            <TableCell>{row.parkingId}</TableCell>
            <TableCell />
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

/**
 * Makes the transaction history table.
 * 
 * @param {Object} param0 
 */
const TransactionTable = ({
  userId,
  listOfTransactions,
  page,
  updatePage,
  numEntriesPerPage,
  updateNumEntriesPerPage,
  tableHeaders,
  getEntireHistory
}) => {
  const listOfFilterOptions = [
    'None',
    'Parking ID',
    'Buyer ID',
    'Seller ID',
    'Time'
  ];
  const [filterOption, updateFilterOption] = useState('Buyer ID');
  const [textFieldValue, updateTextFieldValue] = useState({
    value: userId,
    isDisabled: false
  });
  const [displayList, updateDisplayList] = useState(listOfTransactions);
  const [hasEntireHistory, updateHasEntireHistory] = useState(false);
  /*
  const [timeFilter, updateTimeFilter] = useState({
    startTime: '00:00',
    endTIme: '23:59'
  });*/

  const handleChangePage = (event, newPage) => {
    updatePage(newPage);
    history.push(`/transaction_history?page=${newPage}&numEntries=${numEntriesPerPage}`);
  };

  const handleChangeNumEntriesPerPage = event => {
    updateNumEntriesPerPage(parseInt(event.target.value, 10));
    updatePage(0);
    history.push(`/transaction_history?page=${0}&numEntries=${event.target.value}`);
  };

  const handleTextFieldChange = event => {
    updateTextFieldValue({ ...textFieldValue, value: event.target.value });
  };

  const handleClickFilter = async () => {
    // Get the entire history if haven't.
    if (!hasEntireHistory) {
      getEntireHistory();
      updateHasEntireHistory(true);
    }

    // If no filter option, then display all, otherwise, filter base on filter option.
    const temp =
      filterOption === 'None'
        ? listOfTransactions
        : listOfTransactions.filter(
            e => e[filterOption] === textFieldValue.value
          );
    updateDisplayList(temp);
  };

  return (
    <>
      <div>
        <FilterSelectField
          listOfFilterOptions={listOfFilterOptions}
          filterOption={filterOption}
          updateFilterOption={updateFilterOption}
        />
        <TextField
          disabled={textFieldValue.isDisabled}
          label={`Enter a ${filterOption}`}
          value={textFieldValue.value}
          onChange={handleTextFieldChange}
        />
        <Button variant="contained" color="primary" onClick={handleClickFilter}>
          Filter!
        </Button>
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

/*
  Handles adding the new parking spot sent through the socket.
  Expects the times to be sorted.
*/
const handleNewTransaction = (
  listOfTransactions,
  updateListOfTransactions,
  newTransaction
) => {
  listOfTransactions.unshift(newTransaction); // Assumes the entries arrive in sequential order. Need to manually sort perhaps.
  updateListOfTransactions(listOfTransactions);
};

/*
  Updates the page the table is on.
*/
const updatePageInfo = (queryPage, currPage, updatePage) => {
  if (
    queryPage !== undefined &&
    isNaN(queryPage) !== false &&
    Number(queryPage) !== currPage
  ) {
    updatePage(Number(queryPage));
  }
};

/*
  Updates the number of entries displayed on the page.
*/
const updateNumEntryInfo = (
  queryNumEntry,
  currNumEntry,
  updateNumEntriesPerPage
) => {
  if (
    queryNumEntry !== undefined &&
    isNaN(queryNumEntry) !== false &&
    Number(queryNumEntry) !== currNumEntry
  ) {
    updateNumEntriesPerPage(Number(queryNumEntry));
  }
};

/**
 * The component that is exported. It creates the transaction history page.
 * The default setting is personal history only.
 * 
 * @param {Object} param0 
 */
const TransactionHistory = ({ setOpenSnackbar, updateSnackbarOptions, snackbarOptions, userSocket, socket, classes }) => {
  const [message, updateMessage] = useState(
    <CircularProgress size={100} className={classes.circProgress} />
  );
  const [listOfTransactions, updateListOfTransactions] = useState([]);
  const [page, updatePage] = useState(0);
  const [numEntriesPerPage, updateNumEntriesPerPage] = useState(10);

  // Table header.
  const tableHeaders = {
    parkingId: 'Parking ID',
    sellerId: 'Seller ID',
    buyerId: 'Buyer ID'
  };

  const url = `${apiprefix}/transaction_history`;

  // GET request for a specific user's personal history.
  const getUserTransactionHistory = async () => {
    const response = await makeAPICall(
      'GET',
      `${url}/${localStorage.olivia_pid}/spots`
    );
    const respbody = await response.json();

    if (response.status === 200) {
      const queryParams = queryStrings.parse(window.location.search);

      // Updates the url based on the page and number of entries.
      if (typeof queryParams.page === 'undefined' || typeof queryParams.numEntries === 'undefined') {
        history.push(`/transaction_history?page=${page}&numEntries=${numEntriesPerPage}`);
      } else {
        updatePageInfo(queryParams.page, page, updatePage);
        updateNumEntryInfo(
          queryParams.numEntries,
          numEntriesPerPage,
          updateNumEntriesPerPage
        );
      }

      updateListOfTransactions(respbody.listOfTransactions);
    } else {
      updateMessage('Error has occurred');
    }
  };

  // Gets the entire transaction history, only called if the user hits filter.
  const getEntireHistory = async () => {
    const response = await makeAPICall('GET', url);
    const respbody = await response.json();

    if (response.status === 200) {
      const queryParams = queryStrings.parse(window.location.search);

      if (typeof queryParams.page === 'undefined' || typeof queryParams.numEntries === 'undefined') {
        history.push(`/transaction_history?page=${page}&numEntries=${numEntriesPerPage}`);
      } else {
        updatePageInfo(queryParams.page, page, updatePage);
        updateNumEntryInfo(
          queryParams.numEntries,
          numEntriesPerPage,
          updateNumEntriesPerPage
        );
      }

      updateListOfTransactions(respbody.listOfTransactions);
    } else {
      updateMessage('Error has occurred');
    }
  };

  useEffect(() => {
    getUserTransactionHistory();
  }, []);

  // Handles the socket logic.
  useEffect(() => {
    // Socket for handling user personal info.
    userSocket.on(`sell-${localStorage.olivia_pid}`, () => {
      setOpenSnackbar(false);

      // Make it so that the data variable stores the message.
      updateSnackbarOptions({
        ...snackbarOptions,
        message: 'You Got Rich! Go To Account To See How Much Disposable Income You Have.',
        severity: 'info'
      })
    });

    socket.on('transactionHistory', data =>
      handleNewTransaction(listOfTransactions, updateListOfTransactions, data)
    );
  }, []);

  return (
    <>
      <div>
        {message ? (
          <Typography align="center">{message}</Typography>
        ) : (
          <Typography>
            <TransactionTable
              listOfTransactions={listOfTransactions}
              page={page}
              updatePage={updatePage}
              numEntriesPerPage={numEntriesPerPage}
              updateNumEntriesPerPage={updateNumEntriesPerPage}
              tableHeaders={tableHeaders}
              getEntireHistory={getEntireHistory}
            />
          </Typography>
        )}
      </div>
    </>
  );
};

export default withTheme(withStyles(styles)(TransactionHistory));

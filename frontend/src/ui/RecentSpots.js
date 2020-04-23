import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles, withTheme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { makeAPICall } from '../api';
import apiprefix from '../pages/apiprefix';
import queryStrings from 'query-string';
import history from '../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  convertEpochToMilitary,
  convertMilitaryTimeToNormal
} from '../pages/forms/time-filter';
import { MessageDialog } from '../pages/forms/parking-spot-components';

function preventDefault(event) {
  event.preventDefault();
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  tabLink: {
    color: theme.palette.secondary.main
  },
  depositContext: {
    flex: 1
  },
  circProgress: {
    marginTop: '200px'
  }
});

const TransactionTableHeader = props => {
  const { tableHeaders } = props;

  return (
    <>
      <TableHead>
        <TableRow>
          {tableHeaders.map(e => {
            return (
              <>
                <TableCell>{e}</TableCell>
              </>
            );
          })}
        </TableRow>
      </TableHead>
    </>
  );
};

const TransactionsTableBody = ({
  page,
  numEntriesPerPage,
  listOfTransactions
}) => {
  const rows = listOfTransactions; // getEntriesForPage(page, numEntriesPerPage, listOfTransactions);

  return (
    <>
      <TableBody>
        {rows.map(row => (
          <>
            <TableRow>
              <TableCell>{`${row.zone_id}-${row.spot_id}`}</TableCell>
              <TableCell>{row.buyer}</TableCell>
              <TableCell>{row.seller}</TableCell>
              <TableCell>
                {convertMilitaryTimeToNormal(row.start_time)}
              </TableCell>
              <TableCell>{convertMilitaryTimeToNormal(row.end_time)}</TableCell>
              <TableCell>{row.quantity}</TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </>
  );
};

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

  return (
    <>
      <Table stickyHeader>
        <TransactionTableHeader tableHeaders={tableHeaders} />
        <TransactionsTableBody
          listOfTransactions={displayList}
          page={page}
          numEntriesPerPage={numEntriesPerPage}
        />
      </Table>
    </>
  );
};
const RecentSpots = ({ classes, ...props }) => {
  const [messageDialogField, updateMessageDialogField] = useState({
    message: '',
    dialogTitle: ''
  });
  const [message, updateMessage] = useState(
    <CircularProgress size={100} className={classes.circProgress} />
  );
  const tableHeaders = [
    'Parking ID',
    'Buyer PID',
    'Seller PID',
    'Start Time',
    'End Time',
    'Total Price'
  ];
  const [listOfTransactions, updateListOfTransactions] = useState([]);
  const [page, updatePage] = useState(0);
  const [openMessageDialog, updateOpenMessageDialog] = useState(false);
  const url = `${apiprefix}/history`;
  const getUserTransactionHistory = async () => {
    const response = await makeAPICall(
      'GET',
      `${url}/${localStorage.olivia_pid}`
    );
    const respbody = await response.json();

    if (response.status === 200) {
      /*
        response body is the following object:
        {
          data: [
            {
              user: "park.vt", 
              quantity: "10.0000 VTP",
              spot_id: 123, 
              zone_id: 456, 
              time_code: 1586401381, 
              buyer: "alice", 
              seller: "bob"
            }
          ]
        }
      */

      // Formatting response
      respbody.data.forEach(e => {
        e.quantity = e.quantity.split(' ')[0];
        e.start_time = convertEpochToMilitary(e.time_code);
        e.end_time = convertEpochToMilitary(e.time_code + 15 * 60);
      });

      console.log(respbody.data);

      updateListOfTransactions(respbody.data);
      updateMessage(null);
    } else {
      updateMessageDialogField({
        dialogTitle: 'Error',
        message: respbody.message
      });
      updateOpenMessageDialog(true);
    }
  };
  useEffect(() => {
    getUserTransactionHistory();
  }, []);
  return (
    <React.Fragment>
      <TransactionTable
        userId={localStorage.olivia_pid}
        listOfTransactions={listOfTransactions}
        page={-1}
        tableHeaders={tableHeaders}
        getEntireHistory={false}
      />
      <Title>Recent Listings</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          See My Spots
        </Link>
      </div>
    </React.Fragment>
  );
};
export default withTheme(withStyles(styles)(RecentSpots));

import React, { useState, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import ReactToPrint from 'react-to-print';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import history from '../../history';

// Must use class component in order to use ReactToPrint because uses ref attribute.
class InvoiceInfo extends React.Component {
  constructor(props) {
    super(props);
    const { spotInfo } = props.spotInfo;
    this.listToPrint = [{ name: 'Buyer ID', value: spotInfo.buyer_id }];
  }

  render() {
    return (
      <Table>
        <TableBody>
          {this.listToPrint.map(e => {
            return (
              <>
                <TableRow>
                  <TableCell>{`${e.name}:`}</TableCell>
                  <TableCell>{e.value}</TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

const Invoice = props => {
  const { spotInfo } = props;
  const componentRef = useRef();

  const handleOnClick = () => {
    history.push('/');
    window.location.href = `${process.env.PUBLIC_URL}/`;
  };

  return (
    <>
      <Button variant="contained" color="default" onClick={handleOnClick}>
        Close
      </Button>
      <ReactToPrint
        trigger={() => (
          <Button variant="contained" color="default" startIcon={<PrintIcon />}>
            Print
          </Button>
        )}
        content={() => componentRef.current}
        onAfterPrint={handleOnClick}
      />
      <InvoiceInfo ref={componentRef} spotInfo={spotInfo} />
    </>
  );
};

export default Invoice;

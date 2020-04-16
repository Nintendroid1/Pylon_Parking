import React, { useState, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import ReactToPrint from 'react-to-print';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';

const InvoiceInfo = (props) => {
  const { spotInfo } = props;

  const listToPrint = [
    { name: 'Buyer ID', value: spotInfo.buyer_id }
  ];

  return (
    <>
      <Table>
        <TableBody>
          {listToPrint.map(e => {
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
    </>
  );
};

const Invoice = (props) => {
  const { spotInfo } = props;
  const componentRef = useRef();

  return (
    <>
      <ReactToPrint 
        trigger={() => 
          <Button
            variant="contained"
            color="default"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        }
        content={() => componentRef.current}
      />
      <InvoiceInfo 
        ref={componentRef}
        spotInfo={spotInfo}
      />
    </>
  );
};

export default Invoice;
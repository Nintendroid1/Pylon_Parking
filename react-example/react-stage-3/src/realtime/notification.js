import io from 'socket.io-client'; // uses stand-alone build
import toast from '../ui/Snackbar';
 
const socketIoUrl = `${window.location.origin}`;
 
// authentication
const authSocket = io.connect(`${socketIoUrl}/auth`, {
  path: `${process.env.PUBLIC_URL}/api/socket.io`
});
 

// voting
const voteSocket = io.connect(`${socketIoUrl}/votes`, {
  path: `${process.env.PUBLIC_URL}/api/socket.io`
});

voteSocket.on('voteupdate', msg => {
  console.log("WE JUST GOT A LETTER");
});

authSocket.on('newuser', msg => {
  // ... extract information from msg
  console.log("ASDFASDFADSF");
  //toast.success(`New User #${id} (${firstname} ${lastname} ${email}) signed up!`);
});
 
authSocket.on('updateuser', msg => {
  // ....
});
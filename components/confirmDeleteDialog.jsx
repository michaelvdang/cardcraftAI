import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ConfirmDeleteModal({onSubmit}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    onSubmit();
    console.log("Item deleted");
    setOpen(false);
  };

  return (
    <div>
      <Button 
        sx={{ 
          color: 'red', 
          borderColor: 'red', 
          backgroundColor: 'white',
          ":hover": {backgroundColor: '#fff3f3'}
        }} 
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-delete-title"
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        PaperProps={{
          sx: {
            minWidth: 300,
          },
        }}
        // disableScrollLock={false}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#00000022',
            color: 'black',
          }}
          id="confirm-delete-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent
          sx={{
            padding: 2,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <Typography
            sx={{
              padding: 2, 
            }}
            variant="h6">
            Are you sure you want to delete this card set? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: 2,
            backgroundColor: 'white',
            color: 'white',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{ 
              color: 'black', 
              backgroundColor: 'white',
              ":hover": {backgroundColor: '#f8f8f8'}
            }}  
            onClick={handleClose} 
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            sx={{ 
              color: 'white', 
              backgroundColor: 'red',
              ":hover": {backgroundColor: '#ff000099'}
            }}  
            onClick={handleDelete} 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface AppendOverwriteDialogProps {
  open: boolean;
  onClickAppend: () => void;
  onClickOverwrite: () => void;
  onClose: () => void;
}

const AppendOverwriteDialog = ({onClickAppend, onClickOverwrite, open, onClose}: AppendOverwriteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Flashcard Set Exists
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
          A flashcard set with this name already exists. Do you want to append to the existing set?
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
          onClick={onClose} 
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          sx={{ 
            color: 'black', 
            backgroundColor: 'white',
            ":hover": {backgroundColor: '#f8f8f8'}
          }}  
          onClick={onClickAppend} 
          variant="contained"
        >
          Append
        </Button>
        <Button
          sx={{ 
            color: 'white', 
            backgroundColor: 'red',
            ":hover": {backgroundColor: '#ff000099'}
          }}  
          onClick={onClickOverwrite} 
          variant="contained"
        >
          Overwrite
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppendOverwriteDialog
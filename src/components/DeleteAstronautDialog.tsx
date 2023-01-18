import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type DeleteAstronautDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteAstronautDialog({
  isOpen,
  onClose,
  onDelete,
}: DeleteAstronautDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete this astronaut?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you really want to delete this astronaut?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} autoFocus variant="contained" color="error">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

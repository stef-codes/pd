import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Tasks</Button>
        <Button color="inherit">Settings</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
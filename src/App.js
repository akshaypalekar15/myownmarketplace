import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Box from '@mui/material/Box';
import SideNav from './Components/SideNav';
import Dashboard from './Pages/Dashboard';
import Portfolio from './Pages/Portfolio';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><SideNav /><Dashboard /></>,
  },
  {
    path: '/portfolio',
    element: <><SideNav /><Portfolio /></>,
  }
]);

function App() {
  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              My Market Place
            </Typography>
          </Toolbar>
        </AppBar>
        <RouterProvider router={router} />
      </Box>
    </div>
  );
}

export default App;

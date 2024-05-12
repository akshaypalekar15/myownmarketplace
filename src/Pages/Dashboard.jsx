import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import InfoModal from "../Components/InfoModal.jsx";

import { apiKey, formatDate } from "../utils.js";

const Dashboard = () => {
  const [stocksData, setStocksData] = useState([]);
  const [error, setError] = useState();
  const [tickerData, setTickerData] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2024-02-09?adjusted=true&apiKey=${apiKey}`
        );
        const data = await resp.json();
        const stocks = [];
        data.results.forEach((stock, index) => {
          if (index < 50) {
            stocks.push({
              ...stock,
              change: parseFloat(stock.o - stock.c).toFixed(2),
            });
          }
        });
        setStocksData(stocks.sort((a, b) => b.o - a.o));
        setError(null);
      } catch (err) {
        setError(err);
        setStocksData([]);
      }
    };
    fetchData();
  }, []);

  const handleClick = (ticker) => {
    const fetchTickerData = async () => {
      const resp = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${ticker}?data=${formatDate(
          Date.now()
        )}&apiKey=${apiKey}`
      );
      const data = await resp.json();
      setTickerData(data.results);
      handleOpen();
    };
    fetchTickerData();
  };

  const getTopLosers = () => {
    const copy = JSON.parse(JSON.stringify(stocksData));
    const topLosers = copy.sort((a, b) => a.change - b.change);
    return (
      <List
        sx={{
          width: "100%",
          height: "38vh",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {topLosers.map((stock, i) => {
          return (
            i > 0 &&
            i < 6 && (
              <ListItem alignItems="flex-start">
                <ListItemButton onClick={() => handleClick(stock.T)}>
                  <ListItemText
                    primary={stock.T}
                    secondary={
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Open = {stock.o}, High = {stock.h}, Low = {stock.l},{" "}
                          Close = {stock.c}, Change = {stock.change}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          );
        })}
      </List>
    );
  };

  const getTopGainers = () => {
    const copy = JSON.parse(JSON.stringify(stocksData));
    const topGainers = copy.sort(function (a, b) {
      return b.change - a.change;
    });
    return (
      <List
        sx={{
          width: "100%",
          height: "34vh",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {topGainers.map((stock, i) => {
          return (
            i > 0 &&
            i < 6 && (
              <ListItem alignItems="flex-start">
                <ListItemButton onClick={() => handleClick(stock.T)}>
                  <ListItemText
                    primary={stock.T}
                    secondary={
                      <>
                        <Typography variant="subtitle1" gutterBottom>
                          Open = {stock.o}, High = {stock.h}, Low = {stock.l},{" "}
                          Close = {stock.c}, , Change = {stock.change}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )
          );
        })}
      </List>
    );
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper>
            <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
              Top 50 stocks
            </Typography>
            <Divider />
            <List
              sx={{
                width: "100%",
                height: "80vh",
                bgcolor: "background.paper",
                overflow: "auto",
              }}
            >
              {error && (
                <Typography
                  sx={{ textAlign: "center", color: "red" }}
                  variant="body"
                  gutterBottom
                >
                  Error while fetching data
                </Typography>
              )}
              {stocksData.map((stock, i) => {
                return (
                  i > 0 && (
                    <ListItem alignItems="flex-start">
                      <ListItemButton onClick={() => handleClick(stock.T)}>
                        <ListItemText
                          primary={stock.T}
                          secondary={
                            <>
                              <Typography variant="subtitle1" gutterBottom>
                                Open = {stock.o}, High = {stock.h}, Low ={" "}
                                {stock.l}, Close = {stock.c}, Change ={" "}
                                {stock.change}
                              </Typography>
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
              Top 5 Gainers
            </Typography>
            <Divider />
            {getTopGainers()}
          </Paper>
          <Paper sx={{ mt: 2 }}>
            <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
              Top 5 Losers
            </Typography>
            <Divider />
            {getTopLosers()}
          </Paper>
        </Grid>
      </Grid>
      <InfoModal
        open={open}
        handleClose={handleClose}
        tickerData={tickerData}
      />
    </Box>
  );
};

export default Dashboard;

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

const portfolioData = [
  { name: "ALGN", quantity: 3 },
  { name: "MOO", quantity: 5 },
  { name: "ZD", quantity: 6 },
  { name: "IMO", quantity: 2 },
];

const Portfolio = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [tickerData, setTickerData] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const result = [];
    const fetchData = async () => {
      for (let i = 0; i < portfolioData.length; i++) {
        try {
          const resp = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${portfolioData[i].name}/prev?adjusted=true&apiKey=${apiKey}`
          );
          const data = await resp.json();
          result.push({
            ...data.results[0],
            quantity: portfolioData[i].quantity,
            currentValue: parseFloat(
              data.results[0].c * portfolioData[i].quantity
            ).toFixed(2),
          });
          setError(null);
        } catch (err) {
          setError(err);
        }
      }
      setData(result);
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

  const getCurrentPortfolioValue = () => {
    let total = 0;
    data.forEach((ticker) => {
      total += parseFloat(ticker.currentValue);
    });

    return total;
  };

  const renderPortfolioList = () => {
    return (
      <List
        sx={{
          width: "100%",
          height: "38vh",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {data.map((stock, i) => {
          return (
            <ListItem alignItems="flex-start">
              <ListItemButton onClick={() => handleClick(stock.T)}>
                <ListItemText
                  primary={stock.T}
                  secondary={
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Open = {stock.o}, High = {stock.h}, Low = {stock.l},{" "}
                        Close = {stock.c}, Quantity: {stock.quantity} ,Current
                        Value: {stock.currentValue}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
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
            {" "}
            <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
              My Portfolio
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
              {error ? (
                <Typography
                  sx={{ textAlign: "center", color: "red" }}
                  variant="p"
                  gutterBottom
                >
                  Error while fetching
                </Typography>
              ) : (
                renderPortfolioList()
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography
              sx={{ textAlign: "center" }}
              variant="body"
              gutterBottom
            >
              Current Portfolio Value: {getCurrentPortfolioValue()}
            </Typography>{" "}
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

export default Portfolio;

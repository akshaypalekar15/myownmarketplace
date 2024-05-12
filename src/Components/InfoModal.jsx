import { useEffect } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InfoModal = ({ open, handleClose, tickerData }) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {tickerData?.ticker} - {tickerData?.name}{" "}
              <Typography variant="caption" gutterBottom>
                (Status:{" "}
                {tickerData?.active ? (
                  <span style={{ color: "green" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>Inactive</span>
                )}
                )
              </Typography>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {tickerData?.description ? (
                <span>{tickerData?.description}</span>
              ) : (
                "No description available"
              )}
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              {tickerData?.list_date ? (
                <span>Listed date: {tickerData.list_date}</span>
              ) : (
                ""
              )}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              {tickerData?.market_cap ? (
                <span>Market cap: {tickerData.market_cap}</span>
              ) : (
                ""
              )}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              {tickerData?.primary_exchange ? (
                <span>Primary exchange: {tickerData.primary_exchange}</span>
              ) : (
                ""
              )}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              {tickerData?.homepage_url ? (
                <span>
                  Website:{" "}
                  <a
                    href={tickerData.homepage_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tickerData.homepage_url}
                  </a>
                </span>
              ) : (
                ""
              )}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default InfoModal;

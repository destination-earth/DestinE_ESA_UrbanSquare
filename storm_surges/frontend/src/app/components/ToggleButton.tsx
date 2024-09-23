import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface ToggleButtonProps {
  isLoading: boolean;
  toggleOverlayLayer: () => void;
  isDisabled: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isLoading,
  toggleOverlayLayer,
  isDisabled,
}) => {
  const handleClick = () => {
    if (isDisabled) {
      // Show a message when the button is disabled
      alert("Please select all necessary parameters before running the query.");
    } else {
      toggleOverlayLayer();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "10px",
        right: "45px",
        background: isDisabled
          ? "#cccccc" // Gray background when disabled
          : isLoading
          ? "#ff0000"
          : "#51b824",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "5px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        width: "100px",
        height: "40px",
        opacity: isDisabled ? "0.6" : "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      // Remove the 'disabled' attribute to allow handling clicks
      // disabled={isDisabled}
    >
      {isLoading ? (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress size={24} sx={{ color: "white" }} />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "white",
              }}
            ></div>
          </Box>
        </Box>
      ) : (
        "RUN"
      )}
    </button>
  );
};

export default ToggleButton;

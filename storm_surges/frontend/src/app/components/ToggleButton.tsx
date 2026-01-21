import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getMonitoringService } from "../../services/monitoring.service";
import { getUserId } from "../../utils/user.utils";

interface ToggleButtonProps {
  isLoading: boolean;
  toggleOverlayLayer: () => void;
  isDisabled: boolean;
  // Add these props to pass the configuration values
  confidenceLevel: string;
  selectedSSP: string | null;
  selectedYear: string;
  stormSurge: number;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isLoading,
  toggleOverlayLayer,
  isDisabled,
  confidenceLevel,
  selectedSSP,
  selectedYear,
  stormSurge,
}) => {
  const handleClick = async () => {
    if (isDisabled) {
      alert("Please select all necessary parameters before running the query.");
    } else {
      toggleOverlayLayer();
      try {
        const monitoringService = getMonitoringService();
        const userId = await getUserId();

        await monitoringService.sendLog({
          userId,
          confidenceLevel,
          selectedSSP,
          selectedYear,
          stormSurge,
        });
      } catch (error) {
        console.error("Failed to send monitoring log:", error);
      }
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

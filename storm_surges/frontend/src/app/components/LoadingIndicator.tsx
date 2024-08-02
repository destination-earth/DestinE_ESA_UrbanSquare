import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  return (
    isLoading && (
      <Box
        sx={{
          position: "fixed",
          top: "98%",
          left: "2%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          display: "flex",
        }}
      >
        <CircularProgress size={25} />
      </Box>
    )
  );
};

export default LoadingIndicator;

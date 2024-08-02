import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const stormSurgeValues = [0, 5, 10, 15, 20, 30, 50];

interface StormSurgeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const marks = stormSurgeValues.map((value, index) => ({
  value: index,
  label: value.toString(),
}));

const Sliderr = styled(Slider)({
    height: 235,
    width: 1,
    background: 'linear-gradient(to top, cyan, yellow, red)',
    '& .MuiSlider-track': {
      border: 'none',
      backgroundColor: 'transparent',
      '&:before': {
        content: '""',
        position: 'absolute',
        height: '100%',
        width: '100%',
        background: 'inherit',
        zIndex: -1,
      },
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    },
    '& .MuiSlider-rail': {
      color: 'transparent',
    },
  });
const StormSurgeSlider: React.FC<StormSurgeSliderProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ height: 235, display: 'flex', alignItems: 'center', marginTop:'10px', opacity:'' }}>
      <Sliderr
        orientation="vertical"
        value={stormSurgeValues.indexOf(value)}
        min={0}
        max={stormSurgeValues.length - 1}
        step={1}
        marks={marks}
        onChange={(event, newValue) => onChange(stormSurgeValues[newValue as number])}
        valueLabelDisplay="auto"
        valueLabelFormat={(index) => stormSurgeValues[index as number]}
        aria-labelledby="vertical-slider"
        sx={{ mr: 2 }}
      />
      <Box>
        {stormSurgeValues.slice().reverse().map((val, index) => (
          <Typography key={index} sx={{ height: '25px', display: 'flex', alignItems: 'center' }}>
            {/* {val} */}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default StormSurgeSlider;

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectableYears = ({ data, onValueChange }) => {
  const [currentYear, setCurrentYear] = useState(data);
  const years = ['2021', '2022'];

  const handleChange = (event) => {
    setCurrentYear(event.target.value);

    // const year = data.find((year) => year.year === event.target.value);
    onValueChange('year', event.target.value);
  };

  const getYears = () =>
    years.map((year) => (
      <MenuItem key={year} value={year}>
        {year}
      </MenuItem>
    ));

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentYear}
          label="Year"
          onChange={handleChange}
        >
          {getYears()}
        </Select>
      </FormControl>
    </Box>
  );
};

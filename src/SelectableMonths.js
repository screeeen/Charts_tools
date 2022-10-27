import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectableMonths = ({ data, onValueChange }) => {
  const [currentMonth, setCurrentMonth] = useState('');

  const handleChange = (event) => {
    setCurrentMonth(event.target.value);

    const month = data.find((month) => month.name === event.target.value);
    onValueChange('month', month);
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const getMonths = () => {
    if (!data) return;
    return data.map((month) => (
      <MenuItem key={month.name} value={month.name}>
        {month.name}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Month</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentMonth}
          label="Month"
          onChange={handleChange}
        >
          {getMonths()}
        </Select>
      </FormControl>
    </Box>
  );
};

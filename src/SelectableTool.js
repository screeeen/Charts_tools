import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const SelectableTool = ({ data, onValueChange }) => {
  const [currentTool, setCurrentTool] = useState(data);
  const tools = ['All Tools', 'xxxxx', 'yyyyy', 'zzzzz'];

  const handleChange = (event) => {
    setCurrentTool(event.target.value);
    onValueChange('tool', event.target.value);
  };

  const getTools = () => {
    return tools.map((tool) => (
      <MenuItem key={tool} value={tool}>
        {tool}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tool</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentTool}
          label="Tool"
          onChange={handleChange}
        >
          {getTools()}
        </Select>
      </FormControl>
    </Box>
  );
};

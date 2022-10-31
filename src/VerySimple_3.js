import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { style, buttonRack, colorsByTool } from './style';
import { data, year, month, monthCopy } from './data';
import { SelectableYears } from './SelectableYears';
import { SelectableMonths } from './SelectableMonths';
import { SelectableTool } from './SelectableTool';
import { SelectableDays } from './SelectableDays';
import { getStepUtilityClass } from '@mui/material';
import moment from 'moment';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//TODO: make constants for every key at year, meonth, tool
//TODO:  check whats up with empty data
//TODO: implement date picker

export const options = {
  responsive: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      max: 5,
      min: 0,
      ticks: {
        stepSize: 0.5,
      },
    },
  },
};

export const VerySimple_3 = () => {
  const [filters, setfilters] = useState({
    year: moment().format('YYYY'),
    month: 'January',
    day: null,
    tool: 'All Tools',
  });

  const [currentData, setCurrentData] = useState({
    currentYearData: null,
    currentMonthData: null,
    currentToolData: null,
  });

  const labels = [...Array(32).keys()];
  const [tools, setTools] = useState([]);

  const onValueChange = (fieldName, value) => {
    setfilters((state) => ({
      ...state,
      [fieldName]: value,
    }));
  };

  // console.log('data', data);
  // console.log('filters', filters);

  const getRawDataset = () => {
    const currentYearData = Object.values(data).find((year) => year.year === filters.year);
    const currentMonthData = currentYearData.months.find((m) => m.name === filters.month);

    setCurrentData((state) => ({
      ...state,
      currentYearData,
      currentMonthData,
    }));

    const uses = Object.keys(currentMonthData.useByDay).map((e) => ({
      day: Object.keys(currentMonthData.useByDay[e])[0],
      tools: Object.values(currentMonthData.useByDay[e])[0],
    }));

    return uses;
  };

  useEffect(() => {
    const previa = getRawDataset();

    const allTools = Object.keys(previa).map((e) =>
      previa[e].tools.map((t) => ({ ...t, day: parseInt(previa[e].day) }))
    );

    const flatArray = allTools.flat();
    const toolsContainer = {};

    labels.forEach((num) => {
      Object.values(flatArray).forEach((obj, i) => {
        if (num === obj.day) {
          // si ya esta dentro de la lista, suma
          if (Object.keys(toolsContainer).find((t) => obj.advancedToolName === t)) {
            toolsContainer[obj.advancedToolName].data.push(obj.count);
            // si no lo crea
          } else {
            toolsContainer[obj.advancedToolName] = {
              label: obj.day === 1 ? new Array(1).fill(0) : new Array(),
              data: obj.day === 1 ? new Array(1).fill(0) : new Array(),
              borderColor: colorsByTool[obj.advancedToolName],
              backgroundColor: colorsByTool[obj.advancedToolName],
              tension: 0.2,
            };
            toolsContainer[obj.advancedToolName].label.push(obj.advancedToolName);
            toolsContainer[obj.advancedToolName].data.push(obj.count);
          }

          if (!Object.keys(toolsContainer).length === 0 || toolsContainer[obj.advancedToolName] !== undefined) {
            if (toolsContainer[obj.advancedToolName].data.length < obj.day) {
              const currentLength = obj.day - toolsContainer[obj.advancedToolName].data.length;
              toolsContainer[obj.advancedToolName].data.push(...Array(currentLength).fill(0));
            }
          }
        }
      });
    });

    //borrar con un método
    for (const [key, value] of Object.entries(toolsContainer)) {
      if (filters.tool !== 'All Tools') {
        if (key !== filters.tool) {
          delete toolsContainer[key];
        }
      }
    }

    setTools(toolsContainer);
  }, [filters.year, filters.month, filters.tool]);

  const datos = {
    labels,
    datasets: Object.values(tools),
  };

  return (
    <div style={style}>
      <div style={buttonRack}>
        <SelectableYears data={filters.year} onValueChange={onValueChange} />
        <SelectableMonths data={filters.month} onValueChange={onValueChange} />
        <SelectableTool data={filters.tool} onValueChange={onValueChange} />
      </div>
      <Line datasetIdKey="id" data={datos} />
    </div>
  );
};

//////////////// DATASET FORMAT ////////////////
// datasets: [
//   {
//     data: [...flatArray],
//   },
// ],
// [
//   {
//     label: 'Dataset 1',
//     data: [1, 2, 3, 4, 5, 123, 423, 232],
//     borderColor: 'rgb(255, 99, 132)',
//     backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   },
//   {
//     label: 'Dataset 2',
//     data: [34, 1067, 0, 234, 0, 234],
//     borderColor: 'rgb(53, 162, 235)',
//     backgroundColor: 'rgba(53, 162, 235, 0.5)',
//   },
// ],
// options,

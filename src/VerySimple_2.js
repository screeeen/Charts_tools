import React, { useState } from 'react';
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
import { data, year, month, monthCopy } from './data';
import { SelectableYears } from './SelectableYears';
import { SelectableMonths } from './SelectableMonths';
import { SelectableDays } from './SelectableDays';
import { getStepUtilityClass } from '@mui/material';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

export const style = {
  margin: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

export const VerySimple_2 = () => {
  const [filters, setfilters] = useState({
    year: null,
    month: null,
    day: null,
  });

  const onValueChange = (fieldName, value) => {
    setfilters((state) => ({
      ...state,
      [fieldName]: value,
    }));
  };

  console.log('filters', filters.month);

  const getRawDataset = () =>
    Object.keys(filters.month.useByDay).map((e) => ({
      day: Object.keys(filters.month.useByDay[e])[0],
      tools: Object.values(filters.month.useByDay[e])[0],
    }));

  const previa = filters.month ? getRawDataset() : [];
  const labels = [...Array(32).keys()];

  const allTools = Object.keys(previa).map((e) => previa[e].tools.map((t) => ({ ...t, day: parseInt(previa[e].day) })));
  const flatArray = allTools.flat();
  console.log('flatArray', flatArray);

  const tool = [];

  labels.forEach((num) => {
    Object.values(flatArray).forEach((obj, i) => {
      if (num === obj.day) {
        // si ya esta dentro de la lista, suma
        if (Object.keys(tool).find((t) => obj.advancedToolName === t)) {
          tool[obj.advancedToolName].data.push(obj.count);
          // si no lo crea
        } else {
          tool[obj.advancedToolName] = {
            label: obj.day === 1 ? new Array(1).fill(0) : new Array(),
            data: obj.day === 1 ? new Array(1).fill(0) : new Array(),
            borderColor: `rgb(255, 99, ${Math.random() * 255})`,
            backgroundColor: `rgba(255, 99, ${Math.random() * 255}, 0.5)`,
            tension: 0.2,
          };
          tool[obj.advancedToolName].label.push(obj.advancedToolName);
          tool[obj.advancedToolName].data.push(obj.count);
        }

        if (!Object.keys(tool).length === 0 || tool[obj.advancedToolName] !== undefined) {
          if (tool[obj.advancedToolName].data.length < obj.day) {
            const currentLength = obj.day - tool[obj.advancedToolName].data.length;
            tool[obj.advancedToolName].data.push(...Array(currentLength).fill(0));
          }
        }
      }
    });
  });

  console.log('tool', tool);

  const toolData = Object.values(tool);
  console.table('toolData', toolData);

  const datos = {
    labels,
    datasets: Object.values(tool),
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
  };

  return (
    <div style={style}>
      <SelectableYears data={data} onValueChange={onValueChange} />
      <SelectableMonths data={filters.year} onValueChange={onValueChange} />
      <Line datasetIdKey="id" data={datos} />
    </div>
  );
};

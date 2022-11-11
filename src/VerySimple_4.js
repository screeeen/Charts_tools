//f2f3f5
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
import { style, chartContainer, buttonRack, colorsByTool } from './style';
import { data, year, month, monthCopy } from './data';
import { SelectableYears } from './SelectableYears';
import { SelectableMonths } from './SelectableMonths';
import { SelectableTool } from './SelectableTool';
import { SelectableDays } from './Attic/SelectableDays';
import { getStepUtilityClass } from '@mui/material';
import moment from 'moment';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import { CustomDateRangePicker } from './CustomDateRangePicker';
import { isInclusivelyBeforeDay } from 'react-dates';

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

const getDateEntry = (datePicked, rangeDatePicked) => rangeDatePicked || datePicked || null;

const getDateEntryFromRange = (today, numOfDays, edge = 'start') => {
  if (typeof numOfDays !== 'number') {
    return;
  }

  if (edge === 'end') {
    return today;
  }
  today.subtract(numOfDays, 'days');
};

export const VerySimple_4 = () => {
  const [filters, setfilters] = useState({
    year: moment().format('YYYY'),
    month: 'January',
    day: null,
    tool: 'All Tools',
    // dateTo: null,
    // dateFrom: null,
    dateFrom: moment().subtract(1, 'years'),
    dateTo: moment(),
    AllFields: '',
  });

  const [currentData, setCurrentData] = useState({
    currentYearData: null,
    currentMonthData: null,
    currentToolData: null,
  });

  const { dateTo, dateFrom } = filters || {};
  const [focusedInput, setFocusedInput] = useState(null);
  const today = moment();
  const defaultStartDate = getDateEntryFromRange(today, 'start');
  const defaultEndDate = getDateEntryFromRange(today, 'end');

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
    console.log('*** currentMonthData', currentMonthData);
    const currentYearData = Object.values(data).find((year) => year.year === filters.year);
    const currentMonthData = currentYearData.months.find((m) => m.name === filters.month);

    setCurrentData((state) => ({
      ...state,
      currentYearData,
      currentMonthData,
    }));

    // TODO: NO DATA
    console.log('*** currentMonthData', currentMonthData);
    // TODO: NO DATA
    if (!currentMonthData) return;

    const uses = Object.keys(currentMonthData.useByDay).map((e) => ({
      day: Object.keys(currentMonthData.useByDay[e])[0],
      tools: Object.values(currentMonthData.useByDay[e])[0],
    }));

    return uses;
  };

  useEffect(() => {
    const previa = getRawDataset();

    console.log('previa', previa);

    // TODO: NO DATA
    if (!previa) return;

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

  const extractDates = () => {
    if (filters.dateFrom && filters.dateTo) {
      const range = getRange(filters.dateFrom, filters.dateTo, 'months');
      range.map((m) => console.log(m.format('YYYY MMMM')));
      const rangeYears = [...new Set(range.map((m) => m.format('YYYY')))];
      console.log('rangeYears', rangeYears);
      const rangeFormatted = range.map((m) => m.format('YYYY MMMM'));
      console.log('rangeFormatted', rangeFormatted);

      // incluye el año

      const years = Object.values(data).filter((year) => rangeYears.includes(year.year));
      console.log('years', years);

      // const months = years.map((year) => Object.values(month).filter((month) => month));
      // console.log('months', months);

      // const currentYearData_from = Object.values(data).filter((year) => year.year === YY_from);
      // currentYearData_from[0].months.map((month) => console.log('month', month));
      // const currentMonthData_from = currentYearData_from[0].months.find((month) => month.name === MMMM_from);
      // console.log('currentMonthData', currentMonthData_from);
      // // const currentDayData_from = currentYearData_from.months.filter((day) => day.name === D_from);
      // // console.log('currentMonthData', currentDayData_from);
    }
  };

  /**
   * @param {date|moment} start The start date
   * @param {date|moment} end The end date
   * @param {string} type The range type. eg: 'days', 'hours' etc
   */
  function getRange(startDate, endDate, type) {
    let fromDate = moment(startDate);
    let toDate = moment(endDate);
    let diff = toDate.diff(fromDate, type);
    let range = [];
    for (let i = 0; i < diff; i++) {
      range.push(moment(startDate).add(i, type));
    }
    return range;
  }

  extractDates();

  return (
    <div style={style}>
      <CustomDateRangePicker
        // Required
        startDate={getDateEntry(dateFrom, defaultStartDate)}
        startDateId="start-date"
        endDate={getDateEntry(dateTo, defaultEndDate)}
        endDateId="end-date"
        onDatesChange={({ startDate, endDate, preset = false }) => {
          onValueChange('dateFrom', startDate);
          onValueChange('dateTo', endDate);
        }}
        focusedInput={focusedInput}
        onFocusChange={(updatedVal) => {
          setFocusedInput(updatedVal);
          // setIsEditingDates(updatedVal);
        }}
        numberOfMonths={1} // For med and small screens? 2 for large?
        showClearDates
        anchorDirection="left"
        // presets={studyDatePresets}
        hideKeyboardShortcutsPanel
        isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
      />
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

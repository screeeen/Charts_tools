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
import { CustomDateRangePicker } from './CustomDateRangePicker';
import moment from 'moment';
import { isInclusivelyBeforeDay } from 'react-dates';
import { data } from './data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
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

export const WithChartJS_2 = () => {
  const [filters, setfilters] = useState({
    dateTo: null,
    dateFrom: null,
    AllFields: '',
  });

  const { dateTo, dateFrom } = filters || {};
  const [focusedInput, setFocusedInput] = useState(null);
  const today = moment();
  const defaultStartDate = getDateEntryFromRange(today, 'start');
  const defaultEndDate = getDateEntryFromRange(today, 'end');

  const onValueChange = (fieldName, value) => {
    setfilters((state) => ({
      ...state,
      [fieldName]: value,
    }));
  };

  let days = [];
  let month;

  console.log('general data', data);
  console.log('filters', filters);

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

  if (filters.dateFrom && filters.dateTo) {
    const years = filters.dateFrom.years().toString();
    const monthNum = filters.dateFrom.months() + 1;
    getRawDataset();
  }

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
      <Line datasetIdKey="id" data={datos} />
    </div>
  );
};

// const searchData = () => {
//   const years = filters.dateFrom.years().toString();
//   const monthNum = filters.dateFrom.months() + 1;

//   const m = data.find((year) => year.year === years);

//   const mAmount = m.months;
//   month = mAmount.find((month) => month.monthNumber.toString() === Math.abs(monthNum).toString());
//   console.log('month', month);

//   if (!month || !month.useByDay) return;

//   const da = month.useByDay;
//   da.forEach((day, i) => {
//     const dayObj = { values: Object.values(day), dayNum: Object.keys(day)[0] };
//     days.push(dayObj);
//   });
//   console.log('days', days);
// };

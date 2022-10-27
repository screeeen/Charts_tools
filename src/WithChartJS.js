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
import faker from 'faker';

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

import { CustomDateRangePicker } from './CustomDateRangePicker';
import moment from 'moment';
import { isInclusivelyBeforeDay } from 'react-dates';
import { data } from './data';

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

export const WithChartJS = () => {
  const [filters, setfilters] = useState({
    dateTo: null,
    dateFrom: null,
    AllFields: '',
  });

  const [amount, setAmount] = useState('');

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

  const searchData = () => {
    const years = filters.dateFrom.years().toString();
    const monthNum = filters.dateFrom.months() + 1;
    // console.log('dateFrom', dateFrom.format());
    // console.log('years', years, typeof years);
    // console.log('monthNum', monthNum, typeof monthNum);
    const m = data.find((year) => year.year === years);

    const mAmount = m.months;
    month = mAmount.find((month) => month.monthNumber.toString() === Math.abs(monthNum).toString());
    console.log('month', month);

    if (!month || !month.useByDay) return;

    const da = month.useByDay;
    da.forEach((day, i) => {
      const dayObj = { values: Object.values(day), dayNum: Object.keys(day)[0] };
      days.push(dayObj);
    });
    console.log('days', days);
  };

  if (filters.dateFrom && filters.dateTo) {
    searchData();
  }

  const getLines = () => {
    const specificDay = days.map((day) => day['values'][0]);
    console.log('specificDay', specificDay);
    return specificDay.map((tool) => tool.map((t) => t.count));
  };

  const dime = getLines();
  console.log('dime', dime);

  const datos = {
    labels: days.map((d) => d.dayNum),
    datasets: [
      {
        label: 'Dataset 1',
        data: getLines(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };

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

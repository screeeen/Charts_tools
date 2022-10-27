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

export const Simple = () => {
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

  console.log('general data', data);
  console.log('filters', filters);

  const getYears = () => {
    const yearFrom = filters.dateFrom.years().toString();
    const yearTo = filters.dateTo.years().toString();

    //prueba
    return filters.dateFrom.years().toString();
  };

  const getMonths = () => {
    const monthsFrom = filters.dateFrom.months() + 1;
    const monthsTo = filters.dateTo.months() + 1;

    //prueba
    return filters.dateFrom.months() + 1;
  };

  const searchData = () => {
    const years = getYears();
    const months = getMonths();
  };

  if (filters.dateFrom && filters.dateTo) {
    searchData();
  }

  const datos = {
    labels: ['dia1', 'dia2', 'dia3', 'dia4', 'dia5', 'dia6'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 3, 4, 5, 123, 423, 232],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [34, 1067, 0, 234, 0, 234],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
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

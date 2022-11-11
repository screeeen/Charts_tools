import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomDateRangePicker } from '../CustomDateRangePicker';
import moment from 'moment';
import { isInclusivelyBeforeDay } from 'react-dates';
import { data } from '../data';

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

export const ChartRechart = () => {
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
    console.log('dateFrom', dateFrom.format());
    console.log('years', years, typeof years);
    console.log('monthNum', monthNum, typeof monthNum);
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
    console.log('speci', specificDay);
    return specificDay.map((tool) => {
      console.log('tool', tool);
      return tool.map((t) => {
        return (
          <Line
            dataKey="count"
            name={t.advancedToolName}
            data={t.count}
            stroke="#8884d8"
            strokeWidth={10}
            key={t.advancedToolId}
          />
        );
      });
    });
  };

  const style = {
    margin: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart
          width={500}
          height={300}
          data={days}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis />
          <Tooltip />
          <Legend />
          {days && getLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

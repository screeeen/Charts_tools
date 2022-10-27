//  If you want to continue using CSS stylesheets and classes...
//  https://github.com/airbnb/react-dates#initialize
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import React from 'react';
import moment from 'moment';
// import i18n from '@ohif/i18n';
import { useTranslation } from 'react-i18next';
import 'react-dates/lib/css/_datepicker.css';
// import './CustomDateRangePicker.css';

export const CustomDateRangePicker = (props) => {

  const { t } = useTranslation();
  const { onDatesChange, startDate, endDate, presets, ...dateRangePickerProps } = props;

  const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    const containerStyle = {
      margin: '0 5px',
    };

    const renderYearsOptions = () => {
      const yearsRange = 20;
      const options = [];

      for (let i = 0; i < yearsRange; i++) {
        const year = moment().year() - i;
        options.push(<option value={year}>{year}</option>);
      }

      return options;
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <select className="DateRangePicker_select" value={month.month()} onChange={(e) => onMonthSelect(month, e.target.value)}>
            {moment.months().map((label, value) => (
              <option key={label + Math.random(3)} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div style={containerStyle}>
          {}
          <select className="DateRangePicker_select" value={month.year()} onChange={(e) => onYearSelect(month, e.target.value)}>
            {renderYearsOptions()}
          </select>
        </div>
      </div>
    );
  };

  return (
    <DateRangePicker
      {...dateRangePickerProps}
      startDate={startDate}
      endDate={endDate}
      onDatesChange={onDatesChange}
      renderMonthElement={renderMonthElement}
      startDatePlaceholderText={t('Start Date')}
      endDatePlaceholderText={t('End Date')}
      phrases={{
        closeDatePicker: t('Common:Close'),
        clearDates: t('Clear dates'),
      }}
    />
  );
};

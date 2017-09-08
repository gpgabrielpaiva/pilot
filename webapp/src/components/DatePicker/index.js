import React from 'react'
import {
  DateRangePicker,
  SingleDatePicker,
} from 'react-dates'
import {
  merge,
  omit,
  is,
  contains,
} from 'ramda'
import classNames from 'classnames'
import IconAngleLeft from 'react-icons/lib/fa/angle-left'
import IconAngleRight from 'react-icons/lib/fa/angle-right'

import moment from './moment'

import StateComponent from './StateComponent'
import ShowDate from './ShowDate'
import ControlButtons from './ControlButtons'

import './style.scss'

const WEEKENDS = [0, 6]

class DatePicker extends StateComponent {
  constructor (props) {
    super(props)
    this.onFocusChange = this.onFocusChange.bind(this)
    this.isDayBlocked = this.isDayBlocked.bind(this)
  }

  onFocusChange (isFocused) {
    if (isFocused === null) { return }

    if (is(Boolean, isFocused)) {
      this.setState({ focused: isFocused })
    } else {
      this.setState({ focusedInput: isFocused })
    }
  }

  isDayBlocked (day) {
    return this.props.disableWeekends && contains(day.day(), WEEKENDS)
  }

  render () {
    const {
      startDate,
      endDate,
      focusedInput,
      date,
      focused,
    } = this.state

    const {
      range,
    } = this.props

    const filteredProps = omit(
      [
        'range',
        'onDateChange',
        'onDatesChange',
        'onFocusChange',
        'disableWeekends',
      ],
      this.props
    )

    const className = classNames({
      DatePicker: true,
      DatePicker_default: !range,
      DatePicker_range: range,
    })

    return (
      <div
        onClick={this.toggleOpen}
        role="button"
        tabIndex="0"
        style={{ display: 'inline-block' }}
      >
        {range && (
          <div
            className={className}
          >
            {focusedInput && (
              <div className="DatePicker__pane">
                <ShowDate
                  date={moment(startDate)}
                  period="start"
                  onPeriodChange={this.onPeriodChange}
                />
                <ShowDate
                  date={moment(endDate)}
                  period="end"
                  onPeriodChange={this.onPeriodChange}
                />
              </div>
            )}

            <DateRangePicker
              {...merge(this.defaultProps, filteredProps)}
              onFocusChange={this.onFocusChange}
              isDayBlocked={this.isDayBlocked}
              startDate={startDate}
              endDate={endDate}
              focusedInput={focusedInput}
              onDatesChange={this.onDatesChange}
              startDatePlaceholderText="Inicio"
              endDatePlaceholderText="Fim"
              renderCalendarInfo={() => (
                <ControlButtons
                  focused={focused}
                  onCancel={this.onClickCancelDates}
                  onConfirm={this.onClickConfirmDates}
                />
              )}
            />
          </div>
        )}

        {!range && (
          <div
            className={className}
          >
            {focused && (
              <div className="DatePicker__pane">
                <ShowDate
                  date={moment(date)}
                  onYearChange={this.onYearChange}
                />
              </div>
            )}

            <SingleDatePicker
              {...merge(this.defaultProps, filteredProps)}
              onFocusChange={this.onFocusChange}
              isDayBlocked={this.isDayBlocked}
              focused={focused}
              date={date}
              numberOfMonths={1}
              onDateChange={this.onDateChange}
              renderCalendarInfo={() => (
                <ControlButtons
                  focused={focused}
                  onCancel={this.onClickCancelDates}
                  onConfirm={this.onClickConfirmDates}
                />
              )}
            />
          </div>
        )}
      </div>
    )
  }
}

DatePicker.defaultProps = {
  hideKeyboardShortcutsPanel: true,
  navPrev: <IconAngleLeft />,
  navNext: <IconAngleRight />,
  keepOpenOnDateSelect: true,
  readOnly: true,
}

export default DatePicker

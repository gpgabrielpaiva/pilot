import React from 'react'
import shortid from 'shortid'
import {
  invoker,
  lensPath,
  set,
} from 'ramda'

import {
  func,
  shape,
  arrayOf,
  string,
  bool,
  instanceOf,
} from 'prop-types'

import moment from 'moment'

import IconCalendar from 'react-icons/lib/fa/calendar'

import MaskedInput from 'react-maskedinput'
import clickOutside from 'react-click-outside'
import classNames from 'classnames'

import DateSelector from '../../DateSelector'

import style from './style.css'
import toolItemStyle from '../style.css'

const getInputClasses = (focused, active, error) => classNames(
  toolItemStyle.root,
  {
    [toolItemStyle.focused]: !error && focused,
    [toolItemStyle.active]: !error && active,
    [toolItemStyle.error]: error,
  }
)

const DATE_MASK = 'L'

const formatMoment = invoker(1, 'format')(DATE_MASK)

const textToMoment = ({ start, end }) => ({
  start: start ? moment(start, DATE_MASK, true).startOf('day') : null,
  end: end ? moment(end, DATE_MASK, true).endOf('day') : null,
})

const momentToText = ({ start, end }) => ({
  start: start ? start.format(DATE_MASK) : '',
  end: end ? end.format(DATE_MASK) : '',
})

// const validDates = ({ start, end }) =>
//   moment(start).isValid() && moment(end).isValid()
//
const isEndInputShown = (dates) => {
  if (dates.start === dates.end) {
    return false
  }

  const { start, end } = textToMoment(dates)

  if (start === end) {
    return false
  }

  if (start && start.isSame(end, 'day')) {
    return false
  }

  const now = moment()

  if (now.isSame(start, 'day') && now.isSame(end, 'day')) {
    return false
  }

  return true
}

const inputWrapStartClasses = ({
  showDateSelector,
  focusedInput,
  isValid,
  start,
}) =>
  classNames(
    style.expander,
    {
      [style.show]: showDateSelector || start,
      [style.hide]: !showDateSelector && !start,
      [style.inputActive]: isValid && focusedInput === 'startDate' && showDateSelector,
      [style.inputError]: !isValid,
    }
  )

const initialPlaceholderClasses = ({ showDateSelector, start }) =>
  classNames(
    style.initialPlaceholder,
    {
      [style.show]: !showDateSelector && !start,
      [style.hide]: showDateSelector || start,
    }
  )

const inputWrapEndClasses = ({
  showDateSelector,
  focusedInput,
  isValid,
}) =>
  classNames(
    style.expander,
    {
      [style.inputActive]: isValid && focusedInput === 'endDate' && showDateSelector,
      [style.inputError]: !isValid,
    }
  )

class DateInput extends React.Component {
  constructor (props) {
    super(props)

    const {
      dates,
    } = props

    this.state = {
      dates: {},
      focusedInput: 'startDate',
      showDateSelector: false,
    }

    if (dates.start) {
      this.state.dates.start = formatMoment(dates.start)
    }

    if (dates.end) {
      this.state.dates.end = formatMoment(dates.end)
    }

    this.name = shortid.generate()

    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleDatesChange = this.handleDatesChange.bind(this)
    this.handleSelectorFocus = this.handleSelectorFocus.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)

    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)

    this.changeSelectorDisplay = this.changeSelectorDisplay.bind(this)
  }

  componentWillReceiveProps (props) {
    if (props && props.dates) {
      const { dates } = props

      this.setState({
        dates: momentToText(dates),
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown, true)
  }

  handleClickOutside () {
    if (this.state.showDateSelector) {
      this.handleCancel()
    }
  }

  handleKeyDown (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleConfirm(this.state.dates)
      return
    }

    if (event.key === 'Escape') {
      this.handleCancel()
    }
  }

  changeSelectorDisplay (showDateSelector, focusedInput) {
    if (!showDateSelector) {
      document.removeEventListener('keydown', this.handleKeyDown, true)
    }
    this.setState({ showDateSelector, focusedInput })
  }

  handleInputChange (input, event) {
    const { value } = event.target
    const { start, end } = this.state.dates

    if (start === end) {
      const dates = {
        start: value,
        end: value,
      }

      this.setState({ dates })
      return
    }

    const inputLens = lensPath(['dates', input])
    const state = set(inputLens, value, this.state)

    this.setState(state)
  }

  handleDatesChange (dates) {
    this.setState({
      dates: momentToText(dates),
    })
  }

  handleConfirm (dates) {
    const { start, end } = textToMoment(dates)

    if (!start || !(start.isValid() && end.isValid())) {
      return
    }

    this.changeSelectorDisplay(false)
    this.props.onChange({ start, end })
  }

  handleCancel () {
    const { dates } = this.props
    const textDates = momentToText(dates)

    this.setState({
      dates: textDates,
    }, () => {
      // called in the callback as it will setState again
      this.changeSelectorDisplay(false)
      this.props.onChange(dates)
    })
  }

  handleInputFocus (focusedInput) {
    document.addEventListener('keydown', this.handleKeyDown, true)
    this.changeSelectorDisplay(true, focusedInput)
  }

  handleInputBlur () {
    if (!this.state.showDateSelector) {
      document.removeEventListener('keydown', this.handleKeyDown, true)
    }
  }

  handleSelectorFocus (focusedInput) {
    this.setState({ focusedInput })
  }

  render () {
    const {
      dates,
      showDateSelector,
      focusedInput,
    } = this.state

    const {
      active,
    } = this.props


    const momentDates = textToMoment(dates)
    const error =
      !(momentDates.start === null || momentDates.start.isValid())
      || !(momentDates.end === null || momentDates.end.isValid())

    const mask = moment().format(DATE_MASK).replace(/\d/g, '1')

    return (
      <div className={getInputClasses(showDateSelector, active, error)}>
        <div
          className={classNames(style.flex, style.label)}
        >
          <div className={toolItemStyle.icon}>
            <IconCalendar />
          </div>

          <div
            className={inputWrapStartClasses({
              start: dates.start,
              showDateSelector,
              focusedInput,
              isValid: momentDates.start === null || momentDates.start.isValid(),
            })}
          >
            <MaskedInput
              mask={mask}
              size="8"
              onFocus={() => this.handleInputFocus('startDate')}
              onBlur={this.handleInputBlur}
              className={style.input}
              placeholderChar=" "
              name="startDate"
              onChange={value => this.handleInputChange('start', value)}
              placeholder="Inicio"
              value={dates.start}
              id={`${this.name}-startDate`}
            />
            <span className={style.expanderSpan}>{dates.start || 'Inicio'}</span>
          </div>

          <label
            htmlFor={`${this.name}-startDate`}
            className={initialPlaceholderClasses({ showDateSelector, start: dates.start })}
          >
            Selecione um dia ou período
          </label>

          <div className={classNames(style.separator, toolItemStyle.separator)} />

          {isEndInputShown(dates)
            ? (
              <div
                className={inputWrapEndClasses({
                  showDateSelector,
                  focusedInput,
                  isValid: momentDates.end === null || momentDates.end.isValid(),
                })}
              >
                <MaskedInput
                  mask={mask}
                  size="8"
                  onFocus={() => this.handleInputFocus('endDate')}
                  onBlur={this.handleInputBlur}
                  className={style.input}
                  placeholderChar=" "
                  name="endDate"
                  onChange={value => this.handleInputChange('end', value)}
                  placeholder="Fim"
                  value={dates.end}
                />
                <span className={style.expanderSpan}>{dates.end || 'Fim'}</span>
              </div>
            ) : (
              null
            )
          }
        </div>

        {showDateSelector ?
          <div className={style.absolutePosition}>
            <DateSelector
              dates={textToMoment(this.state.dates)}
              onChange={this.handleDatesChange}
              onCancel={this.handleCancel}
              onConfirm={this.handleConfirm}
              onFocusChange={this.handleSelectorFocus}
              focusedInput={this.state.focusedInput}
              presets={this.props.presets}
            />
          </div>
          : null
        }
      </div>
    )
  }
}

DateInput.propTypes = {
  active: bool,
  onChange: func.isRequired,
  dates: shape({
    start: instanceOf(moment),
    end: instanceOf(moment),
  }),
  presets: arrayOf(shape({
    key: string,
    title: string,
    date: func,
    items: arrayOf(shape({
      title: string,
      date: func,
      key: string,
    })),
  })).isRequired,
}

DateInput.defaultProps = {
  active: false,
  dates: {
    start: null,
    end: null,
  },
}

export default clickOutside(DateInput)

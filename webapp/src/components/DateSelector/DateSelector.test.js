import React from 'react'
import { shallow, mount } from 'enzyme'
import moment from 'moment'

import DateSelector from './index'
import Button from '../Button'

const presets = [
  {
    title: 'Últimos:',
    items: [
      {
        key: 'last-7',
        title: '7 dias',
        date: () => -7,
      },
    ],
  },
]

const dates = {
  start: moment(),
  end: moment(),
}

describe('DateSelector', () => {
  it('should mount component', () => {
    shallow(
      <DateSelector
        presets={presets}
        dates={dates}
        focusedInput="startDate"
      />
    )
  })

  it('should call onConfirm', () => {
    const onConfirm = jest.fn()

    const component = shallow(
      <DateSelector
        presets={presets}
        dates={dates}
        focusedInput="startDate"
        onConfirm={onConfirm}
      />
    )

    component
      .find(Button)
      .at(1)
      .simulate('click')

    const lastOnConfirmCalledWith = onConfirm.mock.calls[0][0]

    expect(lastOnConfirmCalledWith.start).toBeInstanceOf(moment)
    expect(lastOnConfirmCalledWith.end).toBeInstanceOf(moment)
  })

  it('should call onCancel', () => {
    const onCancel = jest.fn()

    const component = shallow(
      <DateSelector
        presets={presets}
        dates={dates}
        focusedInput="startDate"
        onCancel={onCancel}
      />
    )

    component
      .find(Button)
      .first()
      .simulate('click')

    expect(onCancel).toHaveBeenCalled()
  })

  describe('Date Range', () => {
    it('should return { start, end } onChange', () => {
      const onChange = jest.fn()

      const component = shallow(
        <DateSelector
          presets={presets}
          dates={dates}
          focusedInput="startDate"
          onChange={onChange}
        />
      )

      component
        .find('li')
        .at(1)
        .find('input')
        .simulate('change')

      const dateReceived = onChange.mock.calls[0][0]

      expect(onChange).toHaveBeenCalled()
      expect(dateReceived.start).toBeInstanceOf(moment)
      expect(dateReceived.end).toBeInstanceOf(moment)
    })

    it('should return a seven-day interval', () => {
      const onChange = jest.fn()

      const component = shallow(
        <DateSelector
          presets={presets}
          dates={dates}
          focusedInput="startDate"
          onChange={onChange}
        />
      )

      component
        .find('li')
        .at(1)
        .find('input')
        .simulate('change')

      const { start, end } = onChange.mock.calls[0][0]
      const startDate = moment(start)
      const endDate = moment(end)

      const dateDiff = startDate.diff(endDate, 'days')

      expect(dateDiff).toBe(-7)
    })

    it('should call onFocusChange', () => {
      const onFocusChange = jest.fn()
      const onChange = jest.fn()

      let focusedInputHistory = []

      class TestComponent extends React.Component {
        constructor () {
          super()

          this.state = {
            dates: {},
            focusedInput: 'startDate',
          }

          this.onFocusChange = this.onFocusChange.bind(this)
          this.onChange = this.onChange.bind(this)
        }

        onFocusChange (focusedInput) {
          focusedInputHistory.push(focusedInput)
          this.setState({ focusedInput })
        }

        onChange (dates) {
          this.setState({ dates })
        }

        render () {
          return (
            <DateSelector
              presets={presets}
              dates={this.state.dates}
              focusedInput={this.state.focusedInput}
              onFocusChange={this.onFocusChange}
              onChange={this.onChange}
            />
          )
        }
      }

      const component = mount(<TestComponent />)

      // select period preset
      component
        .find('ol input')
        .last()
        .simulate('change')

      // chose the startDate
      component.find('table').at(2).find('button').at(4).simulate('click')
      expect(focusedInputHistory[0]).toBe('endDate')

      // chose the endDate
      component.find('table').at(2).find('button').at(10).simulate('click')
      expect(focusedInputHistory[1]).toBe('startDate')
    })
  })
})

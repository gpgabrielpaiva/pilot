import React from 'react'
import { shallow } from 'enzyme'
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

  describe('seven days preset', () => {
    it('should return { start, end }', () => {
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
      expect(dateReceived).toHaveProperty('start')
      expect(dateReceived).toHaveProperty('end')
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
})

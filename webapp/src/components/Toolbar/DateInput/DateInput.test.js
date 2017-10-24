import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'

import DateInput from './index'
import DateSelector from './../../DateSelector'
import Button from './../../Button'

const presets = [{
  title: 'Últimos x dias',
  items: [{
    title: 'title 1',
    date: () => 1,
    key: 'k1',
  }, {
    title: 'title 2',
    date: () => 2,
    key: 'k2',
  }, {
    title: 'title 3',
    date: () => 3,
    key: 'k3',
  }],
}]

describe('DatePicker', () => {
  it('should mount with basic props', () => {
    const onChange = jest.fn()

    mount(
      <DateInput
        presets={[]}
        active
        onChange={onChange}
      />
    )
  })

  it('should render DateSelector when focused', () => {
    const onChange = jest.fn()

    const component = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
      />
    )

    let datePicker = component.find(DateSelector)

    expect(datePicker.length).toBe(0)

    component.find('input').at(0).simulate('focus')

    datePicker = component.find(DateSelector)

    expect(datePicker.length).toBe(1)
  })

  it('should call onChange when confirmed', () => {
    const onChange = jest.fn()

    const component = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
        dates={{ start: null, end: null }}
      />
    )

    component.find('input').first().simulate('focus')
    component.find('ol input').at(0).simulate('change')
    component.find(Button).at(1).simulate('click')

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should return start and end properties', () => {
    const onChange = jest.fn()

    const component = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
        dates={{ start: null, end: null }}
      />
    )

    component.find('input').first().simulate('focus')
    component.find('ol input').at(0).simulate('change')
    component.find(Button).at(1).simulate('click')

    const dates = onChange.mock.calls[0][0]

    expect(dates).toHaveProperty('start')
    expect(dates).toHaveProperty('end')

    expect(dates.start).toBeInstanceOf(moment)
    expect(dates.end).toBeInstanceOf(moment)
  })

  it('should show end input when appropriate', () => {
    const onChange = jest.fn()

    const component = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
        dates={{ start: null, end: null }}
      />
    )

    const componentWithEnd = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
        dates={{ start: moment(), end: moment().add(10, 'days') }}
      />
    )

    const componentWithNullEnd = mount(
      <DateInput
        onChange={onChange}
        presets={presets}
        dates={{ start: moment(), end: null }}
      />
    )

    const inputs = component.find('input').length
    const inputsWithEnd = componentWithEnd.find('input').length
    const inputsWithNullEnd = componentWithEnd.find('input').length

    expect(inputs).toBe(1)
    expect(inputsWithEnd).toBe(2)
    expect(inputsWithNullEnd).toBe(2)
  })
})


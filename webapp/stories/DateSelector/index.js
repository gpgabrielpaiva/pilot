import React from 'react'

import { storiesOf } from '@storybook/react'

import moment from 'moment'

import DateSelector from '../../src/components/DateSelector'

import style from './style.css'

const presets = [
  {
    title: 'Últimos:',
    items: [
      {
        key: 'last-7',
        title: '7 dias',
        date: () => -7,
      },
      {
        key: 'last-15',
        title: '15 dias',
        date: () => -15,
      },
      {
        key: 'last-30',
        title: '30 dias',
        date: () => -30,
      },
      {
        key: 'last-60',
        title: '60 dias',
        date: () => -60,
      },
    ],
  },
]

class DateSelectorExample extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dates: {
        start: moment(),
        end: moment(),
      },
      focusedInput: 'startDate',
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
  }

  handleChange (dates) {
    this.setState({ dates })
  }

  handleFocusChange (focusedInput) {
    this.setState({ focusedInput })
  }

  render () {
    return (
      <DateSelector
        presets={presets}
        dates={this.state.dates}
        focusedInput={this.state.focusedInput}
        onFocusChange={this.handleFocusChange}
        onChange={this.handleChange}
        onConfirm={dates => console.log('onConfirm', dates)}
        onCancel={() => console.log('onCancel')}
      />
    )
  }
}


storiesOf('DateSelector', module)
  .add('All types', () => (
    <div className={style.container}>
      <DateSelectorExample />
    </div>
  ))

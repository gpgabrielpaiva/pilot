import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots'
import MockDate from 'mockdate'

MockDate.set(1506783600000)

function createNodeMock (element) {
  if (element.type) {
    return {
      __consolidated_events_handlers__: null,
      addEventListener: () => ':poop:',
      querySelectorAll: () => [],
      style: {
        height: 0,
      },
    }
  }

  return null
}

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock,
  }),
})

jest.mock('react-dom', () => ({
  findDOMNode: () => ({
    querySelector: () => null,
  }),
}))

global.getComputedStyle = () => ({
  styleSheets: {},
})

import { render } from 'react-dom'
import React, { Component } from 'react'
import DragScrollProvider from '../src/DragScrollProvider'
import './app.css'

const COLORS = ['red', 'blue', 'orange', 'black', 'yellow']

class Example extends Component {
  constructor(props) {
    super(props)
    this.numberOfCards = 100
  }

  getRandomNumber(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start)
  }

  getCards() {
    let cardArray = []
    for (let i = 0; i < this.numberOfCards; i++) {
      const color = COLORS[this.getRandomNumber(0, COLORS.length - 1)]
      cardArray.push(<Card key={i} color={color} />)
    }
    return cardArray
  }

  render() {
    return (
      <div className="example">
        <DragScrollProvider>
          {({ onMouseDown, ref }) => (
            <div
              className="example__scroll"
              ref={ref}
              onMouseDown={onMouseDown}
            >
              {this.getCards()}
            </div>
          )}
        </DragScrollProvider>
      </div>
    )
  }
}

const Card = ({ color }) => {
  return <div style={{ backgroundColor: color, width: 80, height: 120 }} />
}

render(<Example />, document.getElementById('root'))

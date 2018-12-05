import { render } from 'react-dom'
import React, { Component } from 'react'
import DragScrollProvider from '../src/DragScrollProvider'
import './app.css'

const COLORS = ['red', 'blue', 'orange', 'black', 'yellow']

class Example extends Component {
    constructor(props) {
        super(props)
        this.numberOfCards = 1000
    }

    getRandomNumber(start, end) {
        return Math.floor(Math.random() * (end - start + 1) + start)
    }

    getCards(clickItem) {
        let cardArray = []
        for (let i = 0; i < this.numberOfCards; i++) {
            const color = COLORS[this.getRandomNumber(0, COLORS.length - 1)]
            cardArray.push(
                <Card
                    key={i}
                    color={color}
                    onClick={() => clickItem(() => this.handleClick(i))}
                />
            )
        }
        return cardArray
    }

    handleClick = index => {
        console.log('Card click:', index)
    }

    render() {
        return (
            <div className="example">
                <h1>Horizontal example</h1>
                <div className="example__container">
                    <DragScrollProvider>
                        {({ onMouseDown, ref, clickItem }) => (
                            <div
                                className="example__scroll example__scroll--horizontal "
                                ref={ref}
                                onMouseDown={onMouseDown}>
                                {this.getCards(clickItem)}
                            </div>
                        )}
                    </DragScrollProvider>
                </div>
                <h1>Vertical example</h1>
                <div className="example__container">
                    <DragScrollProvider vertical={true}>
                        {({ onMouseDown, ref }) => (
                            <div
                                className="example__scroll example__scroll--vertical"
                                ref={ref}
                                onMouseDown={onMouseDown}>
                                {this.getCards()}
                            </div>
                        )}
                    </DragScrollProvider>
                </div>
            </div>
        )
    }
}

const Card = ({ color, onClick }) => {
    return (
        <div
            style={{ backgroundColor: color, width: 80, height: 120 }}
            onClick={onClick}
        />
    )
}

render(<Example />, document.getElementById('root'))

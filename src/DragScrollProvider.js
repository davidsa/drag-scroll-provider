/*eslint no-restricted-globals: 0*/

import React, { Component } from 'react'

const DEFAULT_THRESHOLD = 0.15

export default class DragScrollProvider extends Component {
    constructor(props) {
        super(props)
        this.privateState = {
            isMouseDown: false,
            lastMousePosition: null,
            startTime: null,
        }
        this.refElement = null
        this.clearListeners = []
        this.scrollAttr = 'scrollLeft'
        this.eventMove = 'clientX'
        this.scrollLength = 'scrollWidth'
        this.scrollOffset = 'offsetWidth'
    }

    setPrivateState(state) {
        this.privateState = { ...this.privateState, ...state }
    }

    addEventListenerWithClear(type, func) {
        this.refElement.addEventListener(type, func)
        const clear = this.removeListenerFactory(type, func)
        this.clearListeners.push(clear)
    }

    removeListenerFactory(eventName, listener) {
        return () => removeEventListener(eventName, listener)
    }

    componentDidMount() {
        if (this.props.vertical) {
            this.scrollAttr = 'scrollTop'
            this.eventMove = 'clientY'
            this.scrollLength = 'scrollHeight'
            this.scrollOffset = 'offsetHeight'
        }
        this.threshold = this.props.threshold || DEFAULT_THRESHOLD
        this.addEventListenerWithClear('mouseup', this.onMouseUp)
        this.addEventListenerWithClear('mousemove', this.onMouseMove)
    }

    componentWillUnmount() {
        this.clearListeners.forEach(clear => clear())
    }

    keepScrolling(acceleration) {
        const max =
            this.refElement[this.scrollLength] -
            this.refElement[this.scrollOffset]
        this.animation = setTimeout(() => {
            const scroll = this.refElement[this.scrollAttr]
            if (scroll !== 0 && scroll !== max && acceleration !== 0) {
                this.refElement[this.scrollAttr] += acceleration
                acceleration =
                    acceleration > 0 ? acceleration - 1 : acceleration + 1
                return this.keepScrolling(acceleration)
            }
        }, 10)
    }

    onMouseMove = event => {
        const { isMouseDown, lastMousePosition } = this.privateState
        if (!isMouseDown) {
            return null
        }

        if (this.refElement === null) {
            return null
        }

        if (lastMousePosition === null) {
            return null
        }
        this.refElement[this.scrollAttr] +=
            lastMousePosition - event[this.eventMove]
        this.setPrivateState({
            lastMousePosition: event[this.eventMove],
        })
    }

    onMouseUp = () => {
        const { startTime, positionStart } = this.privateState
        const positionEnd = this.refElement[this.scrollAttr]
        const distance = positionEnd - positionStart
        const time = (new Date() - startTime) / 1000
        const velocity = Math.round(distance / time)
        const acceleration = Math.round(velocity / time / 100)
        this.setPrivateState({
            isMouseDown: false,
            lastMousePosition: null,
            time,
        })
        this.keepScrolling(acceleration)
    }

    provisionOnMouseDown = event => {
        if (this.animation) {
            clearTimeout(this.animation)
        }
        this.setPrivateState({
            isMouseDown: true,
            lastMousePosition: event[this.eventMove],
            startTime: new Date(),
            positionStart: this.refElement[this.scrollAttr],
        })
    }

    provisionRef = element => {
        this.refElement = element
    }

    scrollRight = () => {
        this.refElement.classList.add('dragScroll')
        this.refElement.scrollLeft += this.props.scrollDistance
        this.refElement.classList.remove('dragScroll')
    }

    scrollLeft = () => {
        this.refElement.classList.add('dragScroll')
        this.refElement.scrollLeft -= this.props.scrollDistance
        this.refElement.classList.remove('dragScroll')
    }

    scrollTo = position => {
        if (!this.refElement) {
            return null
        }
        this.refElement.classList.add('dragScroll')
        this.refElement.scrollLeft = position
        this.refElement.classList.remove('dragScroll')
    }

    clickItem = callback => {
        const { time } = this.privateState
        if (!time || time > this.threshold) {
            return null
        }
        return callback()
    }

    render() {
        return this.props.children({
            onMouseDown: this.provisionOnMouseDown,
            clickItem: this.clickItem,
            ref: this.provisionRef,
            scrollRight: this.scrollRight,
            scrollLeft: this.scrollLeft,
            scrollTo: this.scrollTo,
        })
    }
}

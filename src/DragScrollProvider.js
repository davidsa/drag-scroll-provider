/*eslint no-restricted-globals: 0*/

import React, { Component } from 'react'

export default class DragScrollProvider extends Component {
  constructor(props) {
    super(props)
    this.privateState = {
      isMouseDown: false,
      lastMousePosition: null,
      dragging: false,
    }
    this.refElement = null
    this.clearListeners = []
    this.scrollAttr = 'scrollLeft'
    this.eventMove = 'clientX'
  }

  setPrivateState(state) {
    this.privateState = { ...this.privateState, ...state }
  }

  addEventListenerWithClear(type, func) {
    document.documentElement.addEventListener(type, func)
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
    }
    this.addEventListenerWithClear('mouseup', this.onMouseUp)
    this.addEventListenerWithClear('mousemove', this.onMouseMove)
  }

  componentWillUnmount() {
    this.clearListeners.forEach(clear => clear())
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
      dragging: true,
    })
  }

  onMouseUp = event => {
    this.setPrivateState({ isMouseDown: false, lastMousePosition: null })
  }

  provisionOnMouseDown = event => {
    this.setPrivateState({
      isMouseDown: true,
      lastMousePosition: event[this.eventMove],
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
    const { dragging } = this.privateState
    if (dragging) {
      return this.setPrivateState({ dragging: false })
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

import React from 'react'
import DragScrollProvider from '../src/DragScrollProvider'
import { expect } from 'chai'
import { createSandbox } from 'sinon'
import { mount, shallow } from 'enzyme'

const sandbox = createSandbox()

const children = props => {
    props.ref({ addEventListener: sandbox.spy(), scrollLeft: 100 })
    return null
}

function getWrapper(props) {
    return mount(<DragScrollProvider {...props}>{children}</DragScrollProvider>)
}

describe('DragScrollProvider', () => {
    afterEach(() => {
        sandbox.restore()
    })

    describe('render', () => {
        it('should pass onMouseDown as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('onMouseDown')
                expect(typeof props.onMouseDown).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })

        it('should pass ref as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('ref')
                expect(typeof props.ref).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })

        it('should pass scrollRight as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('scrollRight')
                expect(typeof props.scrollRight).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })

        it('should pass scrollLeft as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('scrollLeft')
                expect(typeof props.scrollLeft).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })

        it('should pass scrollTo as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('scrollTo')
                expect(typeof props.scrollTo).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })

        it('should pass clickItem as a function', () => {
            const children = props => {
                props.ref({ addEventListener: sandbox.spy() })
                expect(props).to.have.property('clickItem')
                expect(typeof props.clickItem).to.equal('function')
                return null
            }
            mount(<DragScrollProvider>{children}</DragScrollProvider>)
        })
    })

    describe('provisionOnMouseDown', () => {
        const event = {
            clientX: 100,
        }
        let setStateSpy
        let wrapper
        const date = new Date()
        let clock
        let animationValue = false
        beforeEach(() => {
            setStateSpy = sandbox.spy(
                DragScrollProvider.prototype,
                'setPrivateState'
            )
            clock = sandbox.useFakeTimers(date)
            wrapper = getWrapper()
            const instance = wrapper.instance()
            instance.animation = setTimeout(() => (animationValue = true))
            instance.provisionOnMouseDown(event)
        })

        it('should call setState with isMouseDown: true', () => {
            expect(setStateSpy.getCall(0).args[0]).to.have.property(
                'isMouseDown',
                true
            )
        })

        it('should call setState with lastMousePosition', () => {
            expect(setStateSpy.getCall(0).args[0]).to.have.property(
                'lastMousePosition',
                event.clientX
            )
        })

        it('should call setState with startTime', () => {
            const { startTime } = setStateSpy.getCall(0).args[0]
            expect(startTime.getTime()).to.equal(date.getTime())
        })

        it('should call setState with positionStart', () => {
            expect(setStateSpy.getCall(0).args[0]).to.have.property(
                'positionStart',
                100
            )
        })

        it('should clear the animation timeout', () => {
            clock.tick(500)
            expect(animationValue).to.equal(false)
        })
    })

    describe('provisionRef', () => {
        let instance
        beforeEach(() => {
            const wrapper = getWrapper()
            instance = wrapper.instance()
        })
        it('should set refElement', () => {
            const spy = sandbox.spy()
            instance.provisionRef(spy)
            expect(instance.refElement).to.equal(spy)
        })
    })

    describe('scrollRight', () => {
        let instance
        beforeEach(() => {
            instance = getWrapper({ scrollDistance: 150 }).instance()
            instance.refElement = {
                classList: { add: sandbox.spy(), remove: sandbox.spy() },
                scrollLeft: 0,
            }
        })

        it('should add dragScroll to the classList', () => {
            instance.scrollRight()
            expect(instance.refElement.classList.add.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should remove dragScroll from the classList', () => {
            instance.scrollRight()
            expect(instance.refElement.classList.remove.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should add scrollDistance amount to scrollLeft', () => {
            instance.scrollRight()
            expect(instance.refElement.scrollLeft).to.equal(150)
        })
    })

    describe('scrollLeft', () => {
        let instance
        beforeEach(() => {
            instance = getWrapper({ scrollDistance: 150 }).instance()
            instance.refElement = {
                classList: { add: sandbox.spy(), remove: sandbox.spy() },
                scrollLeft: 0,
            }
        })

        it('should add dragScroll to the classList', () => {
            instance.scrollLeft()
            expect(instance.refElement.classList.add.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should remove dragScroll from the classList', () => {
            instance.scrollLeft()
            expect(instance.refElement.classList.remove.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should add scrollDistance amount to scrollLeft', () => {
            instance.scrollLeft()
            expect(instance.refElement.scrollLeft).to.equal(-150)
        })
    })

    describe('scrollTo', () => {
        let instance
        const amount = 200
        beforeEach(() => {
            instance = getWrapper().instance()
            instance.refElement = {
                classList: { add: sandbox.spy(), remove: sandbox.spy() },
                scrollLeft: 0,
            }
        })

        it('should return null if there is no refElement', () => {
            instance.refElement = undefined
            const result = instance.scrollTo(amount)
            expect(result).to.be.null
        })

        it('should add dragScroll to the classList', () => {
            instance.scrollTo(amount)
            expect(instance.refElement.classList.add.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should remove dragScroll from the classList', () => {
            instance.scrollTo(amount)
            expect(instance.refElement.classList.add.callCount).to.equal(1)
            expect(
                instance.refElement.classList.add.getCall(0).args[0]
            ).to.equal('dragScroll')
        })

        it('should set scrollLeft with the position', () => {
            instance.scrollTo(amount)
            expect(instance.refElement.scrollLeft).to.equal(amount)
        })
    })

    describe('clickItem', () => {
        let instance

        beforeEach(() => {
            instance = getWrapper({ threshold: 0.1 }).instance()
        })

        it('should call the callback when time is smaller than the threshold', () => {
            instance.privateState = { time: 0.01 }
            const callback = sandbox.spy()
            instance.clickItem(callback)
            expect(callback.callCount).to.equal(1)
        })
    })
})

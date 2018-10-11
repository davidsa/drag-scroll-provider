## Drag Scroll Provider

Simple react component to enable scrolling with the mouse.

### Installation

`yarn add drag-scroll-provider`

or

`npm install --save drag-scroll-provider`


### Usage

* Import component

```javascript
import DragScrollProvider from 'drag-scroll-provider'
```

* Wrap the component you want to drag and scroll

```jsx
<DragScrollProvider>
    {({ onMouseDown, ref }) => (
        <div
          className="scrollable"
          ref={ref}
          onMouseDown={onMouseDown}>
            // content that overflows the parent
        </div>
    )}
</DragScrollProvider>
```

* Make sure the element has fixed width (is you want to scroll horizontally) or fixed height (if you want to scroll vertically) and has the overflow propert scroll.

```css
.scrollable {
    width: 500px;
    overflow-x: scroll;   
}
```
optional: hide the scrollbar
```css 
.scrollable::-webkit-scrollbar {
    display: none;
} 

```

### Props

* ```<DragScrollProvider vertical='true'>``` for vertical scroll.

### Available functions provided

``` 
{{
   onMouseDown: this.provisionOnMouseDown, // required
   ref: this.provisionRef, // required
   clickItem: this.clickItem, // wraps onClick events on children
   scrollTo: this.scrollTo, // scroll to specific value (useful for animations)
}}
```

### Handle on click event on child components

When you need to handle a click events on child components you need to wrap your click event on this provided function so the scroller knows that is not a drag triggering click, mainly for avoiding weird issues with the scroll.

Lets say you have a `<Card />` component that handles a click event

```jsx
<Card onClick={this.handleClick}>
```
So we need to wrap this click event like this

```jsx
<DragScrollProvider>
  {({ onMouseDown, ref, clickItem }) => (
    <div
      className="example__scroll"
      ref={ref}
      onMouseDown={onMouseDown}
    >
        <Card onClick={() => clickItem(this.handleClick)}>
    </div>
  )}
</DragScrollProvider>
```




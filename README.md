<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we'll create a small counter application using React and Redux. We'll also include extra functionality for undo/redo actions.

# Live Example

<a href="https://devmountain.github.io/react-5-mini/">Click Me!</a>

<img src="https://github.com/DevMountain/react-5-mini/blob/solution/readme-assets/5.png" />

## Setup

* `fork` and `clone` this repository.
* `cd` into the project root.
* Run `npm install` to fetch the project dependencies.
* Run `npm start` to spin up a development server.

<img src="https://github.com/DevMountain/react-5-mini/blob/solution/readme-assets/1.png" />

## Step 1

### Summary

In this step, we'll install some new dependencies, create a reducer, and create a Redux store.

### Instructions

* Install `redux`
* Open `./src/store.js`
* Import `createStore` from Redux.
* Create an initial state with a `currentValue` property for our counter.
* Write a simple reducer.
* Create and export a Redux store.

### Solution

<details>

<summary> <code> ./src/store.js </code> </summary>

```js
import { createStore } from "redux";

const initialState = { currentValue: 0 };

function counter( state = initialState, action ) {
	return state;
}

export default createStore(counter);
```

</details>

## Step 2

### Summary

In this step, we'll give our `Counter` component access to the store.

### Instructions


* Open `./src/Counter.js`.
* Import `store` from `./src/store.js`.
* Setup state for `Counter`.
  * State should have a property called `store`.
    * Use the `getState` method to copy the Redux state to the `store` property.
* Destructure `currentValue` from state in your `render` method.
* Update the `h1` to use the `currentValue`.
* Update the `JSON.stringify` method to display the `store` property on state.

### Solution
<details>

<summary> <code> ./src/Counter.js </code> </summary>

```js
import React, { Component } from "react";
import store from "./src/store";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: store.getState();
    }
  }
  render() {
    const {
      currentValue
    } = this.state.store;
    return (
      <div className="app">
        <section className="counter">
          <h1 className="counter__current-value">{currentValue}</h1>
          /* lots of jsx */
        </section>
        <section className="state">
          <pre>{JSON.stringify(this.state.store, null, 2)}</pre>
        </section>
      </div>
    );
  }
}

export default Counter;
```

</details>

<img src="https://github.com/DevMountain/react-5-mini/blob/solution/readme-assets/2.png" />

## Step 3

### Summary

In this step, we'll set up Redux to actually execute actions. We'll start by creating action types and implementing increment/decrement logic.

### Instructions

* Open `./src/store.js`.
* Create and export`INCREMENT` and `DECREMENT` action types.
* Update the reducer to process these actions into state changes.
  * `INCREMENT` should increment `currentValue` by the given `amount`.
  * `DECREMENT` should decrement `currentValue` by the given `amount`.

### Solution

<details>

<summary> <code> ./src/store.js </code> </summary>

```js
import { createStore } from 'redux';

const initialState = { currentValue: 0 };

export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";

function counter(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { currentValue: state.currentValue + action.amount };
    case DECREMENT:
      return { currentValue: state.currentValue - action.amount };
    default:
      return state;
  }
}

export default createStore(counter);
```

</details>

## Step 4

### Summary

In this step, we'll wire up the `Counter` component so that it can dispatch actions to our reducer.

### Instructions

* Open `./src/Counter.js`.
* Import the `INCREMENT` and `DECREMENT` action types.
* Create an `increment` and a `decrement` method.
  * The methods should accept an amount parameter.
  * The component method should use the Redux `dispatch` method to send an action to the reducer.
    * The action should include the action type you imported.
    * The action should include the amount. 
* Update the `.counter_button` buttons to call `increment` or `decrement` with the correct `amount`.
* In `componentDidMount`, use the Redux `subscribe` method to update local state.
  * The `subscribe` method will use the `getState` method to update.

### Solution

<details>

<summary> <code> ./src/Counter.js </code> </summary>

```js
import React, { Component } from "react";
import store, { INCREMENT, DECREMENT } from "./store.js";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: store.getState()
    };
  }
  
  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        store: store.getState()
      });
    });
  }
  increment(amount) {
    store.dispatch({ amount, type: INCREMENT });
  }
  decrement(amount) {
    store.dispatch({ amount, type: DECREMENT });
  }
  render() {
    const {
      currentValue
    } = this.state.store;
    return (
      <div className="app">
        <section className="counter">
          <h1 className="counter__current-value">{currentValue}</h1>
          <div className="counter__button-wrapper">
            <button className="counter__button" onClick={() => this.increment(1)}>
              +1
            </button>
            <button className="counter__button" onClick={() => this.increment(5)}>
              +5
            </button>
            <button className="counter__button" onClick={() => this.decrement(1)}>
              -1
            </button>
            <button className="counter__button" onClick={() => this.decrement(5)}>
              -5
            </button>
            <br />
            <button
              className="counter__button"
              disabled={true}
              onClick={() => null}
            >
              Undo
            </button>
            <button
              className="counter__button"
              disabled={true}
              onClick={() => null}
            >
              Redo
            </button>
          </div>
        </section>
        <section className="state">
          <pre>
            {JSON.stringify(this.state.store, null, 2)}
          </pre>
        </section>
      </div>
    );
  }
}

export default Counter;
```

</details>

<br />

<img src="https://github.com/DevMountain/react-5-mini/blob/solution/readme-assets/3g.gif" />

## Step 5

### Summary

In this step, we'll implement undo/redo logic into our reducer.

### Instructions

* Open `./src/store.js`.
* Create and export `UNDO` and `REDO` action types.
* Refactor `initialState` to keep track of futureValues and previousValues.
  * initialState should have two more properties; futureValues and previousValues. Both should be an empty array.
* Update the existing INCREMENT and DECREMENT cases to return an object that has futureValues and previousValues.
  * Both should set futureValues to an empty array
  * Both should add to the new previousValues array by taking the currentValue of the state object passed in and adding to the beginning of a new array. Then, destructure the previousValues array from that same state object and place the destructured array at the end of the new previousValues array.
* Add a case for UNDO
  * The currentValue should be set to the first value in the passed in state's previousValue array
  * futureValues should add the current value of passed in state at the beginning of the array and copy over any existing values
  * previous values should be set to a copy of the previousValues array passed in on state minus the first index
* Add a case for REDO
  * the currentValue should be set to the first value in the passed in state's futureValues array
  * futureValues should be set to a copy of the futureValues array passed in on state minus the first index
  * previousValues should add the current value of passed in state at the beginning of the array and copy over any existing value
  
### Solution

<details>

<summary> <code> ./src/store.js </code> </summary>

```js
import { createStore } from 'redux';

const initialState = {
  currentValue: 0,
  futureValues: [],
  previousValues: []
};

export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const UNDO = 'UNDO';
export const REDO = 'REDO';

function counter(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        currentValue: state.currentValue + action.amount,
        futureValues: [],
        previousValues: [state.currentValue, ...state.previousValues]
      };
    case DECREMENT:
      return {
        currentValue: state.currentValue - action.amount,
        futureValues: [],
        previousValues: [state.currentValue, ...state.previousValues]
      };
    case UNDO:
      return {
        currentValue: state.previousValues[0],
        futureValues: [state.currentValue, ...state.futureValues],
        previousValues: state.previousValues.slice(1)
      };
    case REDO:
      return {
        currentValue: state.futureValues[0],
        futureValues: state.futureValues.slice(1),
        previousValues: [state.currentValue, ...state.previousValues]
      };
    default:
      return state;
  }
}
export default createStore(counter);
```

</details>

## Step 6

### Summary

In this step, we'll import `UNDO` and `REDO` action types into our `Counter.js` and write methods to dispatch them.

### Instructions

* Open `./src/Counter.js`.
* Import `UNDO` and `REDO` action types.
* Create an `undo` and a `redo` method.
  * The component method should use the Redux `dispatch` method to send an action to the reducer.
    * The action should include the action type you imported.
* Hook up the `undo` and `redo` buttons to their respective methods.
* Destructure `previousValues` and `futureValues` from the store in the `render` method.
* Update the `disabled` attributes of the buttons to use `previousValues` and `futureValues` respectively.

### Solution

<details>

<summary> <code> ./src/Counter.js </code> </summary>

```js
import React, { Component } from "react";
import store, { INCREMENT, DECREMENT, UNDO, REDO } from "./store.js";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: store.getState()
    };
  }
  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        store: store.getState()
      });
    });
  }

  increment(amount) {
    store.dispatch({ amount, type: INCREMENT });
  }
  decrement(amount) {
    store.dispatch({ amount, type: DECREMENT });
  }
  undo() {
    store.dispatch({ type: UNDO });
  }
  redo() {
    store.dispatch({ type: REDO });
  }
  render() {
    const {
      currentValue,
      futureValues,
      previousValues
    } = this.state.store;

    return (
      <div className="app">
        <section className="counter">
          <h1 className="counter__current-value">{currentValue}</h1>
          <div className="counter__button-wrapper">
            <button className="counter__button" onClick={() => this.increment(1)}>
              +1
            </button>
            <button className="counter__button" onClick={() => this.increment(5)}>
              +5
            </button>
            <button className="counter__button" onClick={() => this.decrement(1)}>
              -1
            </button>
            <button className="counter__button" onClick={() => this.decrement(5)}>
              -5
            </button>
            <br />
            <button
              className="counter__button"
              disabled={previousValues.length === 0}
              onClick={this.undo}
            >
              Undo
            </button>
            <button
              className="counter__button"
              disabled={futureValues.length === 0}
              onClick={this.redo}
            >
              Redo
            </button>
          </div>
        </section>
        <section className="state">
          <pre>{JSON.stringify(this.state.store, null, 2)}</pre>
        </section>
      </div>
    );
  }
}
export default Counter;
```

</details>

<br />

<img src="https://github.com/DevMountain/react-5-mini/blob/solution/readme-assets/4g.gif" />

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2019. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>

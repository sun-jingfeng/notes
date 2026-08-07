# Frontend Interview Questions

## I. Fundamentals

### 1. CSS

1. Explain `position` and `z-index`. (Must cover stacking context, and how to break out of a stacking context's limits.)
2. Which page layout approaches do you use, and which scenario suits each? (Must include flex, and show that edge cases were considered and handled up front.)

***

### 2. JavaScript

1. Is there advanced JavaScript knowledge that most people lack and you have? Best explained through the situation in which you picked it up.
2. State the output order of the snippet below and explain why.

```javascript
console.log("start")

setTimeout(() => {
  console.log("timeout")
}, 0)

new Promise(resolve => {
  console.log("promise before")
  resolve()
  console.log("promise after")
})
  .then(() => {
    console.log("promise 1")
  })
  .then(() => {
    console.log("promise 2")
  })

function fn1() {
  console.log("fn1 function")
}

async function fn() {
  console.log("fn start")
  await fn1()
  console.log("fn end")
}

fn()
console.log("end")
```

***

### 3. TypeScript

1. What are generics, and when are they used?
2. How do you give a third-party dependency TypeScript type support? (Must cover packages that ship pure JavaScript with no types.)

***

### 4. Frameworks

1. What is your understanding of modern frontend frameworks?
2. Walk through the framework you know best. What experience shows you use it better than others?

***

## II. Engineering Setup

1. What base setup do you start a new project with, and what does it contain?
2. How do you approach business-development problems from an engineering angle?

***

## III. Performance Optimization

### 1. Rendering Principles

1. Describe the browser rendering pipeline and the optimizations that follow from it.

***

### 2. Specific Problems

State the detection method and the solution for each, ideally tied to past project experience.

1. First-screen load speed
2. High-frequency interaction
3. Jank and dropped frames

***

## IV. Project Experience

1. Pick the project that best demonstrates your ability and walk through it.

***

## V. Written Test

Given a nested object, implement `getKeysByLevel(obj)` that groups every key by its depth and returns a two-dimensional array. Keys keep their definition order within a level, and a property whose value is not an object contributes its key only, with no further traversal.

```javascript
const obj = {
    a: {
        b: {
            c: 1
        },
        d: 2
    },
    e: 3
};

getKeysByLevel(obj);
// [['a', 'e'], ['b', 'd'], ['c']]
```

***

## VI. AI-Assisted Coding

1. Which AI coding tools do you use?
2. How do you use AI tools day to day? What experience shows you use them better than others?

# Frontend Interview Questions

## I. Fundamentals

### 1. CSS

1. Explain `position` and `z-index`. (Must cover stacking context, and how to break out of a stacking context's limits.)
2. Which page layout approaches do you use, and which scenario suits each? (Must cover the individual properties the `flex` shorthand expands to.)
3. Share edge cases that the design mockups did not cover but you anticipated, and how you handled them.

***

### 2. JavaScript

1. Explain your understanding of the event loop in JavaScript.
2. Is there advanced JavaScript knowledge that most people lack and you have? Best explained through the situation in which you picked it up.

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

1. What base setup do you start a new project with? (Must cover what a solid base setup needs to contain.)
2. How do you approach business-development problems from an engineering angle?

***

## III. Performance Optimization

1. Explain your understanding of the browser rendering pipeline. (Must cover which optimizations target its performance bottlenecks.)
2. Pick a project that involved performance optimization and walk through the problems encountered, the tools used to detect them, and the solutions.

***

## IV. Project Experience

1. Pick the project that best demonstrates your ability and walk through it.

***

## V. AI-Assisted Coding

1. How do you ensure the quality of AI-generated code?
2. What experience shows you are better than others at using AI to assist development?

***

## VI. Written Test

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

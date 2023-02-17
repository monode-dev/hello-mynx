# Learn Mynx

This document serves as my best guesses of what Mynx will become. The language isn't quite here yet and the syntax will change a lot, but it's a starting point.

## Comments

Currently only multi-line comments exist, and are written like so:

```Mynx
{ I am a comment. }
```

_To be honest, I hate this syntax, but I want to be able to include markdown in comments,and haven't found a better solutions. I am open to suggestions._

## Variables

### Declaration

Variables can be declared like so:

```Mynx
foo:= 1 { Explicitly mutable. }
bar:- false { Explicitly immutable. }
naz: "Lorem ipsom." { Let the compiler guess. }
```

As a general rule, all variables(both mutable and immutable) are reactive, and can be subscribed to.

_I'm a little worried that using `:-` for immutable vars could cause some confusion between vars like `a:- 1` and `a: -1`. I want it to start with `:`, but haven't found a good second character. I'm open to suggestions here as well._

### Assignment

Mutable variables can be assigned to like so:

```Mynx
foo = 42
```

### Expressions

Expressions exist and are reactive as well.

```Mynx
x: 1
y: 2 * x { `y` equals 2 }
x = 5 { `y` now equals 10 }
```

Also, the compiler will assume that `x` is mutable and `y` is immutable. Using `:=` will make `y` copy the value of `2 * x` and use it to initialize `y` as a new mutable variable.

```Mynx
x: 1
y:= 2 * x
x = 5 { `y` remains unchanged }
```

_I'm debating requiring the `copy` keyword when discarding dependencies like so `y:= copy 2 _ x`, but I'm not sold on that idea yet.\_

## Objects

### Basics

Object literals can be created like so:

```Mynx
myCar: [
  manufacturer: "Honda"
  make: "Civic"
  model: 2004

  {Properties behave pretty much just like other variables.}
  licensePlate:= "ABC-123"
  vin:- 1234

  {Properties can reference siblings}
  asText: "{manufacturer} {make} {model}"
]
```

_By default expressions technically exist outside the object, and are questions that can be asked about it. we should turn these yellow like functions. I'm not sure wether or not we even want to allow things like this to be part of an object. Meaning I don't know if we want to allow this default to be overriden. Not sure yet. This is probably far to unspecific for someone who doesn't have the context of other things I've been thinking about._

Properties of an object can be accessed like so:

```Mynx
theModel: myCar.model
```

_Note that both `myCar` and `theModel` are assumed to be immutable._

_At some point I'll need to write about ordered vs keyed properties, but I'll document that later when I have a more clear idea what the right way is to implement them._

### Variants

Object variants inherit, by reference, all the properties of the source object, but with some overrides. Variants can be created like so.

```Mynx
primaryColor: "red"
uiBox: [
  width: 0
  height: 0
  background: primaryColor
]
myBox: uiBox[
  width: 50
  height: 50
]
primaryColor = "green" { `background` will change for both `uiBox` and `myBox` }
```

_Variants may seem a bit odd, and there may be some sharp edges to them, but they are super useful for UIs. Their implementation will probably change with time._

## Object Types

## Code Blocks & Functions

Functions can be declared like so.

```Mynx
addOne[x: Num]: x + 1
```

They can be invoked like so.

```Mynx
y: 0
z: addOne[x: y]
```

_There is some debate around how functions are invoked. At some point in the future I'll do some writing about the alternate ways we could do this and about prop-like invocations._

Function parameters are basically just object types.

```Mynx
print[msg: Text, shouldWarn: false]: (
  if shouldWarn (
    js"console.log(mx_wantLit(msg))"
  ) else (
    js"console.warn(mx_wantLit(msg))"
  )
)
```

_I had considered allowing functions to be declared like `foo: []: ()`, but maybe I'll wait on mutable functions for a while. At least until I better understand how I want to implement them._

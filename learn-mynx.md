# Learn Mynx
This document serves as my best guesses of what Mynx will become. The language isn't quite here yet and the syntax will change a lot, but it's a starting point.

## Comments
Currently only multi-line comments exist, and are written like so:
```Mynx
{ I am a comment. }
```
*To be honest, I hate this syntax, but I want to be able to include markdown in comments,and haven't found a better solutions. I am open to suggestions.*

## Variables
Variables can be declared like so:
```Mynx
foo:= 1 { Explicitly mutable. }
bar:- false { Explicitly immutable. }
naz: "Lorem ipsom." { Let the compiler guess. }
```
As a general rule, all variables(both mutable and immutable) are reactive, and can be subscribed to.

Mutable variables can be assigned to like so:
```Mynx
foo = 42
```

*I'm a little worried that using `:-` for immutable vars could cause some confusion between vars like `a:- 1` and `a: -1`. I want it to start with `:`, but haven't found a good second character. I'm open to suggestions here as well.*

+ `npm install`
+ `cd a && npm install && cd ..`

## Now

+ `webpack`

```
Error: No template for dependency: TemplateArgumentDependency
```


## Previously,

had an error where webpack produced `1.1 mb` file (including React twice) and browserify produced a `0.5 mb` file. Solved by using `DedupePlugin` in webpack.

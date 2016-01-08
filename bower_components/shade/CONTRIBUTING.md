## Contributing

We love pull requests, and other people helping maintain our code. If you want to contribute, please follow these guidelines.

### Bugfixes

Create an issue in our [issue tracker](https://github.com/mobify/shade/issues) describing the problem. Follow the steps below, fixing the bug in your fork. Don't forget to add tests!

### General Contribution Guidelines

Fork, then clone the repo:

```
git clone https://github.com/your-username/shade.git
```

Ensure the tests pass:

```
grunt test
```
	
Make your changes, add tests for your changes, then run the tests again:

```
grunt test
```

### Building a release

Releases are built into the `dist` directory. To build a release, do the following:

Increment the version number in the package.json file according to the [semver](http://semver.org/) specification.

Run the following `grunt` task to build the dist:

```
grunt build
```

Push to your fork, and open a [pull request](https://github.com/mobify/shade/compare). Please ensure you describe your changes in your pull request, as they have a higher liklihood of being merged. 



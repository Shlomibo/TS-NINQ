import * as Reporter from 'jasmine-console-reporter';

jasmine.getEnv()
	.addReporter(new Reporter({
		colors: true,
		cleanStack: true,
		verbosity: true,
	}));
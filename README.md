# tme - "Test me"

A course project from "The Modern JavaScript Bootcamp Course (2021)" on Udemy

I've made some modifications to the original code.

- Browser based tests were not able to correctly load up an HTML file using JSDOM if tme was run from a parent directory. This is fixed by being able to supply render() with an absolute path to the file, instead of basing the directory on process.cwd().
- If multiple test files were ran, the header text that indicates the filename, appeared out of order if running asynchronous tests. This is fixed by waiting for the tests in each file to complete before moving on to the next file.

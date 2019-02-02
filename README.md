# URL Analyzer

This repo obtains and analyzes a set of URLs and is live [at this website.](https://venus.cs.qc.cuny.edu/~abma2399/cs355/urlanalyzer.html)

### Technologies Used
* HTML
* CSS
* JavaScript
* DOM
* AJAX
* JSON
* Canvas.js

### Description of Parts

#### Part 1: Obtains a set of URLs
A file-Upload button is provided for the user to choose a file containing a list of URLs

#### Part 2: Parses the URLs into their component parts
This [syntax scheme for URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Generic_syntax) was used

#### Part 3: Looks up the domain names and obtains their corresponding IP addresses
Done by:
* passing a domain name to this site: https://dns.google.com/resolve?name=
* using an XMLHttpRequest() to send a request to the Google DNS server
* using JSON.parse(*) to parse the response

#### Part 4: Lists each complete URL as it appeared in the file
Includes their respective component parts and the corresponding IP address

#### Part 5: Displays summary data below the table
Done in the form of a pie chart using Canvas.js
# URL Analyzer and IP Address Manager

This repo contains two parts: 
1. URL Analyzer obtains and analyzes a set of URLs and is live [at this website.](https://venus.cs.qc.cuny.edu/~abma2399/cs355/urlanalyzer.html)
2. IP Address Manager provides an interface for assigning and managing IP addresses for the various types and is live [here.](https://venus.cs.qc.cuny.edu/~abma2399/cs355/IPAddressManager.html)

### Technologies Used
* HTML
* CSS
* JavaScript
* DOM
* AJAX
* JSON

## URL Manager

### Description

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

## IP Address Manager

### Description
Various models of IP addressing are utilized today, in particular, the 32-bit IPv4 and 128-bit IPv6 schemes. IPv4 is
further divided into five classes: A, B, C, D, E, which differ both function as well as division between prefix and suffix, as
well as a “classless” model which has an “arbitrary” boundary (specified by a “mask”) between prefix and suffix.

This repo assumes these are all “public addresses” that need to be globally unique – at least in conjunction with the network
mask – as opposed to private addresses. 

Through the website's user interface, the user enters several pieces of information: 
* The choice of IPv4 or IPv6
* The choice of classful (for IPv4) or classless. For classless addressing, the address manager determines the subnet mask based on the number of host addresses requested. 
* For classful addressing, the choice of class A-E
* For classless, the mask that determines the boundary between prefix and suffix for IPv4, or between the global prefix and subnet prefix for IPv6
* For IPv6, the choice whether zero compression should be applied to colon-hex
* The choice of how many IP addresses are required by the user. These addresses are all on the same network, meaning they share the same prefix.

The IP addresses are displayed both as binary and in dotted decimal or colon hex. The latter are the conventional notations, and the binary is visually easier
to parse
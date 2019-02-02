let numberOfNeededAddresses,
    prefixSize,
    ipv4Format = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g,
    ipv6Format = /^([\dabcdef]{4}[\:]){7}([\dabcdef]{4})$/,
    binaryNetwork = [],
    dottedDecimal,
    binary;

function isIpv4 (input) {
    return ipv4Format.test(input);
}

function isIpv6 (input) {
    return ipv6Format.test(input);
}

function randomBit() {
    return Math.round(Math.random());
}

function randomOctet() {
    let octet = '';
    for (let i=0; i<8; i++) octet += randomBit();
    return octet;
}

function padOctet(octet) {
    while (octet.length < 8){
        octet += randomBit();
    }
    return octet;
}

function networkNumberFromPrefix (leadingBits, size) {
    let array=[];
    // get first octet
    array.push(padOctet(leadingBits));
    // get remaining octets
    for (let i = 1; i < size; i+=8)
        array.push(randomOctet());
    return array;
}
/* function networkNumberFromPrefix (leadingBits, size) {
    let output=[];
    // if prefix is more than 8 bits (one octet), get the first octets out of it
    while (leadingBits.length > 8) {
        output.push(leadingBits.substring(0, 8));
        leadingBits = leadingBits.substring(8);
    }
    // if prefix is smaller than one octet, add to make it a complete octet
    while (leadingBits.length < 8){
        leadingBits += randomBit();
    }
    // if prefix is 8 bits, push it to the output array
    output.push(leadingBits);

    // get remaining octets
    for (let i = 1; i < size; i+=8)
        output.push(randomOctet());
    return output;
}
 */


function addAddressToNetwork (network) {
    let array = network.slice();
    for(let i=array.length; i<4; i++){
        array.push(randomOctet());
    }
    return array;
}

function binToDottedDec(binaryArray) {
    let output = "";
    for (let i=0; i<binaryArray.length; i++){
        output += binToDec(binaryArray[i]);
        if (i+ 1<binaryArray.length) output += '.';
    }
    return output;
}

function binToColonHex(binArray, shouldCompress) {
    let output = "";
    for (let i=0; i<binArray.length; i += 2){
        let number = decimalToHex(binToDec((binArray[i] + binArray[i+1])));
        if (!(number === '0' && shouldCompress)) output += number;
        if (i+2 < binArray.length) output += ':';
    }
    return output;
}

function binToDec(binary) {
    return parseInt((binary + '')
        .replace(/[^01]/gi, ''), 2);
}
function decToBin(decimal) {
    return parseInt(decimal, 10).toString(2);
}

function binaryArrayToDotted (binaryArray) {
    let output = "";
    for (let i=0; i<binaryArray.length; i++){
        output += (binaryArray[i]);
        if (i+ 1<binaryArray.length) output += '.';
    }
    return output;
}

function decimalToHex(d) {
    return Number(d).toString(16);
}


function howManyNeeded() {
    document.getElementsByClassName('retry')[0].style.display = 'inherit';
    let module = document.getElementById('number-needed');
    numberOfNeededAddresses = document.getElementById('ipAddressesNeeded').value;
    module.style.display = 'none';
    module = document.getElementById('type-needed');
    module.style.display = 'inherit';
}

// function prefixNeeded() {
//     let module = document.getElementById('type-needed');
//     module.innerHTML = "<h2>How many bits do you require in the " +
//         (typeNeeded.includes("classless") ? "prefix" : "global prefix") +
//         " of the address?</h2>\n" +
//         "        <input type='number' id=\"prefixNeeded\" value=\"2\">\n" +
//         "        <input type=\"submit\" value=\"Submit\" onclick=\"getPrefix()\">";
// }

// function getPrefix(typeNeeded) {
//     let module = document.getElementById('type-needed');
//     prefixSize = document.getElementById('prefixNeeded').value;
//     module.innerHTML = '<h1>You asked for ' + numberOfNeededAddresses + ' '
//         + typeNeeded + ' addresses with ' +  prefixSize + ' bits in the prefix.</h1>';
// }

function handleIpv4(typeNeeded) {
    let module = document.getElementById('type-needed'),
        leadingBits,
        table = document.getElementById('output');
        let classless;
    module.innerHTML = '<h1>You asked for ' + numberOfNeededAddresses + ' '
        + typeNeeded + ' addresses.</h1>';

    if (typeNeeded === "ipv4 classless") {
        classless = true;
        if (numberOfNeededAddresses < 256) typeNeeded = "ipv4 C";
        else if (numberOfNeededAddresses < 65536) typeNeeded = "ipv4 B";
        else if (numberOfNeededAddresses < 16777216) typeNeeded = "ipv4 A";
    }
    switch (typeNeeded) {
        case "ipv4 A":
            if (numberOfNeededAddresses > 16777216){
                module.innerHTML = "<h1>Sorry, Class A addressing supports up to 16,777,216 addresses per network, and you requested " + numberOfNeededAddresses + "</h1>";
                return;
            }
            leadingBits = '0';
            prefixSize = 8;
            break;
        case "ipv4 B":
            if (numberOfNeededAddresses > 65536){
                module.innerHTML = "<h1>Sorry, Class B addressing supports up to 65,536 addresses per network, and you requested " + numberOfNeededAddresses + "</h1>";
                return;
            }
            leadingBits = '10';
            prefixSize = 16;
            break;
        case "ipv4 C":
            if (numberOfNeededAddresses > 256){
                module.innerHTML = "<h1>Sorry, Class C addressing supports up to 256 addresses per network, and you requested " + numberOfNeededAddresses + "</h1>";
                return;
            }
            leadingBits = '110';
            prefixSize = 24;
            break;
        case "ipv4 D":
            leadingBits = '1110';
            prefixSize = 32;
            module.innerHTML = '<h1>You asked for an IP address for multicast addressing.</h1>';
            break;
        case "ipv4 E":
            module.innerHTML = "<h1>Sorry, such addresses are \“reserved\”</h1>";
            return;
    }
    if (classless) {
        let bitsNeededInHost = Math.ceil(Math.log2(numberOfNeededAddresses));
        prefixSize = 32 - bitsNeededInHost;
        for (let i=leadingBits.length; i < prefixSize; i++){
            leadingBits += randomBit();
        }
        // if leading bits are more than 1 octet length, push each octet into network array
        while (leadingBits.length > 8) {
            binaryNetwork.push(leadingBits.substring(0, 8));
            leadingBits = leadingBits.substring(8);
        } // push remaining bits into network array
        if (leadingBits) binaryNetwork.push(leadingBits);
    }

    table.innerHTML += ('<tr> <th>Number</th>\n' +
        '    <th>IP Address in Dotted Decimal Notation</th>\n' +
        '    <th>IP Address in Dotted Binary Notation</th> </tr>');
    if (!classless) binaryNetwork = networkNumberFromPrefix(leadingBits, prefixSize);
    for (let i=1; i<=numberOfNeededAddresses; i++){
        let address;
        if (classless) {
            let array = binaryNetwork.slice();
            array[array.length - 1] = padOctet(array[array.length - 1]);
            address = addAddressToNetwork(array);
        }
        else address = addAddressToNetwork(binaryNetwork);
        dottedDecimal = binToDottedDec(address);
        binary = binaryArrayToDotted(address);
        table.innerHTML += ('<tr>\n' +
            '    <td>' + i + '</td>\n' +
            '    <td>' + dottedDecimal + '</td>\n' +
            '    <td>' + binary + '</td>\n' +
            '  </tr>');
        if (typeNeeded === "ipv4 D") break;
    }
}

function handleIpv6(typeNeeded) {
    let module = document.getElementById('type-needed'),
        table = document.getElementById('output');
    module.innerHTML = '<h1>You asked for ' + numberOfNeededAddresses + ' '
        + typeNeeded + ' addresses.</h1>';
    table.innerHTML += ('<tr> <th>Number</th>\n' +
        '    <th>IP Address in Colon Hex Notation</th>\n' +
        '    <th>IP Address in Dotted Binary Notation</th> </tr>');
    let binNetwork = [];
    for (let i= 0; i<8; i++){
        binNetwork.push(randomOctet());
    }

    for (let i=1; i<=numberOfNeededAddresses; i++){
        // console.log(binNetwork);
        let host = binNetwork.slice();
        for (let i= 0; i<8; i++) {
            host.push(randomOctet());
        }
        table.innerHTML += ('<tr>\n' +
            '    <td>' + i + '</td>\n' +
            '    <td>' + binToColonHex(host, !typeNeeded.includes('without')) + '</td>\n' +
            '    <td>' + binaryArrayToDotted(host) + '</td>\n' +
            '  </tr>');
    }
}
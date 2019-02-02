const openFile = function (event) {
    document.getElementById('table').innerHTML = "Sorry, there was an error with your request. Please check your file and try again.";
    document.getElementsByClassName('retry')[0].style.display = 'inherit';
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function () {
        let text = reader.result.split('\n');
        let data = {'https': 0, 'http': 0, 'ftp': 0, 'other': 0}, ip;
        let tableString = "<table style='width: 10px'>" +
            "<tr><th>URL</th> <th>IP Address</th> <th>Scheme</th> <th>User Info</th> " +
            "<th>Host</th> <th>Port</th> <th>Path</th> <th>Query</th> <th>Fragment</th></tr>";
        for (let i = 0; i < text.length; i++) {
            let url = new URL(text[i]);
            $.getJSON('https://dns.google.com/resolve?name=' + url.host,
                function (json) {
                    try { ip = json.Answer[json.Answer.length - 1].data; }
                    catch {ip = 'undefined ip';}
                    finally {
                        tableString += ("<tr>" +
                            "<td>" + url.href + "</td>" +
                            "<td>" + ip + "</td>" +
                            "<td>" + url.protocol + "</td>" +
                            "<td>" + url.username + "</td>" +
                            "<td>" + url.hostname + "</td>" +
                            "<td>" + url.port + "</td>" +
                            "<td>" + url.pathname + "</td>" +
                            "<td>" + url.searchParams + "</td>" +
                            "<td>" + url.hash + "</td>" +
                            "</tr>");

                        switch (url.protocol) {
                            case ('ftp:'):
                                data['ftp']++;
                                break;
                            case ('http:'):
                                data['http']++;
                                break;
                            case ('https:'):
                                data['https']++;
                                break;
                            default:
                                data['other']++
                        }

                        if (i + 1 === text.length) {  // if we are on the last url
                            document.getElementById('table').innerHTML = tableString + "</table>"; //output the table

                            // MAKE THE CHART
                            let total = data.http + data.https + data.ftp + data.other,
                                chart = new CanvasJS.Chart("chartContainer", {
                                    animationEnabled: true,
                                    title: {
                                        text: "Protocol Usage"
                                    },
                                    data: [{
                                        type: "pie",
                                        startAngle: 240,
                                        yValueFormatString: "##0.00\"%\"",
                                        indexLabel: "{label} {y}",
                                        dataPoints: [
                                            {y: (data.http / total) * 100, label: "HTTP"},
                                            {y: (data.https / total) * 100, label: "HTTPS"},
                                            {y: (data.ftp / total) * 100, label: "FTP"},
                                            {y: (data.other / total) * 100, label: "Other"}
                                        ]
                                    }]
                                });
                            chart.render();
                        }
                    }
                }
            );
        }
    };
    reader.readAsText(input.files[0]);
};
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

type infoData struct {
	packetID     int
	protocol     string
	src          string
	dst          string
	direction    string
	date         string
	time         string
	twelveHour   string
	globalCallID string
	callID       string
}

/*let rcinfo = {
type: 'HEP',
version: 3,
payload_type: 1,
ip_family: 2,
protocol: 17,
proto_type: 1,
correlation_id: parsed[9] //TODO correlation id,
srcIp: parsed[3],
srcPort: parsed[4],
dstIp: parsed[5],
dstPort: parsed[6],
time_sec: new Date(parsed[8]).getTime() / 1000 || new Date().getTime()
//time_usec: ipcache.usec || 000
};*/

type hepPacket struct {
	rcInfo  hepInfo
	payload string
}

type hepInfo struct {
}

func main() {
	// TODO Load file from CLI flag instead
	/*filePtr := flag.String("file", "", "File to use as source (.txt)")

	if *filePtr == "" {
		log.Fatal("No input file found.")
	}*/

	file, err := os.Open("./mxsiplogs/316pm-pbxsip.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	var lines []string

	// Load file
	scanner := bufio.NewScanner(file)
	// optionally, resize scanner's capacity for lines over 64K, see next example
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	// Example of the first line before SIP packet.
	//202	SIP	172.28.10.99:5061	206.116.51.217:12102	Tx	2021-11-18 3:15:54 PM			1461506900-4877

	parseLinesAndCombine(lines)

}

// Match the lines and start combining them into groups based on

func parseLinesAndCombine(lines []string) {
	for _, line := range lines {
		var packet infoData

		// Skip line if it has xml tag or if it's a new line.
		if strings.HasPrefix(line, "<?xml") || strings.EqualFold(line, "\n") {
			log.Print("Skipping line...\n")
			// TODO stop grouping lines if runs into xml or new line
			continue
		}

		// Check if the line has a Global CID (Will be used for call correlation)
		_, err := fmt.Sscanf(line, "%d\t%s\t%s\t%s\t%s\t%s %s %s\t\t%s\t%s", &packet.packetID, &packet.protocol, &packet.src,
			&packet.dst, &packet.direction, &packet.date, &packet.time, &packet.twelveHour, &packet.globalCallID, &packet.callID)
		if err != nil {
			// Check if the line doesn't have a Global CID, but matches the start of a SIP packet (Will be used for call correlation)
			_, err := fmt.Sscanf(line, "%d\t%s\t%s\t%s\t%s\t%s %s %s\t\t\t%s", &packet.packetID, &packet.protocol, &packet.src,
				&packet.dst, &packet.direction, &packet.date, &packet.time, &packet.twelveHour, &packet.callID)
			if err != nil {
				// Add the line to the current JSON builder info. TODO

			} else {
				// Print line that it doesn't find global CID but still matches.
				fmt.Print("Found match WITHOUT global CID \n-> " + line + "\n")
			}
		} else {
			// Print line that has global CID.
			log.Printf("Found match WITH global CID. \n-> " + line + "\n")
		}
	}

	// TODO return groups of lines as array[[]]
}

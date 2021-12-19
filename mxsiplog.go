package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"
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

type tempPacket struct {
	info    infoData
	payload string
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
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	// Example of the first line before SIP packet.
	//202	SIP	172.28.10.99:5061	206.116.51.217:12102	Tx	2021-11-18 3:15:54 PM			1461506900-4877

	tempPackets := parseHepPacket(lines)
	hepPackets := buildHep(tempPackets)

	var jsonLines []string

	for _, hep := range hepPackets {
		jsonBytes, _ := json.Marshal(hep)
		fmt.Printf("\nJSON: %s\n", string(jsonBytes))
		jsonLines = append(jsonLines, string(jsonBytes))
	}

	//jsonBytes, _ := json.Marshal(hepPackets)
	//fmt.Printf("\nJSON: %s\n", string(jsonBytes))

}

// Match the lines and start combining them into groups based on

func parseHepPacket(lines []string) []tempPacket {
	var packets []tempPacket
	var packetTemp tempPacket

	for _, line := range lines {
		var packetInfo infoData

		// Skip line if it has xml tag or if it's a new line.
		if strings.HasPrefix(line, "<?xml") /*|| strings.EqualFold(line, "\n")*/ {
			log.Print("Skipping line...\n")
			// TODO stop grouping lines if runs into xml
			continue
		}

		// Check if the line has a Global CID (Will be used for call correlation)
		_, err := fmt.Sscanf(line, "%d\t%s\t%s\t%s\t%s\t%s %s %s\t\t%s\t%s",
			&packetInfo.packetID, &packetInfo.protocol, &packetInfo.src,
			&packetInfo.dst, &packetInfo.direction, &packetInfo.date, &packetInfo.time,
			&packetInfo.twelveHour, &packetInfo.globalCallID, &packetInfo.callID)
		if err != nil {
			// Check if the line doesn't have a Global CID, but matches the start
			//of a SIP packetInfo (Will be used for call correlation)
			_, err := fmt.Sscanf(line, "%d\t%s\t%s\t%s\t%s\t%s %s %s\t\t\t%s",
				&packetInfo.packetID, &packetInfo.protocol, &packetInfo.src,
				&packetInfo.dst, &packetInfo.direction, &packetInfo.date,
				&packetInfo.time, &packetInfo.twelveHour, &packetInfo.callID)
			if err != nil {
				// Check if packet info is set by using the date
				if packetTemp.info.date != "" {
					// add line to payload because we've already processed the info
					packetTemp.payload = packetTemp.payload + line

					if len(packetTemp.payload) > 0 {
						packetTemp.payload = packetTemp.payload + "\n"
					}
				}
				// Add the line to the current JSON builder info. TODO

			} else {
				if packetTemp.info.date != "" && len(packetTemp.payload) > 0 {
					packets = append(packets, packetTemp)
					packetTemp = tempPacket{}
					fmt.Printf("Packet info set, and payload has data... " +
						"Clearing and appending to packets...")
				}
				// Print line that it doesn't find global CID but still matches.
				fmt.Printf("\nFound match WITHOUT global CID -> %s", line)
				packetTemp.info = packetInfo
			}
		} else {
			if packetTemp.info.date != "" && len(packetTemp.payload) > 0 {
				packets = append(packets, packetTemp)
				packetTemp = tempPacket{}
				fmt.Printf("Packet info set, and payload has data... " +
					"Clearing and appending to packets...")
			}
			// Print line that has global CID.
			log.Printf("\nFound match WITH global CID -> %s", line)
			packetTemp.info = packetInfo
		}
	}

	return packets
}

type hepRcinfo struct {
	Type          string `json:"type"`
	Version       int    `json:"version"`
	PayloadType   int    `json:"payload_type"`
	IpFamily      int    `json:"ip_family"`
	Protocol      int    `json:"protocol"`
	ProtoType     int    `json:"proto_type"`
	CorrelationId string `json:"correlation_id"`
	SrcIp         string `json:"srcIp"`
	SrcPort       string `json:"srcPort"`
	DstIp         string `json:"dstIp"`
	DstPort       string `json:"dstPort"`
	TimeSec       int64  `json:"time_sec"`
}

type hepPacket struct {
	Payload string    `json:"payload"`
	Rcinfo  hepRcinfo `json:"rcinfo"`
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

func buildHep(packets []tempPacket) []hepPacket {
	var hepPackets []hepPacket

	for _, p := range packets {

		timeLayout := "2006-01-02 3:04:05 PM MST"
		t, _ := time.Parse(timeLayout, p.info.date+" "+p.info.time+" "+p.info.twelveHour+" PST")
		//fmt.Println(string(t.GoString()) + p.info.date + " " + p.info.time + " " + p.info.twelveHour + " PST")

		hep := hepPacket{Payload: p.payload, Rcinfo: hepRcinfo{
			Type:          "HEP",
			Version:       3,
			PayloadType:   1,
			IpFamily:      2,
			Protocol:      17,
			ProtoType:     1,
			CorrelationId: p.info.globalCallID,
			SrcIp:         strings.Split(p.info.src, ":")[0],
			SrcPort:       strings.Split(p.info.src, ":")[1],
			DstIp:         strings.Split(p.info.dst, ":")[0],
			DstPort:       strings.Split(p.info.dst, ":")[1],
			TimeSec:       t.Unix(),
		}}

		hepPackets = append(hepPackets, hep)
	}

	return hepPackets
}

package main

import "fmt"

func main() {
	/*
		./ztb run --file=./mxsiplogs/316pm-pbxsip.txt --output-file=./pastash-output/test1.json
	*/

	printMainMenu()
}

// ./ztb args1 args2
//

// ./ztb <args>
//        run - runs the program
//        start - starts the program
// key:      value
// key.......value

type MenuItem struct {
	Key   string
	Value string
}

func (m *MenuItem) Print() {
	fmt.Printf("%s - %s\n", m.Key, m.Value)
}

func printMainMenu() {
	var items []MenuItem
	items = append(items, MenuItem{"run", "runs the program"})
	items = append(items, MenuItem{"start", "starts a program"})

	for _, item := range items {
		item.Print()
	}

	//https://github.com/dreadl0ck/gopcap

}

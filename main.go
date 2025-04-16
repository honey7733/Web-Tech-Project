package main

import (
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Block struct {
	Pos       int
	Data      Book
	Timestamp string
	Hash      string
	PrevHash  string
}

type Book struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	PublishDate string `json:"publish_date"`
	ISBN        string `json:"isbn"`
}

func (b *Block) generateHash() {
	// Get string value of the Data
	bytes, _ := json.Marshal(b.Data)
	// Concatenate the dataset
	data := fmt.Sprintf("%d%s%s%s", b.Pos, b.Timestamp, string(bytes), b.PrevHash)
	hash := sha256.New()
	hash.Write([]byte(data))
	b.Hash = hex.EncodeToString(hash.Sum(nil))
}

func CreateBlock(prevBlock *Block, book Book) *Block {
    block := &Block{
        Pos:       prevBlock.Pos + 1,
        Timestamp: time.Now().String(),
        Data:      book,
        PrevHash:  prevBlock.Hash,
    }
    block.generateHash()
    return block
}

type Blockchain struct {
	blocks []*Block
}

var BlockChain *Blockchain

func (bc *Blockchain) AddBlock(book Book) {
    if len(bc.blocks) == 0 {
        log.Println("Blockchain is empty. Initializing with Genesis Block.")
        bc.blocks = append(bc.blocks, GenesisBlock())
    }

    prevBlock := bc.blocks[len(bc.blocks)-1]
    block := CreateBlock(prevBlock, book)

    if validBlock(block, prevBlock) {
        bc.blocks = append(bc.blocks, block)
        log.Printf("Block #%d added successfully!", block.Pos)
    } else {
        log.Println("Failed to add block: Invalid block.")
    }
}

func GenesisBlock() *Block {
    genesisBook := Book{
        ID:          "0",
        Title:       "Genesis Block",
        Author:      "System",
        PublishDate: time.Now().Format("2006-01-02"),
        ISBN:        "0",
    }
    genesisBlock := &Block{
        Pos:       0,
        Data:      genesisBook,
        Timestamp: time.Now().String(),
        PrevHash:  "0",
    }
    genesisBlock.generateHash()
    return genesisBlock
}

func NewBlockchain() *Blockchain {
	return &Blockchain{[]*Block{GenesisBlock()}}
}

func validBlock(block, prevBlock *Block) bool {
	if prevBlock.Hash != block.PrevHash {
		return false
	}

	if !block.validateHash(block.Hash) {
		return false
	}

	if prevBlock.Pos+1 != block.Pos {
		return false
	}
	return true
}

func (b *Block) validateHash(hash string) bool {
	b.generateHash()
	return b.Hash == hash
}

func getBlockchain(w http.ResponseWriter, r *http.Request) {
    log.Println("Fetching blockchain data...")
    jbytes, err := json.MarshalIndent(BlockChain.blocks, "", " ")
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        log.Printf("Error marshaling blockchain data: %v", err)
        json.NewEncoder(w).Encode(err)
        return
    }

    w.WriteHeader(http.StatusOK)
    io.WriteString(w, string(jbytes))
    log.Println("Blockchain data sent successfully.")
}

func writeBlock(w http.ResponseWriter, r *http.Request) {
    var book Book
    if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        log.Printf("Could not decode request body: %v", err)
        w.Write([]byte("Invalid request payload"))
        return
    }

    // Generate a unique ID for the book
    h := md5.New()
    io.WriteString(h, book.ISBN+book.PublishDate)
    book.ID = fmt.Sprintf("%x", h.Sum(nil))

    // Add the book to the blockchain
    if BlockChain == nil {
        log.Println("Blockchain is not initialized.")
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte("Blockchain is not initialized"))
        return
    }

    BlockChain.AddBlock(book)

    // Respond with the added block
    resp, err := json.MarshalIndent(book, "", " ")
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        log.Printf("Could not marshal payload: %v", err)
        w.Write([]byte("Could not write block"))
        return
    }
    w.WriteHeader(http.StatusOK)
    w.Write(resp)
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
    // Initialize the blockchain
    BlockChain = NewBlockchain()

    // Set up the router
    r := mux.NewRouter()
    r.HandleFunc("/", getBlockchain).Methods("GET")
    r.HandleFunc("/", writeBlock).Methods("POST")

    // Enable CORS
    handler := enableCORS(r)

    // Start the server
    log.Println("Listening on port 3009")
    log.Fatal(http.ListenAndServe(":3009", handler))
}
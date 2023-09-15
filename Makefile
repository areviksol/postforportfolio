# Variables
SERVER_DIR := ./server
CLIENT_DIR := ./client
SERVER_PORT := 3001
CLIENT_PORT := 3000

# Check if node_modules folder exists
server_node_modules := $(wildcard $(SERVER_DIR)/node_modules)
client_node_modules := $(wildcard $(CLIENT_DIR)/node_modules)

# Targets
.PHONY: all server client

all: server client

server:
	@if [ ! -d "$(server_node_modules)" ]; then \
		echo "Installing server dependencies..."; \
		cd $(SERVER_DIR) && npm install; \
	fi
	@if lsof -Pi :$(SERVER_PORT) -sTCP:LISTEN -t >/dev/null; then \
		echo "Killing process running on port $(SERVER_PORT)..."; \
		lsof -Pi :$(SERVER_PORT) -sTCP:LISTEN -t | xargs kill; \
		sleep 1; \
	fi
	cd $(SERVER_DIR) && node server.js &

client:
	@if [ ! -d "$(client_node_modules)" ]; then \
		echo "Installing client dependencies..."; \
		cd $(CLIENT_DIR) && npm install; \
	fi
	@if lsof -Pi :$(CLIENT_PORT) -sTCP:LISTEN -t >/dev/null; then \
		echo "Killing process running on port $(CLIENT_PORT)..."; \
		lsof -Pi :$(CLIENT_PORT) -sTCP:LISTEN -t | xargs kill; \
		sleep 1; \
	fi
	cd $(CLIENT_DIR) && PORT=$(CLIENT_PORT) npm start &

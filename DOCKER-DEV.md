# Numeros Development with Docker

This guide explains how to set up and use Docker for development purposes with the Numeros application.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- (Optional) NVIDIA GPU with compatible drivers for GPU acceleration

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/numeros.git
   cd numeros
   ```

2. Start the development environment:

   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

   This will:

   - Build the Docker image for development
   - Start the Next.js application with hot reload
   - Start an Ollama service for AI model inference

3. Access the application:
   - Next.js app: http://localhost:3000

## Development Workflow

The development setup includes:

- **Hot reloading**: Changes to your code will automatically reload the application
- **Volume mounts**: Your local codebase is mounted into the container
- **Node modules volume**: Prevents node_modules from being overwritten by local files

## Working with Ollama Models

1. Access the Ollama container:

   ```bash
   docker exec -it numeros-ollama-1 bash
   ```

2. Pull models you want to use:

   ```bash
   ollama pull llama3
   ```

3. List available models:
   ```bash
   ollama list
   ```

## Stopping the Environment

To stop the development environment:

```bash
docker-compose -f docker-compose.dev.yml down
```

To remove volumes when stopping:

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Environment Variables

The development environment uses these key environment variables:

- `OLLAMA_HOST`: Set to `http://ollama:11434` to connect to the Ollama service
- `NEXT_PUBLIC_DEFAULT_MODEL`: Default model to use (e.g., `llama3`)

## GPU Support

To enable GPU support:

1. Ensure you have NVIDIA drivers and the NVIDIA Container Toolkit installed
2. Uncomment the GPU-related lines in docker-compose.dev.yml
3. Restart the containers

## Troubleshooting

- **Models not loading**: Make sure you've pulled the required models in the Ollama container
- **Connection issues**: Check that the `OLLAMA_HOST` environment variable is set correctly
- **Port conflicts**: If ports are already in use, modify the port mappings in docker-compose.dev.yml

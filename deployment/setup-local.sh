#!/bin/bash

# Epicenter Local Development Setup Script

echo "========================================"
echo "Epicenter - Local Development Setup"
echo "========================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker not found. Please install Docker Desktop."
    exit 1
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "Created frontend/.env.local"
fi

# Start Docker Compose
echo "Starting services with Docker Compose..."
docker-compose -f deployment/docker-compose.yml up -d

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Services running:"
echo "- Backend:   http://localhost:3001"
echo "- Frontend:  http://localhost:3000"
echo "- Database:  localhost:5432"
echo ""
echo "To view logs:"
echo "  docker-compose -f deployment/docker-compose.yml logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose -f deployment/docker-compose.yml down"
echo ""

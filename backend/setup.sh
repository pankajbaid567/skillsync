#!/bin/bash

# SkillSync Backend Setup Script
# This script will help you set up the backend environment

echo "🚀 SkillSync Backend Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. You'll need PostgreSQL to run this application."
    echo "   Install it from: https://www.postgresql.org/download/"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "⚙️  Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please update .env with your database credentials and JWT secret"
else
    echo "⚠️  .env file already exists, skipping..."
fi

echo ""
echo "🗄️  Database setup..."
echo "Please ensure PostgreSQL is running and you have created a database."
echo ""
read -p "Do you want to run Prisma migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Generating Prisma client..."
    npx prisma generate
    
    echo "Running database migrations..."
    npx prisma migrate dev --name init
    
    echo "✅ Database setup complete!"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with your database URL and JWT secret"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Run 'npm test' to run tests"
echo ""
echo "📚 For more information, check the README.md file"

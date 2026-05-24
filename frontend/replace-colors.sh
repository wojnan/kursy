#!/bin/bash
# Script to replace all #BED784 with #4F772D and #a8cc6f with #3d5a22

# Find all TypeScript/TSX files and replace colors
find ./src/app -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" -exec sed -i 's/#BED784/#4F772D/g' {} +
find ./src/app -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" -exec sed -i 's/#a8cc6f/#3d5a22/g' {} +

echo "Color replacement complete!"

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all static assets
function getAllAssets() {
  try {
    const result = execSync(`find public/ -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" \\)`, { encoding: 'utf8' });
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding assets:', error.message);
    return [];
  }
}

// Check if file is referenced in code
function checkFileReferences(filePath) {
  const fileName = path.basename(filePath);
  const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
  const relativePath = filePath.replace('public/', '/');
  
  const searchTerms = [
    fileName,
    fileNameWithoutExt,
    relativePath,
    filePath
  ];
  
  let totalReferences = 0;
  const foundIn = [];
  
  for (const term of searchTerms) {
    try {
      const result = execSync(`rg --hidden --no-ignore -F --glob '!node_modules' --glob '!.git' --glob '!tools/reports' "${term}" || true`, { encoding: 'utf8' });
      if (result.trim()) {
        const lines = result.trim().split('\n');
        totalReferences += lines.length;
        foundIn.push(...lines.slice(0, 3)); // Limit to first 3 matches per term
      }
    } catch (error) {
      // Ignore errors, file might not be referenced
    }
  }
  
  return {
    references: totalReferences,
    foundIn: foundIn.slice(0, 5) // Limit total matches shown
  };
}

// Get file stats
function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    let lastModified = 'unknown';
    
    try {
      const gitResult = execSync(`git log -1 --format="%ai" -- "${filePath}" || echo "unknown"`, { encoding: 'utf8' });
      lastModified = gitResult.trim();
    } catch (error) {
      // Fallback to file system mtime
      lastModified = stats.mtime.toISOString();
    }
    
    return {
      size: stats.size,
      lastModified: lastModified
    };
  } catch (error) {
    return {
      size: 0,
      lastModified: 'unknown'
    };
  }
}

// Calculate confidence score
function calculateConfidence(references, size, lastModified) {
  let confidence = 0;
  
  // Reference-based scoring
  if (references === 0) confidence += 80;
  else if (references <= 2) confidence += 60;
  else if (references <= 5) confidence += 30;
  else confidence += 10;
  
  // Size-based scoring (very small files might be unused)
  if (size < 1024) confidence += 10; // < 1KB
  else if (size > 1024 * 1024) confidence -= 10; // > 1MB
  
  // Age-based scoring (older files more likely to be unused)
  if (lastModified !== 'unknown') {
    const ageInDays = (Date.now() - new Date(lastModified).getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays > 90) confidence += 15;
    else if (ageInDays > 30) confidence += 10;
  }
  
  return Math.min(100, Math.max(0, confidence));
}

// Main function
function scanAssets() {
  const assets = getAllAssets();
  const report = [];
  const candidates = [];
  
  console.log(`Scanning ${assets.length} assets...`);
  
  for (const asset of assets) {
    const references = checkFileReferences(asset);
    const stats = getFileStats(asset);
    const confidence = calculateConfidence(references.references, stats.size, stats.lastModified);
    
    let reason = '';
    let suggestedAction = 'ignore';
    
    if (references.references === 0) {
      reason = 'no-code-references';
      suggestedAction = confidence > 70 ? 'delete' : 'backup';
    } else if (references.references <= 2) {
      reason = 'rarely-used';
      suggestedAction = confidence > 80 ? 'backup' : 'ignore';
    } else {
      reason = 'actively-used';
      suggestedAction = 'ignore';
    }
    
    const entry = {
      path: asset,
      size: stats.size,
      lastModified: stats.lastModified,
      references: references.references,
      foundIn: references.foundIn,
      reason: reason,
      suggestedAction: suggestedAction,
      confidenceScore: confidence
    };
    
    report.push(entry);
    
    if (suggestedAction === 'delete' || (suggestedAction === 'backup' && confidence > 75)) {
      candidates.push(asset);
    }
    
    // Progress indicator
    if (report.length % 10 === 0) {
      console.log(`Processed ${report.length}/${assets.length} files...`);
    }
  }
  
  // Sort by confidence score (highest first)
  report.sort((a, b) => b.confidenceScore - a.confidenceScore);
  
  // Write reports
  fs.writeFileSync('tools/reports/unused-files-report.json', JSON.stringify(report, null, 2));
  fs.writeFileSync('tools/reports/candidates-for-delete.txt', candidates.join('\n'));
  
  console.log(`\nScan complete!`);
  console.log(`Total assets scanned: ${assets.length}`);
  console.log(`Candidates for deletion: ${candidates.length}`);
  console.log(`Reports saved to tools/reports/`);
  
  return { report, candidates };
}

// Run if called directly
if (require.main === module) {
  scanAssets();
}

module.exports = { scanAssets };

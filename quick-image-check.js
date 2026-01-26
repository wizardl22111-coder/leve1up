#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Image Diagnostic for LevelUp Store\n');

// 1. Check products.json for image references
console.log('📋 1. Checking products.json for image references...');
try {
  const productsPath = './data/products.json';
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  console.log(`Found ${productsData.length} products`);
  
  const subscriptionProducts = productsData.filter(p => p.category === 'subscriptions');
  console.log(`Found ${subscriptionProducts.length} subscription products\n`);
  
  subscriptionProducts.forEach(product => {
    console.log(`📦 ${product.product_name}:`);
    console.log(`   Image path: ${product.product_image}`);
    
    // Check if file exists
    const imagePath = path.join('.', 'public', product.product_image);
    const exists = fs.existsSync(imagePath);
    
    if (exists) {
      const stats = fs.statSync(imagePath);
      console.log(`   ✅ File exists (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      console.log(`   ❌ File missing: ${imagePath}`);
      
      // Look for similar files
      const publicImagesDir = './public/images/products/';
      if (fs.existsSync(publicImagesDir)) {
        const files = fs.readdirSync(publicImagesDir);
        const productName = product.product_name.toLowerCase();
        const similarFiles = files.filter(file => {
          const fileName = file.toLowerCase();
          return fileName.includes('chatgpt') && productName.includes('chatgpt') ||
                 fileName.includes('gemini') && productName.includes('gemini') ||
                 fileName.includes('canva') && productName.includes('canva') ||
                 fileName.includes('netflix') && productName.includes('netflix');
        });
        
        if (similarFiles.length > 0) {
          console.log(`   💡 Similar files found: ${similarFiles.join(', ')}`);
        }
      }
    }
    console.log('');
  });
  
} catch (error) {
  console.log(`❌ Error reading products.json: ${error.message}`);
}

// 2. Check public/images/products directory
console.log('📁 2. Checking public/images/products directory...');
try {
  const imagesDir = './public/images/products/';
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );
    
    console.log(`Found ${imageFiles.length} image files:`);
    imageFiles.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   📄 ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
  } else {
    console.log('❌ Directory does not exist: ./public/images/products/');
  }
} catch (error) {
  console.log(`❌ Error reading images directory: ${error.message}`);
}

// 3. Check components for Image usage
console.log('\n🧩 3. Checking components for Image usage...');
try {
  const componentsToCheck = [
    './components/ProductGrid.tsx',
    './components/ProductDetail.tsx',
    './components/OptimizedImage.tsx'
  ];
  
  componentsToCheck.forEach(componentPath => {
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8');
      
      console.log(`📄 ${componentPath}:`);
      
      // Check for Image imports
      const imageImports = content.match(/import.*Image.*from/g) || [];
      console.log(`   📥 Image imports: ${imageImports.length}`);
      imageImports.forEach(imp => console.log(`      ${imp}`));
      
      // Check for Image components
      const imageComponents = content.match(/<Image[^>]*>/g) || [];
      console.log(`   🖼️  Image components: ${imageComponents.length}`);
      
      // Check for img tags
      const imgTags = content.match(/<img[^>]*>/g) || [];
      console.log(`   🏷️  img tags: ${imgTags.length}`);
      
      // Check for src attributes
      const srcAttributes = content.match(/src=["'][^"']*["']/g) || [];
      console.log(`   🔗 src attributes: ${srcAttributes.length}`);
      srcAttributes.slice(0, 3).forEach(src => console.log(`      ${src}`));
      
    } else {
      console.log(`❌ Component not found: ${componentPath}`);
    }
    console.log('');
  });
} catch (error) {
  console.log(`❌ Error checking components: ${error.message}`);
}

// 4. Check CSS for potential issues
console.log('🎨 4. Checking for CSS issues that might hide images...');
try {
  const cssFiles = [
    './app/globals.css',
    './components/ProductGrid.tsx',
    './components/ProductDetail.tsx'
  ];
  
  cssFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`📄 ${filePath}:`);
      
      // Check for problematic CSS
      const issues = [
        { pattern: /display\s*:\s*none/gi, name: 'display: none' },
        { pattern: /opacity\s*:\s*0/gi, name: 'opacity: 0' },
        { pattern: /visibility\s*:\s*hidden/gi, name: 'visibility: hidden' },
        { pattern: /height\s*:\s*0/gi, name: 'height: 0' },
        { pattern: /width\s*:\s*0/gi, name: 'width: 0' },
        { pattern: /max-height\s*:\s*0/gi, name: 'max-height: 0' },
        { pattern: /max-width\s*:\s*0/gi, name: 'max-width: 0' }
      ];
      
      let foundIssues = false;
      issues.forEach(issue => {
        const matches = content.match(issue.pattern);
        if (matches) {
          console.log(`   ⚠️  ${issue.name}: ${matches.length} occurrences`);
          foundIssues = true;
        }
      });
      
      if (!foundIssues) {
        console.log('   ✅ No obvious CSS issues found');
      }
    }
    console.log('');
  });
} catch (error) {
  console.log(`❌ Error checking CSS: ${error.message}`);
}

// 5. Check Next.js config
console.log('⚙️ 5. Checking Next.js configuration...');
try {
  const configFiles = ['./next.config.js', './next.config.mjs'];
  let configFound = false;
  
  configFiles.forEach(configPath => {
    if (fs.existsSync(configPath)) {
      configFound = true;
      const content = fs.readFileSync(configPath, 'utf8');
      
      console.log(`📄 Found config: ${configPath}`);
      
      // Check for image-related config
      const imageConfig = content.match(/images\s*:\s*{[^}]*}/g);
      if (imageConfig) {
        console.log(`   🖼️  Images config found: ${imageConfig[0]}`);
      } else {
        console.log('   ⚪ No images config found');
      }
      
      // Check for basePath
      const basePath = content.match(/basePath\s*:\s*["']([^"']*)["']/);
      if (basePath) {
        console.log(`   📍 basePath: ${basePath[1]}`);
      }
      
      // Check for assetPrefix
      const assetPrefix = content.match(/assetPrefix\s*:\s*["']([^"']*)["']/);
      if (assetPrefix) {
        console.log(`   🔗 assetPrefix: ${assetPrefix[1]}`);
      }
    }
  });
  
  if (!configFound) {
    console.log('⚪ No Next.js config found (using defaults)');
  }
} catch (error) {
  console.log(`❌ Error checking Next.js config: ${error.message}`);
}

console.log('\n' + '='.repeat(60));
console.log('📋 QUICK DIAGNOSTIC SUMMARY');
console.log('='.repeat(60));
console.log('✅ Check complete! Review the output above for any issues.');
console.log('💡 Common fixes:');
console.log('   - Ensure image files exist in public/images/products/');
console.log('   - Check that product_image paths in products.json are correct');
console.log('   - Verify Image component is imported correctly');
console.log('   - Look for CSS rules that might hide images');
console.log('   - Check Next.js image configuration');

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Markdownlint エラー自動修正スクリプト');
console.log('=====================================');

// Markdownファイルを再帰的に検索（node_modulesは除外）
const markdownFiles = glob.sync('**/*.md', {
  ignore: ['node_modules/**', '.git/**']
});

console.log(`📁 ${markdownFiles.length}個のMarkdownファイルを発見`);

let totalFixed = 0;

markdownFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixes = [];

  // MD040: 言語指定のないコードブロックを修正
  content = content.replace(/```\n([\s\S]*?)\n```/g, (match, codeContent) => {
    // 既に言語指定がある場合はスキップ
    if (match.match(/```\w+/)) {
      return match;
    }

    // コードの内容から言語を推測
    if (codeContent.includes('flutter pub') || codeContent.includes('npm ') || 
        codeContent.includes('cd ') || codeContent.includes('git ') ||
        codeContent.includes('npx ') || codeContent.includes('mise ')) {
      modified = true;
      fixes.push('MD040: コードブロックに言語指定(bash)を追加');
      return '```bash\n' + codeContent + '\n```';
    }
    if (codeContent.includes('void main') || codeContent.includes('class ') || 
        codeContent.includes('import \'package:') || codeContent.includes('Widget ')) {
      modified = true;
      fixes.push('MD040: コードブロックに言語指定(dart)を追加');
      return '```dart\n' + codeContent + '\n```';
    }
    if (codeContent.includes('{') && codeContent.includes('"') && 
        (codeContent.includes('dependencies') || codeContent.includes('version'))) {
      modified = true;
      fixes.push('MD040: コードブロックに言語指定(json)を追加');
      return '```json\n' + codeContent + '\n```';
    }
    if (codeContent.includes('---') && codeContent.includes('title:')) {
      modified = true;
      fixes.push('MD040: コードブロックに言語指定(yaml)を追加');
      return '```yaml\n' + codeContent + '\n```';
    }
    if (codeContent.includes('environment:') || codeContent.includes('sdk:') || 
        codeContent.includes('flutter:') || codeContent.includes('dependencies:')) {
      modified = true;
      fixes.push('MD040: コードブロックに言語指定(yaml)を追加');
      return '```yaml\n' + codeContent + '\n```';
    }
    // その他の場合はtextとして扱う
    modified = true;
    fixes.push('MD040: コードブロックに言語指定(text)を追加');
    return '```text\n' + codeContent + '\n```';
  });

  // MD045: 画像のalt属性がない場合の修正
  content = content.replace(/!\[\]\((.*?)\)/g, (match, imagePath) => {
    modified = true;
    const fileName = path.basename(imagePath, path.extname(imagePath));
    fixes.push('MD045: 画像にalt属性を追加');
    return `![${fileName}](${imagePath})`;
  });

  // MD031: コードブロック前後の空行を追加
  content = content.replace(/([^\n])\n```/g, '$1\n\n```');
  content = content.replace(/```\n([^\n])/g, '```\n\n$1');

  // MD029: 順序付きリストの番号修正
  const lines = content.split('\n');
  const fixedLines = [];
  let inOrderedList = false;
  let currentNumber = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    
    if (match) {
      const [, indent, originalNumber, rest] = match;
      if (originalNumber != currentNumber) {
        inOrderedList = true;
        fixedLines.push(`${indent}${currentNumber}. ${rest}`);
        fixes.push(`MD029: 順序付きリスト番号を${originalNumber}→${currentNumber}に修正`);
        modified = true;
      } else {
        fixedLines.push(line);
      }
      currentNumber++;
    } else if (inOrderedList && line.trim() === '') {
      // 空行の場合、順序付きリストを継続
      fixedLines.push(line);
    } else if (inOrderedList && !line.match(/^\s*$/)) {
      // 順序付きリスト以外の行が来たらリセット
      inOrderedList = false;
      currentNumber = 1;
      fixedLines.push(line);
    } else {
      fixedLines.push(line);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, fixedLines.join('\n'));
    console.log(`✅ ${filePath}`);
    fixes.forEach(fix => console.log(`   - ${fix}`));
    totalFixed++;
  }
});

console.log('=====================================');
console.log(`🎉 ${totalFixed}個のファイルを修正完了！`);
console.log('');
console.log('📋 次の手順:');
console.log('1. markdownlint-cli2でエラーチェック: npm run lint:md');
console.log('2. 残りのエラーを手動修正');
console.log('3. 最終確認: markdownlint-cli2 "README.md" "articles/*.md"'); 
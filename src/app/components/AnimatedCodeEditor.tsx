import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const codeSnippets = [
  {
    language: 'javascript',
    lines: [
      "const createWebsite = () => {",
      "  const header = document.createElement('header');",
      "  header.className = 'hero-section';",
      "  ",
      "  const title = document.createElement('h1');",
      "  title.textContent = 'Welcome to My Site';",
      "  header.appendChild(title);",
      "  ",
      "  document.body.appendChild(header);",
      "};",
      "",
      "createWebsite();",
    ]
  },
  {
    language: 'react',
    lines: [
      "function App() {",
      "  const [count, setCount] = useState(0);",
      "  ",
      "  return (",
      "    <div className='container'>",
      "      <h1>Counter: {count}</h1>",
      "      <button onClick={() => setCount(count + 1)}>",
      "        Increment",
      "      </button>",
      "    </div>",
      "  );",
      "}",
    ]
  },
  {
    language: 'css',
    lines: [
      ".hero-section {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  min-height: 100vh;",
      "  background: linear-gradient(",
      "    135deg,",
      "    #667eea 0%,",
      "    #764ba2 100%",
      "  );",
      "}",
    ]
  }
];

export function AnimatedCodeEditor() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedCode, setDisplayedCode] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [clickedLine, setClickedLine] = useState<number | null>(null);

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet];
    
    if (currentLine < snippet.lines.length) {
      const line = snippet.lines[currentLine];
      
      if (currentChar < line.length) {
        const timer = setTimeout(() => {
          setDisplayedCode(prev => {
            const newCode = [...prev];
            if (newCode[currentLine]) {
              newCode[currentLine] = line.substring(0, currentChar + 1);
            } else {
              newCode[currentLine] = line.substring(0, currentChar + 1);
            }
            return newCode;
          });
          setCurrentChar(prev => prev + 1);
        }, 30);
        
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }, 200);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Reset and move to next snippet
      const timer = setTimeout(() => {
        setDisplayedCode([]);
        setCurrentLine(0);
        setCurrentChar(0);
        setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentChar, currentLine, currentSnippet]);

  const getLanguageColor = () => {
    const colors = {
      javascript: 'from-[#F7DF1E] to-[#F59E0B]',
      react: 'from-[#61DAFB] to-[#3B82F6]',
      css: 'from-[#264DE4] to-[#2965F1]'
    };
    return colors[codeSnippets[currentSnippet].language as keyof typeof colors];
  };

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div 
            className={`px-3 py-1 rounded-md bg-gradient-to-r ${getLanguageColor()} text-xs font-semibold text-white shadow-lg`}
            key={currentSnippet}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {codeSnippets[currentSnippet].language.toUpperCase()}
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">Live</span>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="relative h-[calc(100%-48px)] overflow-hidden">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/40 border-r border-gray-700/30 flex flex-col py-4 text-right pr-3">
          {displayedCode.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-500 font-mono leading-6 h-6"
            >
              {index + 1}
            </motion.div>
          ))}
        </div>

        {/* Code content */}
        <div className="pl-14 pr-4 py-4 overflow-auto h-full">
          <pre className="font-mono text-sm leading-6">
            {displayedCode.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: hoveredLine === index || clickedLine === index ? 1.05 : 1,
                  z: hoveredLine === index || clickedLine === index ? 10 : 0
                }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setHoveredLine(index)}
                onMouseLeave={() => setHoveredLine(null)}
                onClick={() => {
                  setClickedLine(index);
                  setTimeout(() => setClickedLine(null), 600);
                }}
                className={`relative cursor-pointer rounded px-2 -mx-2 py-0.5 transition-all ${
                  hoveredLine === index || clickedLine === index 
                    ? 'bg-[#FB923C]/20 shadow-lg shadow-[#FB923C]/30' 
                    : 'hover:bg-gray-800/50'
                }`}
                style={{
                  zIndex: hoveredLine === index || clickedLine === index ? 10 : 0
                }}
              >
                <code className="text-gray-100">
                  {highlightSyntax(line, codeSnippets[currentSnippet].language)}
                </code>
                {index === currentLine - 1 && currentChar === 0 && (
                  <motion.span
                    className="inline-block w-2 h-5 bg-[#FB923C] ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
                
                {/* Pop-out indicator on click */}
                {clickedLine === index && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FBBF24] shadow-lg shadow-[#FBBF24]/50"
                  />
                )}
              </motion.div>
            ))}
          </pre>
        </div>

        {/* Animated gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#FB923C]/10 backdrop-blur-sm border-t border-[#FB923C]/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="font-mono">UTF-8</span>
          <span>•</span>
          <span>Ln {currentLine + 1}, Col {currentChar + 1}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="text-[#FB923C] font-semibold">Decode · Analyzing</span>
          <div className="flex gap-1">
            <motion.div 
              className="w-1 h-3 bg-[#FB923C] rounded-full"
              animate={{ height: ['12px', '6px', '12px'] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-1 h-3 bg-[#FBBF24] rounded-full"
              animate={{ height: ['12px', '6px', '12px'] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-1 h-3 bg-[#F472B6] rounded-full"
              animate={{ height: ['12px', '6px', '12px'] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function highlightSyntax(line: string, language: string): JSX.Element {
  // Safety check
  if (!line || typeof line !== 'string') {
    return <span className="text-gray-100">{line || ''}</span>;
  }

  // Keywords
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'useState', 'useEffect'];
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  
  // Strings
  const stringRegex = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
  
  // Comments
  const commentRegex = /\/\/.*/g;
  
  // Functions
  const functionRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
  
  // Numbers
  const numberRegex = /\b(\d+)\b/g;
  
  // CSS properties
  const cssPropertyRegex = /([a-z-]+)(?=\s*:)/g;
  
  // CSS values
  const cssValueRegex = /:\s*([^;]+);/g;

  let result = line;
  const replacements: Array<{ start: number; end: number; element: JSX.Element }> = [];

  // Process different syntax elements
  const matches: Array<{ index: number; length: number; type: string; content: string }> = [];

  // Find all matches
  let match;
  
  if (language === 'css') {
    // CSS syntax
    while ((match = cssPropertyRegex.exec(line)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type: 'css-property', content: match[0] });
    }
    
    try {
      const valueMatches = Array.from(line.matchAll(cssValueRegex));
      for (const m of valueMatches) {
        const content = m[1];
        const startIndex = m.index! + 2; // After ": "
        matches.push({ index: startIndex, length: content.length, type: 'css-value', content });
      }
    } catch (e) {
      // Ignore regex errors
    }
  } else {
    // JavaScript/React syntax
    while ((match = keywordRegex.exec(line)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type: 'keyword', content: match[0] });
    }
    
    try {
      const functionMatches = Array.from(line.matchAll(functionRegex));
      for (const m of functionMatches) {
        matches.push({ index: m.index!, length: m[1].length, type: 'function', content: m[1] });
      }
    } catch (e) {
      // Ignore regex errors
    }
  }

  try {
    const stringMatches = Array.from(line.matchAll(stringRegex));
    for (const m of stringMatches) {
      matches.push({ index: m.index!, length: m[0].length, type: 'string', content: m[0] });
    }
  } catch (e) {
    // Ignore regex errors
  }

  try {
    const commentMatches = Array.from(line.matchAll(commentRegex));
    for (const m of commentMatches) {
      matches.push({ index: m.index!, length: m[0].length, type: 'comment', content: m[0] });
    }
  } catch (e) {
    // Ignore regex errors
  }

  try {
    const numberMatches = Array.from(line.matchAll(numberRegex));
    for (const m of numberMatches) {
      matches.push({ index: m.index!, length: m[0].length, type: 'number', content: m[0] });
    }
  } catch (e) {
    // Ignore regex errors
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep first match)
  const filteredMatches = matches.filter((match, i) => {
    if (i === 0) return true;
    const prevMatch = matches[i - 1];
    return match.index >= prevMatch.index + prevMatch.length;
  });

  if (filteredMatches.length === 0) {
    return <span className="text-gray-100">{line}</span>;
  }

  // Build JSX
  const elements: JSX.Element[] = [];
  let lastIndex = 0;

  filteredMatches.forEach((match, i) => {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${i}`} className="text-gray-100">
          {line.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add colored match
    let color = 'text-gray-100';
    switch (match.type) {
      case 'keyword':
        color = 'text-[#FB923C]';
        break;
      case 'string':
        color = 'text-[#A5D6A7]';
        break;
      case 'function':
        color = 'text-[#FFD54F]';
        break;
      case 'number':
        color = 'text-[#CE93D8]';
        break;
      case 'comment':
        color = 'text-gray-500';
        break;
      case 'css-property':
        color = 'text-[#64B5F6]';
        break;
      case 'css-value':
        color = 'text-[#FFB74D]';
        break;
    }

    elements.push(
      <span key={`match-${i}`} className={color}>
        {match.content}
      </span>
    );

    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < line.length) {
    elements.push(
      <span key="text-end" className="text-gray-100">
        {line.substring(lastIndex)}
      </span>
    );
  }

  return <>{elements}</>;
}
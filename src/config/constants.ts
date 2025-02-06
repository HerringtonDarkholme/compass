// 0 - 100, 0 most liberal, 100 most authoritative
export const predefinedEditors = [
  { id: 'atom', name: 'Atom', score: 70 },
  { id: 'cursor', name: 'Cursor', score: 90 },
  { id: 'eclipse', name: 'Eclipse', score: 90 },
  { id: 'emacs', name: 'Emacs', score: 20 },
  { id: 'intellij', name: 'IntelliJ IDEA', score: 100 },
  { id: 'nano', name: 'Nano', score: 0 },
  { id: 'neovim', name: 'Neovim', score: 20 },
  { id: 'notepadpp', name: 'Notepad++', score: 45 },
  { id: 'sublime', name: 'Sublime Text', score: 40 },
  { id: 'vim', name: 'Vim', score: 20 },
  { id: 'vscode', name: 'VS Code', score: 90 },
  { id: 'webstorm', name: 'WebStorm', score: 100 },
  { id: 'zed', name: 'Zed', score: 30 },
];

// 0 - 100, 0 most indie, 100 most big tech
export const predefinedLanguages = [
  { id: 'bash', name: 'Bash', score: 0 },
  { id: 'c', name: 'C', score: 80 },
  { id: 'cpp', name: 'C++', score: 90 },
  { id: 'clojure', name: 'Clojure', score: 5 },
  { id: 'csharp', name: 'C#', score: 95 },
  { id: 'dart', name: 'Dart', score: 65 },
  { id: 'elixir', name: 'Elixir', score: 10 },
  { id: 'erlang', name: 'Erlang', score: 15 },
  { id: 'f_sharp', name: 'F#', score: 30 },
  { id: 'go', name: 'Go', score: 60 },
  { id: 'haskell', name: 'Haskell', score: 25 },
  { id: 'java', name: 'Java', score: 90 },
  { id: 'javascript', name: 'JavaScript', score: 80 },
  { id: 'kotlin', name: 'Kotlin', score: 75 },
  { id: 'python', name: 'Python', score: 50 },
  { id: 'ruby', name: 'Ruby', score: 20 },
  { id: 'rust', name: 'Rust', score: 40 },
  { id: 'scala', name: 'Scala', score: 45 },
  { id: 'swift', name: 'Swift', score: 70 },
  { id: 'typescript', name: 'TypeScript', score: 80 },
];

// Editor colors based on their brand/icon colors
export const editorColors: Record<string, string> = {
  vscode: '#007ACC',
  vim: '#019733',
  neovim: '#57A143',
  emacs: '#7F5AB6',
  sublime: '#FF9800',
  atom: '#66595C',
  webstorm: '#00CDD7',
  notepadpp: '#90E59A',
  eclipse: '#2C2255',
  intellij: '#087CFA',
  nano: '#4A90E2',
  cursor: '#0066FF',
  zed: '#0751cf',
};

// Programming language colors from GitHub
export const languageColors: Record<string, string> = {
  bash: '#a32d2a',
  c: '#555555', //C1C1C1 alternate for visibility
  cpp: '#f34b7d', //6495ED 
  csharp: '#178600',
  java: '#B07219',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  kotlin: '#A97BFF',
  swift: '#F05138',
  dart: '#00B4AB',
  go: '#00ADD8',
  python: '#3572A5',
  scala: '#DC322F',
  rust: '#DEA584',
  f_sharp: '#B845FC',
  haskell: '#5E5086',
  ruby: '#701516',
  erlang: '#B83998',
  elixir: '#6E4A7E',
  clojure: '#DB5855'
};

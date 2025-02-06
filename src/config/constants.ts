// 0 - 100, 0 most liberal, 100 most authoritative
export const predefinedEditors = [
  { id: 'vscode', name: 'VS Code', score: 90 },
  { id: 'vim', name: 'Vim', score: 20 },
  { id: 'emacs', name: 'Emacs', score: 20 },
  { id: 'sublime', name: 'Sublime Text', score: 40 },
  { id: 'atom', name: 'Atom', score: 70 },
  { id: 'webstorm', name: 'WebStorm', score: 100 },
  { id: 'notepadpp', name: 'Notepad++', score: 45 },
  { id: 'eclipse', name: 'Eclipse', score: 90 },
  { id: 'intellij', name: 'IntelliJ IDEA', score: 100 },
  { id: 'nano', name: 'Nano', score: 0 }
];

// 0 - 100, 0 most indie, 100 most big tech
export const predefinedLanguages = [
  { id: 'csharp', name: 'C#', score: 95 },
  { id: 'java', name: 'Java', score: 90 },
  { id: 'typescript', name: 'TypeScript', score: 80 },
  { id: 'kotlin', name: 'Kotlin', score: 75 },
  { id: 'swift', name: 'Swift', score: 70 },
  { id: 'dart', name: 'Dart', score: 65 },
  { id: 'go', name: 'Go', score: 60 },
  { id: 'python', name: 'Python', score: 50 },
  { id: 'scala', name: 'Scala', score: 45 },
  { id: 'rust', name: 'Rust', score: 40 },
  { id: 'f_sharp', name: 'F#', score: 30 },
  { id: 'haskell', name: 'Haskell', score: 25 },
  { id: 'ruby', name: 'Ruby', score: 20 },
  { id: 'erlang', name: 'Erlang', score: 15 },
  { id: 'elixir', name: 'Elixir', score: 10 },
  { id: 'clojure', name: 'Clojure', score: 5 }
];

// Editor colors based on their brand/icon colors
export const editorColors: Record<string, string> = {
  vscode: '#007ACC',
  vim: '#019733',
  emacs: '#7F5AB6',
  sublime: '#FF9800',
  atom: '#66595C',
  webstorm: '#00CDD7',
  notepadpp: '#90E59A',
  eclipse: '#2C2255',
  intellij: '#087CFA',
  nano: '#4A90E2'
};

// Programming language colors from GitHub
export const languageColors: Record<string, string> = {
  csharp: '#178600',
  java: '#B07219',
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

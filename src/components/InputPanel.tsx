import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Slider } from '@mui/material';

interface Tool {
  id: string;
  name: string;
  usage: number;
}

interface InputPanelProps {
  onPositionUpdate: (editorPos: number, langPos: number) => void;
}

// 0 - 100, 0 most liberal, 100 most authoritative
const predefinedEditors = [
  { id: 'vscode', name: 'VS Code', type: 90 },
  { id: 'vim', name: 'Vim', type: 20 },
  { id: 'emacs', name: 'Emacs', type: 20 },
  { id: 'sublime', name: 'Sublime Text', type: 40 },
  { id: 'atom', name: 'Atom', type: 70 },
  { id: 'webstorm', name: 'WebStorm', type: 100 },
  { id: 'notepadpp', name: 'Notepad++', type: 45 },
  { id: 'eclipse', name: 'Eclipse', type: 90 },
  { id: 'intellij', name: 'IntelliJ IDEA', type: 100 },
  { id: 'nano', name: 'Nano', type: 0 }
];
// 0 - 100, 0 most indie, 100 most big tech
const predefinedLanguages = [
  { id: 'csharp', name: 'C#', type: 95 },
  { id: 'java', name: 'Java', type: 90 },
  { id: 'typescript', name: 'TypeScript', type: 80 },
  { id: 'kotlin', name: 'Kotlin', type: 75 },
  { id: 'swift', name: 'Swift', type: 70 },
  { id: 'dart', name: 'Dart', type: 65 },
  { id: 'go', name: 'Go', type: 60 },
  { id: 'python', name: 'Python', type: 50 },
  { id: 'scala', name: 'Scala', type: 45 },
  { id: 'rust', name: 'Rust', type: 40 },
  { id: 'f_sharp', name: 'F#', type: 30 },
  { id: 'haskell', name: 'Haskell', type: 25 },
  { id: 'ruby', name: 'Ruby', type: 20 },
  { id: 'erlang', name: 'Erlang', type: 15 },
  { id: 'elixir', name: 'Elixir', type: 10 },
  { id: 'clojure', name: 'Clojure', type: 5 }
];

const InputPanel = ({ onPositionUpdate }: InputPanelProps) => {
  const [editors, setEditors] = useState<Tool[]>([]);
  const [languages, setLanguages] = useState<Tool[]>([]);

  const addTool = (tool: { id: string; name: string }, isEditor: boolean) => {
    const tools = isEditor ? editors : languages;

    if (tools.length === 0) {
      const newTool = { ...tool, usage: 100 };
      if (isEditor) {
        setEditors([newTool]);
      } else {
        setLanguages([newTool]);
      }
    } else {
      const equalShare = 100 / (tools.length + 1);
      const updatedTools = tools.map(t => ({ ...t, usage: equalShare }));
      const newTool = { ...tool, usage: equalShare };
      if (isEditor) {
        setEditors([...updatedTools, newTool]);
      } else {
        setLanguages([...updatedTools, newTool]);
      }
    }
    updatePositions();
  };

  const removeTool = (id: string, isEditor: boolean) => {
    if (isEditor) {
      const remainingEditors = editors.filter(e => e.id !== id);
      const totalUsage = remainingEditors.reduce((sum, e) => sum + e.usage, 0);
      if (remainingEditors.length > 0) {
        const scaleFactor = 100 / totalUsage;
        setEditors(remainingEditors.map(e => ({ ...e, usage: e.usage * scaleFactor })));
      } else {
        setEditors([]);
      }
    } else {
      const remainingLanguages = languages.filter(l => l.id !== id);
      const totalUsage = remainingLanguages.reduce((sum, l) => sum + l.usage, 0);
      if (remainingLanguages.length > 0) {
        const scaleFactor = 100 / totalUsage;
        setLanguages(remainingLanguages.map(l => ({ ...l, usage: l.usage * scaleFactor })));
      } else {
        setLanguages([]);
      }
    }
    updatePositions();
  };

  const handleSliderChange = (values: number[], isEditor: boolean) => {
    const tools = isEditor ? editors : languages;
    const setTools = isEditor ? setEditors : setLanguages;

    if (tools.length < 2) return;

    // Convert slider values to usage percentages
    const newUsages = [];
    let previousValue = 0;

    // Calculate usages for all segments
    for (let i = 0; i < tools.length; i++) {
      const currentValue = i < values.length ? values[i] : 100;
      const usage = currentValue - previousValue;
      newUsages.push(Math.max(0, usage));
      previousValue = currentValue;
    }

    // Normalize percentages to ensure they sum to 100
    const total = newUsages.reduce((sum, usage) => sum + usage, 0);
    const normalizedUsages = newUsages.map(usage => (usage / total) * 100);

    // Update tools with normalized usage values
    const updatedTools = tools.map((tool, index) => ({
      ...tool,
      usage: normalizedUsages[index]
    }));

    setTools(updatedTools);
    updatePositions();
  };

  const getColorFromType = (type: number, isEditor: boolean, id: string) => {
    // Editor colors based on their brand/icon colors
    const editorColors: Record<string, string> = {
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
    const languageColors: Record<string, string> = {
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

    if (isEditor && id in editorColors) {
      return editorColors[id];
    } else if (!isEditor && id in languageColors) {
      return languageColors[id];
    }

    // Fallback to the original color interpolation if no predefined color is found
    const r = Math.round(type * 2.55);
    const g = Math.round((100 - type) * 2.55);
    const b = Math.round(100 * 2.55);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getSliderMarks = (tools: Tool[], isEditor: boolean) => {
    if (tools.length <= 1) return [];

    const marks = [];
    let accumulator = 0;

    for (let i = 0; i < tools.length - 1; i++) {
      accumulator += tools[i].usage;
      const editorType = predefinedEditors.find(e => e.id === tools[i].id)?.type;
      const langType = predefinedLanguages.find(l => l.id === tools[i].id)?.type;
      const type = editorType ?? langType ?? 50;
      marks.push({
        value: accumulator,
        label: '',
        style: {
          '&:before': {
            backgroundColor: getColorFromType(type, isEditor, tools[i].id)
          }
        }
      });
    }

    return marks;
  };

  const getSliderValue = (tools: Tool[]) => {
    if (tools.length <= 1) return [];

    const values = [];
    let accumulator = 0;

    for (let i = 0; i < tools.length - 1; i++) {
      accumulator += tools[i].usage;
      values.push(accumulator);
    }

    return values;
  };

  const updatePositions = () => {
    const editorPos = calculatePosition(editors);
    const langPos = calculatePosition(languages);
    onPositionUpdate(editorPos, langPos);
  };

  const calculatePosition = (tools: Tool[]) => {
    if (tools.length === 0) return 0;

    const totalUsage = tools.reduce((sum, tool) => sum + tool.usage, 0);
    const weightedSum = tools.reduce((sum, tool) => {
      const weight = tool.usage / totalUsage;
      const editorType = predefinedEditors.find(e => e.id === tool.id)?.type;
      const langType = predefinedLanguages.find(l => l.id === tool.id)?.type;
      const type = editorType ?? langType ?? 50; // default to center if not found
      return sum + (weight * type);
    }, 0);
    // Normalize the weighted sum to be between -1 and 1
    return (weightedSum - 50) / 50;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Editors</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>        {predefinedEditors.map(editor => (
          <Button
            key={editor.id}
            variant="outlined"
            onClick={() => addTool(editor, true)}
            disabled={editors.some(e => e.id === editor.id)}
            sx={{
              whiteSpace: 'normal',
              textAlign: 'center',
              minHeight: '48px',
              minWidth: '120px',
              flex: '1 1 auto',
              maxWidth: '180px',
              borderColor: getColorFromType(editor.type, true, editor.id),
              color: getColorFromType(editor.type, true, editor.id),
              '&:hover': {
                borderColor: getColorFromType(editor.type, true, editor.id),
                backgroundColor: `${getColorFromType(editor.type, true, editor.id)}10`
              }
            }}
          >
            {editor.name}
          </Button>
        ))}
      </Box>

      {editors.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Slider
            value={getSliderValue(editors)}
            onChange={(_, value) => handleSliderChange(value as number[], true)}
            marks={getSliderMarks(editors, true)}
            step={1}
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-track': {
                background: 'none'
              },
              '& .MuiSlider-rail': {
                opacity: 1,
                background: 'linear-gradient(to right, ' +
                  editors.map((editor, index, array) => {
                    const type = predefinedEditors.find(e => e.id === editor.id)?.type ?? 50;
                    const startPercent = index === 0 ? 0 : array.slice(0, index).reduce((sum, e) => sum + e.usage, 0);
                    const endPercent = startPercent + editor.usage;
                    return `${getColorFromType(type, true, editor.id)} ${startPercent}% ${endPercent}%`;
                  }).join(', ') + ')'
              }
            }}
          />
          <List>
            {editors.map((editor) => (
              <ListItem key={editor.id} dense>
                <ListItemText
                  primary={`${editor.name} (${editor.usage.toFixed(1)}%)`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeTool(editor.id, true)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>Languages</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>        {predefinedLanguages.map(lang => (
          <Button
            key={lang.id}
            variant="outlined"
            onClick={() => addTool(lang, false)}
            disabled={languages.some(l => l.id === lang.id)}
            sx={{
              whiteSpace: 'normal',
              textAlign: 'center',
              minHeight: '48px',
              minWidth: '120px',
              flex: '1 1 auto',
              maxWidth: '180px',
              borderColor: getColorFromType(lang.type, false, lang.id),
              color: getColorFromType(lang.type, false, lang.id),
              '&:hover': {
                borderColor: getColorFromType(lang.type, false, lang.id),
                backgroundColor: `${getColorFromType(lang.type, false, lang.id)}10`
              }
            }}
          >
            {lang.name}
          </Button>
        ))}
      </Box>

      {languages.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Slider
            value={getSliderValue(languages)}
            onChange={(_, value) => handleSliderChange(value as number[], false)}
            marks={getSliderMarks(languages, false)}
            step={1}
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-track': {
                background: 'none'
              },
              '& .MuiSlider-rail': {
                opacity: 1,
                background: 'linear-gradient(to right, ' +
                  languages.map((lang, index, array) => {
                    const type = predefinedLanguages.find(l => l.id === lang.id)?.type ?? 50;
                    const startPercent = index === 0 ? 0 : array.slice(0, index).reduce((sum, l) => sum + l.usage, 0);
                    const endPercent = startPercent + lang.usage;
                    return `${getColorFromType(type, false, lang.id)} ${startPercent}% ${endPercent}%`;
                  }).join(', ') + ')'
              }
            }}
          />
          <List>
            {languages.map((lang) => (
              <ListItem key={lang.id} dense>
                <ListItemText
                  primary={`${lang.name} (${lang.usage.toFixed(1)}%)`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeTool(lang.id, false)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default InputPanel;

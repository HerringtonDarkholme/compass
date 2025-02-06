import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Slider } from '@mui/material';
import { predefinedEditors, predefinedLanguages, editorColors, languageColors } from '../config/constants';
import ToolList from './ToolList';

export interface Tool {
  id: string;
  name: string;
  usage: number;
}

interface InputPanelProps {
  onPositionUpdate: (editorPos: number, langPos: number) => void;
  onSelectionChange?: (hasEditors: boolean, hasLanguages: boolean) => void;
  hideButtons?: boolean;
}


const InputPanel = ({ onPositionUpdate, onSelectionChange, hideButtons }: InputPanelProps) => {
  const [editors, setEditors] = useState<Tool[]>([]);
  const [languages, setLanguages] = useState<Tool[]>([]);

  const addTool = (tool: { id: string; name: string }, isEditor: boolean) => {
    const tools = isEditor ? editors : languages;

    if (tools.length === 0) {
      const newTool = { ...tool, usage: 100 };
      if (isEditor) {
        const newEditors = [newTool];
        setEditors(newEditors);
        updatePositions(newEditors, languages);
      } else {
        const newLanguages = [newTool];
        setLanguages(newLanguages);
        updatePositions(editors, newLanguages);
      }
    } else {
      const equalShare = 100 / (tools.length + 1);
      const updatedTools = tools.map(t => ({ ...t, usage: equalShare }));
      const newTool = { ...tool, usage: equalShare };
      if (isEditor) {
        const newEditors = [...updatedTools, newTool];
        setEditors(newEditors);
        updatePositions(newEditors, languages);
      } else {
        const newLanguages = [...updatedTools, newTool];
        setLanguages(newLanguages);
        updatePositions(editors, newLanguages);
      }
    }
    onSelectionChange?.(editors.length > 0 || isEditor, languages.length > 0 || !isEditor);
  };

  const removeTool = (id: string, isEditor: boolean) => {
    if (isEditor) {
      const remainingEditors = editors.filter(e => e.id !== id);
      const totalUsage = remainingEditors.reduce((sum, e) => sum + e.usage, 0);
      if (remainingEditors.length > 0) {
        const scaleFactor = 100 / totalUsage;
        const newEditors = remainingEditors.map(e => ({ ...e, usage: e.usage * scaleFactor }));
        setEditors(newEditors);
        updatePositions(newEditors, languages);
      } else {
        setEditors([]);
        updatePositions([], languages);
      }
    } else {
      const remainingLanguages = languages.filter(l => l.id !== id);
      const totalUsage = remainingLanguages.reduce((sum, l) => sum + l.usage, 0);
      if (remainingLanguages.length > 0) {
        const scaleFactor = 100 / totalUsage;
        const newLanguages = remainingLanguages.map(l => ({ ...l, usage: l.usage * scaleFactor }));
        setLanguages(newLanguages);
        updatePositions(editors, newLanguages);
      } else {
        setLanguages([]);
        updatePositions(editors, []);
      }
    }
    onSelectionChange?.(editors.length > 0 && !isEditor, languages.length > 0 && isEditor);
  };

  const handleSliderChange = (values: number[], isEditor: boolean) => {
    const tools = isEditor ? editors : languages;

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

    if (isEditor) {
      setEditors(updatedTools);
      updatePositions(updatedTools, languages);
    } else {
      setLanguages(updatedTools);
      updatePositions(editors, updatedTools);
    }
  };

  const getColorFromType = (type: number, isEditor: boolean, id: string) => {
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

  const updatePositions = (currentEditors: Tool[], currentLanguages: Tool[]) => {
    const editorPos = calculatePosition(currentEditors);
    const langPos = calculatePosition(currentLanguages);
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
      {!hideButtons && (
        <>
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
        </>
      )}

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
          <ToolList
            tools={editors}
            isEditor={true}
            getColorFromType={getColorFromType}
            onRemove={(id) => removeTool(id, true)}
          />
        </Box>
      )}
      <Typography variant="h6" gutterBottom>Languages</Typography>
      {!hideButtons && (
        <>
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
        </>
      )}

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
          <ToolList
            tools={languages}
            isEditor={false}
            getColorFromType={getColorFromType}
            onRemove={(id) => removeTool(id, false)}
          />
        </Box>
      )}
    </Box>
  );
};

export default InputPanel;

import { Fragment, useState } from 'react';
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
  hideButtons?: boolean;
}


const InputPanel = ({ onPositionUpdate, hideButtons }: InputPanelProps) => {
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
  };

  const removeTool = (id: string, isEditor: boolean) => {
    const currentTools = isEditor ? editors : languages;
    const remainingTools = currentTools.filter(tool => tool.id !== id);

    if (remainingTools.length > 0) {
      const totalUsage = remainingTools.reduce((sum, tool) => sum + tool.usage, 0);
      const scaleFactor = 100 / totalUsage;
      const updatedTools = remainingTools.map(tool => ({
        ...tool,
        usage: tool.usage * scaleFactor
      }));

      if (isEditor) {
        setEditors(updatedTools);
        updatePositions(updatedTools, languages);
      } else {
        setLanguages(updatedTools);
        updatePositions(editors, updatedTools);
      }
    } else {
      if (isEditor) {
        setEditors([]);
        updatePositions([], languages);
      } else {
        setLanguages([]);
        updatePositions(editors, []);
      }
    }
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

  const getColorFromType = (isEditor: boolean, id: string) => {
    if (isEditor && id in editorColors) {
      return editorColors[id];
    } else if (!isEditor && id in languageColors) {
      return languageColors[id];
    }

    // Fallback to the original color interpolation if no predefined color is found
    const type = Math.random() * 100;
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
      marks.push({
        value: accumulator,
        label: '',
        style: {
          '&:before': {
            backgroundColor: getColorFromType(isEditor, tools[i].id)
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
      const editorType = predefinedEditors.find(e => e.id === tool.id)?.score;
      const langType = predefinedLanguages.find(l => l.id === tool.id)?.score;
      const score = editorType ?? langType ?? 50; // default to center if not found
      return sum + (weight * score);
    }, 0);
    // Normalize the weighted sum to be between -1 and 1
    return (weightedSum - 50) / 50;
  };

  return (
    <Box sx={{ mt: 4 }}>
      {[{ title: 'Editors', tools: editors, isEditor: true, items: predefinedEditors },
        { title: 'Languages', tools: languages, isEditor: false, items: predefinedLanguages }].map(section => (
        <Fragment key={section.title}>
          <Typography variant="h6" gutterBottom>{section.title}</Typography>
          {!hideButtons && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {section.items.map(item => (
                <Button
                  key={item.id}
                  variant="outlined"
                  onClick={() => addTool(item, section.isEditor)}
                  disabled={section.tools.some(t => t.id === item.id)}
                  sx={{
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    minHeight: '48px',
                    minWidth: '120px',
                    flex: '1 1 auto',
                    maxWidth: '180px',
                    borderColor: getColorFromType(section.isEditor, item.id),
                    color: getColorFromType(section.isEditor, item.id),
                    '&:hover': {
                      borderColor: getColorFromType(section.isEditor, item.id),
                      backgroundColor: `${getColorFromType(section.isEditor, item.id)}10`
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          {section.tools.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Slider
                value={getSliderValue(section.tools)}
                onChange={(_, value) => handleSliderChange(value as number[], section.isEditor)}
                marks={getSliderMarks(section.tools, section.isEditor)}
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
                      section.tools.map((tool, index, array) => {
                        const startPercent = index === 0 ? 0 : array.slice(0, index).reduce((sum, e) => sum + e.usage, 0);
                        const endPercent = startPercent + tool.usage;
                        return `${getColorFromType(section.isEditor, tool.id)} ${startPercent}% ${endPercent}%`;
                      }).join(', ') + ')'
                  }
                }}
              />
              <ToolList
                tools={section.tools}
                isEditor={section.isEditor}
                getColorFromType={getColorFromType}
                onRemove={(id) => removeTool(id, section.isEditor)}
              />
            </Box>
          )}
        </Fragment>
      ))}
    </Box>
  );
};

export default InputPanel;

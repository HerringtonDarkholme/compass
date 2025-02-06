import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tool } from './InputPanel';
import { predefinedEditors, predefinedLanguages } from '../config/constants';

interface ToolListProps {
  tools: Tool[];
  isEditor: boolean;
  getColorFromType: (type: number, isEditor: boolean, id: string) => string;
  onRemove: (id: string) => void;
}

const ToolList = ({ tools, isEditor, getColorFromType, onRemove }: ToolListProps) => {
  const getType = (id: string) => {
    if (isEditor) {
      return predefinedEditors.find(e => e.id === id)?.type ?? 50;
    }
    return predefinedLanguages.find(l => l.id === id)?.type ?? 50;
  };

  return (
    <List>
      {tools.map((tool) => (
        <ListItem key={tool.id} dense>
          <Box
            sx={{
              width: '16px',
              height: '16px',
              backgroundColor: getColorFromType(getType(tool.id), isEditor, tool.id),
              marginRight: 1,
              flexShrink: 0
            }}
          />
          <ListItemText
            primary={`${tool.name} (${tool.usage.toFixed(1)}%)`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => onRemove(tool.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ToolList;
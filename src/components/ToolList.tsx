import { Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tool } from './InputPanel';

interface ToolListProps {
  tools: Tool[];
  isEditor: boolean;
  getColorFromType: (isEditor: boolean, id: string) => string;
  onRemove: (id: string) => void;
  hideControl?: boolean;
}

const ToolList = ({ tools, isEditor, getColorFromType, onRemove, hideControl }: ToolListProps) => {
  return (
    <List sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tools.map((tool) => (
        <ListItem
          key={tool.id}
          dense
          sx={{
            width: 'auto',
            flex: '0 0 auto',
            maxWidth: '300px',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            m: 0
          }}
        >
          <Box
            sx={{
              width: '16px',
              height: '16px',
              backgroundColor: getColorFromType(isEditor, tool.id),
              marginRight: 1,
              flexShrink: 0
            }}
          />
          <ListItemText
            primary={`${tool.name} (${tool.usage.toFixed(1)}%)`}
          />
          {!hideControl && (
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onRemove(tool.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default ToolList;

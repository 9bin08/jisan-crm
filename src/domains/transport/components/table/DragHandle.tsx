import { DragHandle as DragHandleIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { IconButtonProps } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DragHandleProps extends Omit<IconButtonProps, 'children'> {
    id: string;
}

export function DragHandle({ id, ...props }: DragHandleProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <IconButton
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            size="small"
            sx={{
                cursor: 'grab',
                '&:active': {
                    cursor: 'grabbing',
                },
                color: '#6b7280',
                '&:hover': {
                    color: '#374151',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                padding: '4px',
                minWidth: 'auto',
                width: '24px',
                height: '24px',
            }}
            {...props}
        >
            <DragHandleIcon sx={{ fontSize: 16 }} />
        </IconButton>
    );
}
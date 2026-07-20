// szk3600/esmsh-test - Interactive Konva Shape Library
// ドラッグ＆ドロップおよびスタイル切り替えが可能な React-Konva コア

import React, { useState } from 'react';
import { Rect, Circle } from 'react-konva';

export interface ShapeData {
    id: string;
    type: 'rect' | 'circle';
    x: number;
    y: number;
    color: string;
}

interface InteractiveShapeProps {
    shape: ShapeData;
    onDragStart: (id: string) => void;
    onDragEnd: (id: string, x: number, y: number) => void;
    onDoubleClick: (id: string) => void;
}

export const InteractiveShape: React.FC<InteractiveShapeProps> = ({
    shape,
    onDragStart,
    onDragEnd,
    onDoubleClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const commonProps = {
        x: shape.x,
        y: shape.y,
        draggable: true,
        fill: shape.color,
        // ホバー・ドラッグ時のエフェクト
        shadowBlur: isHovered ? 15 : 6,
        shadowColor: '#000000',
        shadowOpacity: isHovered ? 0.6 : 0.35,
        shadowOffset: isHovered ? { x: 4, y: 4 } : { x: 2, y: 2 },
        scaleX: isHovered ? 1.12 : 1,
        scaleY: isHovered ? 1.12 : 1,
        
        onDragStart: () => onDragStart(shape.id),
        onDragEnd: (e: any) => {
            onDragEnd(shape.id, e.target.x(), e.target.y());
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onDblClick: () => onDoubleClick(shape.id),
        perfectDrawEnabled: true
    };

    if (shape.type === 'rect') {
        return (
            <Rect
                {...commonProps}
                width={70}
                height={70}
                offsetX={35} // 中心点を基準にする
                offsetY={35}
                cornerRadius={10}
            />
        );
    } else {
        return (
            <Circle
                {...commonProps}
                radius={36}
            />
        );
    }
};

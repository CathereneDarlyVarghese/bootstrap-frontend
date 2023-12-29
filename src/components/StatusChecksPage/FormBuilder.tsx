import React, { useState } from 'react';

interface FormElement {
  type: string;
  id: number;
}

const DraggableElement: React.FC<{ label: string; elementType: string }> = ({
  label,
  elementType,
}) => {
  const dragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', elementType);
  };

  return (
    <div draggable onDragStart={dragStart}>
      {label}
    </div>
  );
};

const FormBuilder: React.FC = () => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const elementType = event.dataTransfer.getData('text/plain');
    const newElement = { type: elementType, id: Date.now() };
    setFormElements([...formElements, newElement]);
  };

  return (
    <div>
      <div id="toolbox">
        <DraggableElement label="Text Input" elementType="text" />
        <DraggableElement label="Textarea" elementType="textarea" />
        <DraggableElement label="Checkbox" elementType="checkbox" />
        <DraggableElement label="Radio Button" elementType="radio" />
      </div>
      <div id="formArea" onDragOver={onDragOver} onDrop={onDrop}>
        {formElements.map(element => (
          <div key={element.id}>{element.type}</div>
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
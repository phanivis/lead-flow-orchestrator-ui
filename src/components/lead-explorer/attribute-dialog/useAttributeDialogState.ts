
import { useState, useEffect } from 'react';

export const useAttributeDialogState = (attributeToEdit?: any) => {
  // State for editing
  const [isEditMode, setIsEditMode] = useState(false);
  const [editorMode, setEditorMode] = useState<"builder" | "sql">("builder");
  const [attributeName, setAttributeName] = useState('');
  const [description, setDescription] = useState('');
  const [resultType, setResultType] = useState('number');
  const [calculatedAttr, setCalculatedAttr] = useState({
    firstAttribute: '',
    operator: '+',
    secondAttribute: '',
  });
  const [sqlExpression, setSqlExpression] = useState('');

  // Set up form for editing if attributeToEdit is provided
  useEffect(() => {
    if (attributeToEdit) {
      setIsEditMode(true);
      setAttributeName(attributeToEdit.name);
      setResultType(attributeToEdit.type.toLowerCase());
      setDescription(attributeToEdit.description || '');
      
      // Determine which editor mode to use based on attribute data
      if (attributeToEdit.formula) {
        setEditorMode('builder');
        setCalculatedAttr({
          firstAttribute: String(attributeToEdit.formula.firstAttribute),
          operator: attributeToEdit.formula.operator,
          secondAttribute: String(attributeToEdit.formula.secondAttribute)
        });
      } else if (attributeToEdit.sqlExpression) {
        setEditorMode('sql');
        setSqlExpression(attributeToEdit.sqlExpression);
      } else {
        // Default to builder mode if no formula info
        setEditorMode('builder');
      }
    } else {
      // Reset form when opening for new attribute
      resetForm();
    }
  }, [attributeToEdit]);

  const resetForm = () => {
    setIsEditMode(false);
    setAttributeName('');
    setDescription('');
    setResultType('number');
    setCalculatedAttr({
      firstAttribute: '',
      operator: '+',
      secondAttribute: '',
    });
    setSqlExpression('');
    setEditorMode('builder');
  };

  return {
    isEditMode,
    editorMode,
    setEditorMode,
    attributeName,
    setAttributeName,
    description,
    setDescription,
    resultType,
    setResultType,
    calculatedAttr,
    setCalculatedAttr,
    sqlExpression,
    setSqlExpression,
    resetForm
  };
};

import { useEffect, useState } from 'react';

export default function AutoCompleteDropdown({ mode='normal',type, value, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectValue, setSelectValue] = useState(value || (mode === 'checkbox' ? [] : ''));

  useEffect(() => {
    fetch(`/api/${type}`)
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((item) => item.name);
        setOptions(names);
      });
  }, [type]);

  const handleSelect = async (e) => {
    const selected = e.target.value;

    if (selected === 'add-new') {
      const newName = prompt(`Enter new ${type} name:`)?.trim();
      if (newName && !options.includes(newName)) {
        setOptions((prev) => [...prev, newName]);
        setSelectValue(newName);
        onChange(newName);

        await fetch(`/api/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
      } else {
        if (mode === 'normal') {
          setSelectValue(value || '');
        }
      }
    } else {
      if (mode === 'normal') {
        setSelectValue(selected);
        onChange(selected);
      }
    }
  };

    const handleCheckboxChange = (option) => {
    let updated;
    if (selectValue.includes(option)) {
      updated = selectValue.filter((item) => item !== option);
    } else {
      updated = [...selectValue, option];
    }
    setSelectValue(updated);
    onChange(updated);
  };

  const renderedOptions = selectValue && !options.includes(selectValue)
  ? [selectValue, ...options]
  : options;

  return (
    <>
      {mode === 'normal' ? (
        <select value={selectValue} onChange={handleSelect} className="border p-2 rounded w-full">
          <option value="">Select {type}</option>
          {renderedOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="add-new">➕ Add new...</option>
        </select>
      ) : (
        <div className="border p-2 rounded w-full max-h-30 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectValue.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
          <button
            type="button"
            onClick={() => handleSelect({ target: { value: 'add-new' } })}
            className="text-blue-600 text-sm mt-2"
          >
            ➕ Add new...
          </button>
        </div>
      )}
    </>
  );
}
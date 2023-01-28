import styled from "styled-components";

const TextArea = styled.textarea`
  border: 2px solid #ddd;
  padding: 5px;
`;

export function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <TextArea
      rows={12}
      cols={80}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

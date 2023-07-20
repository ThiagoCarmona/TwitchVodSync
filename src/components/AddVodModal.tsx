import { Modal, Input } from "antd";
import React from "react";

interface AddVodModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddVod: (vod: string) => void;
}

export const AddVodModal: React.FC<AddVodModalProps> = ({
  open,
  handleClose,
  handleAddVod,
}) => {
  const [input, setInput] = React.useState<string>("");

  const handleAddVodClick = () => {
    handleAddVod(input);
    handleClose();
    setInput("");
  };

  return (
    <Modal
      title="Add VOD"
      open={open}
      onOk={handleAddVodClick}
      onCancel={handleClose}
    >
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter VOD URL"
      />
    </Modal>
  );
}
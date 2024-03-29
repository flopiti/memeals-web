import React from "react";
import styles from "@/styles/Home.module.css";

export const DropZone = (props: any) => {
  const handleDrop = (event: any) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("1");
    const data2 = event.dataTransfer.getData("2");
    const data3 = event.dataTransfer.getData("3");
    props.onDrop(data, data2, data3);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={styles.dropzone}
    >
      {props.children}
    </div>
  );
};

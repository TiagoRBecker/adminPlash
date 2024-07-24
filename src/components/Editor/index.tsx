"use client";
import React, { useState, useRef, useMemo } from "react";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const TextEditor = ({ placeholder ,content,setContent}: any) => {
  const editor = useRef(null);

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder:placeholder,
    height: 350,
    buttons: "bold,italic,underline,|,ul,ol,|,link,|,indent,outdent,|,align,|,undo,redo,|,font,fontsize,color,brush,|,image" 
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      //@ts-ignore
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => setContent(newContent)}// preferred to use only this option to update the content for performance reasons
      onChange={(newContent)=>{}}
    />
  );
};
export default TextEditor;
